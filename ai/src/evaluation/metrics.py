def precision_at_k(
    retrieved_chunk_ids: list[str],
    relevant_chunk_ids: list[str],
    k: int,
) -> float:
    retrieved = retrieved_chunk_ids[:k]

    if not retrieved:
        return 0.0

    relevant = set(relevant_chunk_ids)

    relevant_retrieved = sum(
        chunk_id in relevant
        for chunk_id in retrieved
    )

    return relevant_retrieved / len(retrieved)


def recall_at_k(
    retrieved_chunk_ids: list[str],
    relevant_chunk_ids: list[str],
    k: int,
) -> float:
    relevant = set(relevant_chunk_ids)

    if not relevant:
        return 0.0

    retrieved = retrieved_chunk_ids[:k]

    relevant_retrieved = sum(
        chunk_id in relevant
        for chunk_id in retrieved
    )

    return relevant_retrieved / len(relevant)


def reciprocal_rank(
    retrieved_chunk_ids: list[str],
    relevant_chunk_ids: list[str],
) -> float:
    relevant = set(relevant_chunk_ids)

    for rank, chunk_id in enumerate(
        retrieved_chunk_ids,
        start=1,
    ):
        if chunk_id in relevant:
            return 1.0 / rank

    return 0.0


def average(
    values: list[float],
) -> float:
    if not values:
        return 0.0

    return sum(values) / len(values)


def average_retrieval_metrics(
    results,
) -> tuple[float, float, float]:
    precision = average(
        [
            result.retrieval.precision_at_k
            for result in results
        ]
    )

    recall = average(
        [
            result.retrieval.recall_at_k
            for result in results
        ]
    )

    mrr = average(
        [
            result.retrieval.reciprocal_rank
            for result in results
        ]
    )

    return precision, recall, mrr


def average_generation_metrics(
    results,
) -> tuple[float, float, float]:
    generation_results = [
        result.generation
        for result in results
        if result.generation is not None
    ]

    if not generation_results:
        return 0.0, 0.0, 0.0

    groundedness = average(
        [
            result.groundedness
            for result in generation_results
        ]
    )

    relevance = average(
        [
            result.relevance
            for result in generation_results
        ]
    )

    hallucination = average(
        [
            result.hallucination
            for result in generation_results
        ]
    )

    return (
        groundedness,
        relevance,
        hallucination,
    )