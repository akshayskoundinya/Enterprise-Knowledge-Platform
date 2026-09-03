from dataclasses import dataclass

from langchain_core.documents import Document
from rank_bm25 import BM25Okapi


@dataclass(frozen=True)
class BM25Chunk:
    chunk_id: str
    document_id: str
    page: int | None
    text: str
    score: float


class BM25Index:
    def __init__(self) -> None:
        self._chunks: list[BM25Chunk] = []
        self._bm25: BM25Okapi | None = None

    def add_chunks(
        self,
        chunks: list[Document],
    ) -> None:
        for chunk in chunks:
            self._chunks.append(
                BM25Chunk(
                    chunk_id=chunk.metadata["chunk_id"],
                    document_id=chunk.metadata["document_id"],
                    page=chunk.metadata.get("page"),
                    text=chunk.page_content,
                    score=0.0,
                )
            )

        self._rebuild()

    def _rebuild(self) -> None:
        if not self._chunks:
            self._bm25 = None
            return

        tokenized_corpus = [
            chunk.text.lower().split()
            for chunk in self._chunks
        ]

        self._bm25 = BM25Okapi(
            tokenized_corpus
        )

    def search(
        self,
        query: str,
        allowed_document_ids: list[str],
        top_k: int,
    ) -> list[BM25Chunk]:

        if not self._bm25:
            return []

        allowed_ids = set(
            allowed_document_ids
        )

        candidate_indexes = [
            index
            for index, chunk in enumerate(
                self._chunks
            )
            if chunk.document_id in allowed_ids
        ]

        if not candidate_indexes:
            return []

        query_tokens = query.lower().split()

        scores = self._bm25.get_scores(
            query_tokens
        )

        ranked_indexes = sorted(
            candidate_indexes,
            key=lambda index: scores[index],
            reverse=True,
        )

        return [
            BM25Chunk(
                chunk_id=self._chunks[index].chunk_id,
                document_id=self._chunks[index].document_id,
                page=self._chunks[index].page,
                text=self._chunks[index].text,
                score=float(scores[index]),
            )
            for index in ranked_indexes[:top_k]
        ]


bm25_index = BM25Index()

def search_bm25(
    query: str,
    allowed_document_ids: list[str],
    top_k: int,
) -> list[BM25Chunk]:
    return bm25_index.search(
        query=query,
        allowed_document_ids=allowed_document_ids,
        top_k=top_k,
    )