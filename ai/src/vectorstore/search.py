from qdrant_client import models

from src.config.settings import get_settings
from src.vectorstore.qdrant import (
    get_qdrant_client,
)


async def search_similar_chunks(
    query_vector: list[float],
    allowed_document_ids: list[str],
    limit: int,
) -> list[models.ScoredPoint]:

    settings = get_settings()
    client = get_qdrant_client()

    result = await client.query_points(
        collection_name=(
            settings.qdrant_collection_name
        ),
        query=query_vector,
        query_filter=models.Filter(
            must=[
                models.FieldCondition(
                    key="document_id",
                    match=models.MatchAny(
                        any=allowed_document_ids
                    ),
                )
            ]
        ),
        limit=limit,
        with_payload=True,
    )

    return result.points