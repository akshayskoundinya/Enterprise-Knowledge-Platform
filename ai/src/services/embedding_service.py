from langchain_core.documents import Document

from src.embeddings.gemini import (
    get_embedding_model,
)


async def embed_documents(
    documents: list[Document],
) -> list[list[float]]:
    embeddings = get_embedding_model()

    return await embeddings.aembed_documents(
        [
            document.page_content
            for document in documents
        ]
    )