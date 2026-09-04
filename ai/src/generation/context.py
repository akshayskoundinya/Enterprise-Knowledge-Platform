from src.retrieval.models import RetrievalResult


def build_context(
    results: list[RetrievalResult],
) -> str:
    if not results:
        return ""

    sections: list[str] = []

    for index, result in enumerate(
        results,
        start=1,
    ):
        page = (
            result.page
            if result.page is not None
            else "unknown"
        )

        sections.append(
            f"[Source {index}]\n"
            f"Document ID: {result.document_id}\n"
            f"Chunk ID: {result.chunk_id}\n"
            f"Page: {page}\n"
            f"Content:\n{result.text}"
        )

    return "\n\n".join(sections)