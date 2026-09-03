from dataclasses import dataclass


@dataclass(frozen=True)
class RetrievalResult:
    chunk_id: str
    document_id: str
    page: int | None
    text: str
    score: float
    source: str
    rrf_score: float = 0.0
    rerank_score: float = 0.0