from langchain_core.documents import Document

from src.clients.express_client import (
    get_document_content,
)
from src.embeddings.gemini import (
    get_embedding_model,
)
from src.ingestion.chunker import (
    chunk_documents,
)
from src.ingestion.pdf_loader import (
    load_pdf,
)
from src.vectorstore.collection import (
    ensure_collection,
)
from src.vectorstore.repository import (
    upsert_chunks,
)


async def ingest_document(
    document_id: str,
) -> list[Document]:

    content = await get_document_content(
        document_id
    )

    documents = load_pdf(content)

    chunks = chunk_documents(
        documents,
        document_id,
    )

    embedding_model = get_embedding_model()

    vectors = (
        await embedding_model.aembed_documents(
            [
                chunk.page_content
                for chunk in chunks
            ]
        )
    )

    await ensure_collection()

    await upsert_chunks(
        chunks,
        vectors,
    )

    print(
        f"Document {document_id}: "
        f"{len(chunks)} chunks → "
        f"{len(vectors)} vectors → "
        f"Qdrant"
    )

    return chunks