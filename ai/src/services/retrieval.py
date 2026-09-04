from src.embeddings.gemini import (
    get_embedding_model,
)
from src.retrieval.bm25 import (
    search_bm25,
)
from src.retrieval.models import (
    RetrievalResult,
)
from src.retrieval.multi_query import (
    generate_multi_queries,
)
from src.retrieval.rrf import (
    reciprocal_rank_fusion,
)
from src.reranking.cross_encoder import (
    rerank_documents,
)
from src.vectorstore.search import (
    search_similar_chunks,
)


async def retrieve_documents(
    query: str,
    allowed_document_ids: list[str],
    top_k: int,
):
    if not allowed_document_ids:
        return []

    retrieval_top_k = max(
        top_k * 4,
        20,
    )

    bm25_chunks = search_bm25(
        query=query,
        allowed_document_ids=allowed_document_ids,
        top_k=retrieval_top_k,
    )

    bm25_results = [
        RetrievalResult(
            chunk_id=chunk.chunk_id,
            document_id=chunk.document_id,
            page=chunk.page,
            text=chunk.text,
            score=chunk.score,
            source="bm25",
        )
        for chunk in bm25_chunks
    ]

    embedding_model = get_embedding_model()

    alternative_queries = (
        await generate_multi_queries(query)
    )

    queries = [
        query,
        *alternative_queries,
    ]

    result_lists: list[list[RetrievalResult]] = []

    for search_query in queries:
        query_vector = (
            await embedding_model.aembed_query(
                search_query
            )
        )

        points = await search_similar_chunks(
            query_vector=query_vector,
            allowed_document_ids=allowed_document_ids,
            limit=retrieval_top_k,
        )

        dense_results = [
            RetrievalResult(
                chunk_id=str(
                    point.payload["chunk_id"]
                ),
                document_id=str(
                    point.payload["document_id"]
                ),
                page=point.payload.get("page"),
                text=str(
                    point.payload["text"]
                ),
                score=float(
                    point.score or 0.0
                ),
                source="dense",
            )
            for point in points
        ]

        result_lists.append(
            dense_results
        )

    result_lists.append(
        bm25_results
    )

    fused_results = reciprocal_rank_fusion(
        result_lists=result_lists,
        top_k=retrieval_top_k,
    )

    return rerank_documents(
        query=query,
        candidates=fused_results,
        top_k=top_k,
    )