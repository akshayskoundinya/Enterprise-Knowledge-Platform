import os

from src.config.settings import get_settings


def configure_langsmith() -> None:
    settings = get_settings()

    if not settings.langsmith_tracing:
        return

    if not settings.langsmith_api_key:
        raise RuntimeError(
            "LANGSMITH_API_KEY is required when "
            "LangSmith tracing is enabled."
        )

    os.environ["LANGSMITH_TRACING"] = "true"
    os.environ["LANGSMITH_API_KEY"] = (
        settings.langsmith_api_key
    )
    os.environ["LANGSMITH_ENDPOINT"] = (
        settings.langsmith_endpoint
    )
    os.environ["LANGSMITH_PROJECT"] = (
        settings.langsmith_project
    )