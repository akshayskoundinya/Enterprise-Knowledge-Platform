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

    results = await retrieve_documents(
        query=request.query,
        allowed_document_ids=(
            request.allowed_document_ids
        ),
        top_k=request.top_k,
    )

    return RetrievalSearchResponse(
        results=[
            RetrievedChunk(
                chunk_id=result.chunk_id,
                document_id=result.document_id,
                page=result.page,
                text=result.text,
                score=result.score,
                source=result.source,
                rrf_score=result.rrf_score,
                rerank_score=result.rerank_score,
            )
            for result in results
        ]
    )