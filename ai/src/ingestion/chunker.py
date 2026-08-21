from uuid import uuid4

from langchain_core.documents import Document
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
)


text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)


def chunk_documents(
    documents: list[Document],
    document_id: str,
) -> list[Document]:
    chunks = text_splitter.split_documents(
        documents
    )

    for chunk in chunks:
        chunk.metadata["document_id"] = (
            document_id
        )

        chunk.metadata["chunk_id"] = str(
            uuid4()
        )

    return chunks