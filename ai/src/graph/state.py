from typing import TypedDict

from src.retrieval.models import RetrievalResult


class RAGState(TypedDict):
    query: str
    allowed_document_ids: list[str]
    top_k: int

    retrieved_documents: list[RetrievalResult]
    answer: str