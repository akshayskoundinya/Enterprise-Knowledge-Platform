from dataclasses import dataclass


@dataclass(frozen=True)
class EvaluationCase:
    id: str
    question: str
    document_ids: list[str]
    relevant_chunk_ids: list[str]
    reference_answer: str


@dataclass(frozen=True)
class RetrievalMetrics:
    precision_at_k: float
    recall_at_k: float
    reciprocal_rank: float


@dataclass(frozen=True)
class GenerationMetrics:
    groundedness: float
    relevance: float
    hallucination: float


@dataclass(frozen=True)
class EvaluationTiming:
    retrieval_seconds: float
    judge_seconds: float


@dataclass(frozen=True)
class EvaluationResult:
    case_id: str
    answer: str
    retrieval: RetrievalMetrics
    generation: GenerationMetrics | None
    timing: EvaluationTiming