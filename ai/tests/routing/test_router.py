from src.routing.router import (
    RequestType,
    route_request,
)


def test_empty_query_is_unknown():
    assert route_request("") == RequestType.UNKNOWN


def test_whitespace_query_is_unknown():
    assert route_request("   ") == RequestType.UNKNOWN


def test_question_uses_rag():
    assert (
        route_request(
            "What is mobile learning?"
        )
        == RequestType.RAG
    )


def test_any_non_empty_query_uses_rag():
    assert (
        route_request(
            "Explain the findings in the document"
        )
        == RequestType.RAG
    )