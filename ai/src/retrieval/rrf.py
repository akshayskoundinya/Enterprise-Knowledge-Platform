from collections import defaultdict

from qdrant_client import models


def reciprocal_rank_fusion(
    result_lists: list[list[models.ScoredPoint]],
    top_k: int,
    k: int = 60,
) -> list[models.ScoredPoint]:
    scores: dict[str, float] = defaultdict(float)
    documents: dict[str, models.ScoredPoint] = {}

    for result_list in result_lists:
        for rank, result in enumerate(
            result_list,
            start=1,
        ):
            payload = result.payload or {}

            chunk_id = payload.get("chunk_id")

            if not chunk_id:
                continue

            scores[chunk_id] += 1 / (
                k + rank
            )

            documents[chunk_id] = result

    ranked_chunk_ids = sorted(
        scores,
        key=lambda chunk_id: scores[chunk_id],
        reverse=True,
    )

    return [
        documents[chunk_id]
        for chunk_id in ranked_chunk_ids[:top_k]
    ]