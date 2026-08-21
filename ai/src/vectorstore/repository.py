from langchain_core.documents import Document
from qdrant_client import models

from src.config.settings import get_settings
from src.vectorstore.qdrant import (
    get_qdrant_client,
)


async def upsert_chunks(
    chunks: list[Document],
    vectors: list[list[float]],
) -> None:

    if len(chunks) != len(vectors):
        raise ValueError(
            "Number of chunks must match "
            "number of vectors"
        )

    settings = get_settings()
    client = get_qdrant_client()

    points = []

    for chunk, vector in zip(
        chunks,
        vectors,
        strict=True,
    ):
        points.append(
            models.PointStruct(
                id=chunk.metadata["chunk_id"],
                vector=vector,
                payload={
                    "document_id":
                        chunk.metadata[
                            "document_id"
                        ],
                    "chunk_id":
                        chunk.metadata[
                            "chunk_id"
                        ],
                    "page":
                        chunk.metadata.get(
                            "page"
                        ),
                    "text":
                        chunk.page_content,
                },
            )
        )

    await client.upsert(
        collection_name=(
            settings.qdrant_collection_name
        ),
        points=points,
        wait=True,
    )