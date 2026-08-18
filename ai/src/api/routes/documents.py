from fastapi import APIRouter, Depends 

from src.api.dependencies import verify_internal_api_key
from src.api.schemas.document import (
    ProcessDocumentRequest,
    ProcessDocumentResponse,
)

router = APIRouter(
    prefix="/internal/v1/documents",
    tags=["documents"],
)


@router.post(
    "/process",
    response_model=ProcessDocumentResponse,
    dependencies=[Depends(verify_internal_api_key)],
)
async def process_document(
    request: ProcessDocumentRequest,
) -> ProcessDocumentResponse:
    return ProcessDocumentResponse(
        document_id=request.document_id,
        status="ACCEPTED",
    )