from src.graph.rag import build_rag_graph
from src.retrieval.models import RetrievalResult


rag_graph = build_rag_graph()


async def run_rag(
    query: str,
    allowed_document_ids: list[str],
    top_k: int,
) -> tuple[str, list[RetrievalResult]]:

    result = await rag_graph.ainvoke(
        {
            "query": query,
            "allowed_document_ids": allowed_document_ids,
            "top_k": top_k,
            "retrieved_documents": [],
            "answer": "",
        }
    )

    return (
        result["answer"],
        result["retrieved_documents"],
    )