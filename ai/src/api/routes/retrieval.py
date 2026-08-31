from fastapi import APIRouter, Depends

from src.api.dependencies import (
    verify_internal_api_key,
)
from src.api.schemas.retrieval import (
    RetrievalSearchRequest,
    RetrievalSearchResponse,
    RetrievedChunk,
)
from src.services.retrieval import (
    retrieve_documents,
)

router = APIRouter(
    prefix="/internal/v1/retrieval",
    tags=["retrieval"],
)


@router.post(
    "/search",
    response_model=RetrievalSearchResponse,
    dependencies=[
        Depends(verify_internal_api_key)
    ],
)
async def search(
    request: RetrievalSearchRequest,
) -> RetrievalSearchResponse:

    points = await retrieve_documents(
        query=request.query,
        allowed_document_ids=(
            request.allowed_document_ids
        ),
        top_k=request.top_k,
    )

    results = []

    for point in points:
        payload = point.payload or {}

        results.append(
            RetrievedChunk(
                chunk_id=str(
                    payload["chunk_id"]
                ),
                document_id=str(
                    payload["document_id"]
                ),
                page=payload.get("page"),
                text=str(
                    payload["text"]
                ),
                score=point.score,
            )
        )

    return RetrievalSearchResponse(
        results=results
    )