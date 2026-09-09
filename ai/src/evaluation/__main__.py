import asyncio

from src.evaluation.metrics import (
    average_generation_metrics,
    average_retrieval_metrics,
)
from src.evaluation.runner import evaluate_dataset


async def main() -> None:
    results = await evaluate_dataset(
        top_k=5,
    )

    print()
    print("===== RAG EVALUATION =====")
    print()

    for result in results:
        retrieval = result.retrieval
        generation = result.generation
        timing = result.timing

        print(f"--- {result.case_id} ---")

        print(
            f"Precision@5: {retrieval.precision_at_k:.2f}"
        )

        print(
            f"Recall@5:    {retrieval.recall_at_k:.2f}"
        )

        print(
            f"MRR:         {retrieval.reciprocal_rank:.2f}"
        )

        if generation is not None:
            print(
                f"Groundedness:  {generation.groundedness:.2f}"
            )

            print(
                f"Relevance:     {generation.relevance:.2f}"
            )

            print(
                f"Hallucination: {generation.hallucination:.2f}"
            )

        print(
            f"Retrieval latency: "
            f"{timing.retrieval_seconds:.2f}s"
        )

        print(
            f"Judge latency:     "
            f"{timing.judge_seconds:.2f}s"
        )

        print()
        print("Answer:")
        print(result.answer)
        print()

    precision, recall, mrr = (
        average_retrieval_metrics(results)
    )

    groundedness, relevance, hallucination = (
        average_generation_metrics(results)
    )

    print("===== EVALUATION SUMMARY =====")
    print()

    print("Retrieval")
    print(
        f"  Precision@5: {precision:.2f}"
    )
    print(
        f"  Recall@5:    {recall:.2f}"
    )
    print(
        f"  MRR:         {mrr:.2f}"
    )

    print()

    print("Generation")
    print(
        f"  Groundedness:  {groundedness:.2f}"
    )
    print(
        f"  Relevance:     {relevance:.2f}"
    )
    print(
        f"  Hallucination: {hallucination:.2f}"
    )


if __name__ == "__main__":
    asyncio.run(main())