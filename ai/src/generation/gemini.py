from langchain_google_genai import (
    ChatGoogleGenerativeAI,
)

from src.config.settings import get_settings


def get_generation_model() -> (
    ChatGoogleGenerativeAI
):
    settings = get_settings()

    if not settings.gemini_api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured"
        )

    return ChatGoogleGenerativeAI(
        model=settings.generation_model,
        google_api_key=settings.gemini_api_key,
    )