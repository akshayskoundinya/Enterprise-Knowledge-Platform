from qdrant_client import models

from src.config.settings import get_settings
from src.vectorstore.qdrant import (
    get_qdrant_client,
)


async def ensure_collection() -> None:
    settings = get_settings()
    client = get_qdrant_client()

    exists = await client.collection_exists(
        settings.qdrant_collection_name
    )

    if exists:
        return

    await client.create_collection(
        collection_name=(
            settings.qdrant_collection_name
        ),
        vectors_config=models.VectorParams(
            size=3072,
            distance=models.Distance.COSINE,
        ),
    )