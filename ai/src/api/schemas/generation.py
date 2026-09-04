from pydantic import BaseModel, Field


class GenerationRequest(BaseModel):
    query: str = Field(
        min_length=1,
        max_length=2000,
    )

    user_id: str

    allowed_document_ids: list[str] = Field(
        default_factory=list,
    )

    top_k: int = Field(
        default=5,
        ge=1,
        le=20,
    )


class SourceReference(BaseModel):
    chunk_id: str
    document_id: str
    page: int | None


class GenerationResponse(BaseModel):
    answer: str
    sources: list[SourceReference]