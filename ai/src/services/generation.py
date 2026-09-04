from src.retrieval.models import RetrievalResult
from src.services.rag import run_rag


async def generate_answer(
    query: str,
    allowed_document_ids: list[str],
    top_k: int,
) -> tuple[
    str,
    list[RetrievalResult],
]:
    return await run_rag(
        query=query,
        allowed_document_ids=allowed_document_ids,
        top_k=top_k,
    )