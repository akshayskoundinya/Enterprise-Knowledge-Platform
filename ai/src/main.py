from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.api.routes.documents import router as documents_router
from src.api.routes.retrieval import router as retrieval_router
from src.api.routes.generation import router as generation_router
from src.config.settings import get_settings
from src.config.langsmith import configure_langsmith
from src.core.exceptions import AIServiceError


configure_langsmith()

settings = get_settings()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)


@app.exception_handler(AIServiceError)
async def ai_service_exception_handler(
    request: Request,
    exc: AIServiceError,
) -> JSONResponse:
    return JSONResponse(
        status_code=503,
        content={
            "error": {
                "code": exc.__class__.__name__,
                "message": str(exc),
            }
        },
    )


app.include_router(documents_router)
app.include_router(retrieval_router)
app.include_router(generation_router)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ai",
    }