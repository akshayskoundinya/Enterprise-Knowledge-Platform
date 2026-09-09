from enum import StrEnum


class RequestType(StrEnum):
    RAG = "rag"
    UNKNOWN = "unknown"


def route_request(
    query: str,
) -> RequestType:
    normalized_query = query.strip()

    if not normalized_query:
        return RequestType.UNKNOWN

    return RequestType.RAG