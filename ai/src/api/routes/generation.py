from fastapi import APIRouter, Depends

from src.api.dependencies import verify_internal_api_key
from src.api.schemas.generation import (
    GenerationRequest,
    GenerationResponse,
    SourceReference,
)
from src.services.generation import generate_answer


router = APIRouter(
    prefix="/internal/v1/generation",
    tags=["generation"],
)


@router.post(
    "/answer",
    response_model=GenerationResponse,
    dependencies=[
        Depends(verify_internal_api_key)
    ],
)
async def answer(
    request: GenerationRequest,
) -> GenerationResponse:

    answer_text, results = await generate_answer(
        query=request.query,
        allowed_document_ids=(
            request.allowed_document_ids
        ),
        top_k=request.top_k,
    )

    return GenerationResponse(
        answer=answer_text,
        sources=[
            SourceReference(
                chunk_id=result.chunk_id,
                document_id=result.document_id,
                page=result.page,
            )
            for result in results
        ],
    )