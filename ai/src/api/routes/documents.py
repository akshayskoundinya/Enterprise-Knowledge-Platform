from fastapi import APIRouter, Depends 

from src.api.dependencies import verify_internal_api_key
from src.api.schemas.document import (
    ProcessDocumentRequest,
    ProcessDocumentResponse,
)
from src.clients.express_client import (
    get_document_content,
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

    document_content = await get_document_content(
        request.document_id
    )

    print(
        f"Retrieved document "
        f"{request.document_id}: "
        f"{len(document_content)} bytes"
    )

    return ProcessDocumentResponse(
        document_id=request.document_id,
        status="ACCEPTED",
    )