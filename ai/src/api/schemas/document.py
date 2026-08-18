from pydantic import BaseModel, Field 


class ProcessDocumentRequest(BaseModel):
    document_id: str = Field(min_length=1)
    storage_key: str = Field(min_length=1)
    mime_type: str = Field(min_length=1)

    # Express determines this scope.
    allowed_user_ids: list[str] = Field(
        default_factory=list
    )
class ProcessDocumentResponse(BaseModel):
    document_id: str
    status: str