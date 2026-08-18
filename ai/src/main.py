from fastapi import FastAPI

from src.api.routes.documents import router as documents_router
from src.config.settings import get_settings


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

app.include_router(documents_router)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ai",
    }