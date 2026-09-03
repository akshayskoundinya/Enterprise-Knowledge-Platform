from collections import defaultdict

from src.retrieval.models import RetrievalResult


def reciprocal_rank_fusion(
    result_lists: list[list[RetrievalResult]],
    top_k: int,
    k: int = 60,
) -> list[RetrievalResult]:
    scores: dict[str, float] = defaultdict(float)
    documents: dict[str, RetrievalResult] = {}

    for result_list in result_lists:
        for rank, result in enumerate(
            result_list,
            start=1,
        ):
            chunk_id = result.chunk_id

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
        RetrievalResult(
            chunk_id=documents[chunk_id].chunk_id,
            document_id=documents[chunk_id].document_id,
            page=documents[chunk_id].page,
            text=documents[chunk_id].text,
            score=documents[chunk_id].score,
            source=documents[chunk_id].source,
            rrf_score=scores[chunk_id],
            rerank_score=documents[chunk_id].rerank_score,
        )
        for chunk_id in ranked_chunk_ids[:top_k]
    ]