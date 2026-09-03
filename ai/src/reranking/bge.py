from functools import lru_cache

from sentence_transformers import CrossEncoder

from src.config.settings import get_settings
from src.retrieval.models import RetrievalResult


@lru_cache
def get_reranker() -> CrossEncoder:
    settings = get_settings()

    return CrossEncoder(
        settings.reranker_model,
    )


def rerank_documents(
    query: str,
    candidates: list[RetrievalResult],
    top_k: int,
) -> list[RetrievalResult]:
    if not candidates:
        return []

    reranker = get_reranker()

    pairs = [
        (query, candidate.text)
        for candidate in candidates
    ]

    scores = reranker.predict(pairs)

    ranked_results = sorted(
        zip(candidates, scores),
        key=lambda item: float(item[1]),
        reverse=True,
    )

    return [
        RetrievalResult(
            chunk_id=result.chunk_id,
            document_id=result.document_id,
            page=result.page,
            text=result.text,
            score=result.score,
            source=result.source,
            rrf_score=result.rrf_score,
            rerank_score=float(score),
        )
        for result, score in ranked_results[:top_k]
    ]