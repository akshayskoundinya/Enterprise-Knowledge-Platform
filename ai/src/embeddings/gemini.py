from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
)

from src.config.settings import get_settings


def get_embedding_model() -> (
    GoogleGenerativeAIEmbeddings
):
    settings = get_settings()

    if not settings.gemini_api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured"
        )

    return GoogleGenerativeAIEmbeddings(
        model=settings.embedding_model,
        google_api_key=settings.gemini_api_key,
    )