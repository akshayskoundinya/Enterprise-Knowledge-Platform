from src.evaluation.dataset import EVALUATION_DATASET
from src.evaluation.generated_answers import GENERATED_ANSWERS
from src.evaluation.judge import judge_generation
from src.evaluation.metrics import (
    precision_at_k,
    recall_at_k,
    reciprocal_rank,
)
from src.evaluation.models import (
    EvaluationResult,
    EvaluationTiming,
    GenerationMetrics,
    RetrievalMetrics,
)
from src.services.retrieval import retrieve_documents
import time


async def evaluate_case(
    case,
    top_k: int,
) -> EvaluationResult:

    retrieval_start = time.perf_counter()

    retrieved_documents = await retrieve_documents(
        query=case.question,
        allowed_document_ids=case.document_ids,
        top_k=top_k,
    )

    retrieval_seconds = (
        time.perf_counter() - retrieval_start
    )

    retrieved_chunk_ids = [
        result.chunk_id
        for result in retrieved_documents
    ]

    retrieval_metrics = RetrievalMetrics(
        precision_at_k=precision_at_k(
            retrieved_chunk_ids,
            case.relevant_chunk_ids,
            top_k,
        ),
        recall_at_k=recall_at_k(
            retrieved_chunk_ids,
            case.relevant_chunk_ids,
            top_k,
        ),
        reciprocal_rank=reciprocal_rank(
            retrieved_chunk_ids,
            case.relevant_chunk_ids,
        ),
    )

    answer = GENERATED_ANSWERS[case.id]

    judge_start = time.perf_counter()

    generation_judgment = judge_generation(
        question=case.question,
        answer=answer,
        retrieved_documents=retrieved_documents,
        reference_answer=case.reference_answer,
    )

    judge_seconds = (
        time.perf_counter() - judge_start
    )

    generation_metrics = GenerationMetrics(
        groundedness=generation_judgment.groundedness,
        relevance=generation_judgment.relevance,
        hallucination=generation_judgment.hallucination,
    )

    return EvaluationResult(
        case_id=case.id,
        answer=answer,
        retrieval=retrieval_metrics,
        generation=generation_metrics,
        timing=EvaluationTiming(
            retrieval_seconds=retrieval_seconds,
            judge_seconds=judge_seconds,
        ),
    )


async def evaluate_dataset(
    top_k: int = 5,
) -> list[EvaluationResult]:
    results: list[EvaluationResult] = []

    for case in EVALUATION_DATASET:
        result = await evaluate_case(
            case=case,
            top_k=top_k,
        )

        results.append(result)

    return results