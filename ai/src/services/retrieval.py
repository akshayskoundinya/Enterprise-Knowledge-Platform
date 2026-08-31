from src.embeddings.gemini import (
    get_embedding_model,
)
from src.retrieval.multi_query import (
    generate_multi_queries,
)
from src.retrieval.rrf import (
    reciprocal_rank_fusion,
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

    embedding_model = get_embedding_model()

    alternative_queries = (
        await generate_multi_queries(query)
    )

    queries = [
        query,
        *alternative_queries,
    ]

    result_lists = []

    for search_query in queries:
        query_vector = (
            await embedding_model.aembed_query(
                search_query
            )
        )

        points = await search_similar_chunks(
            query_vector=query_vector,
            allowed_document_ids=allowed_document_ids,
            limit=top_k,
        )

        result_lists.append(points)

    return reciprocal_rank_fusion(
        result_lists=result_lists,
        top_k=top_k,
    )