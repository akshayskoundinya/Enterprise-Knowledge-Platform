from fastapi import APIRouter, Depends

from src.api.dependencies import (
    verify_internal_api_key,
)
from src.api.schemas.document import (
    ProcessDocumentRequest,
    ProcessDocumentResponse,
)
from src.services.document_ingestion import (
    ingest_document,
)

router = APIRouter(
    prefix="/internal/v1/documents",
    tags=["documents"],
)


@router.post(
    "/process",
    response_model=ProcessDocumentResponse,
    dependencies=[
        Depends(verify_internal_api_key)
    ],
)
async def process_document(
    request: ProcessDocumentRequest,
) -> ProcessDocumentResponse:

    chunks = await ingest_document(
        request.document_id
    )

    print(
        f"Created {len(chunks)} chunks"
    )

    return ProcessDocumentResponse(
        document_id=request.document_id,
        status="ACCEPTED",
    )