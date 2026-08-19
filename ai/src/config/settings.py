from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict  # type: ignore


class Settings(BaseSettings):
    app_name: str = "Enterprise Knowledge Platform AI Service"
    app_version: str = "1.0.0"
    environment: str = "development"

    host: str = "0.0.0.0"
    port: int = 8000

    # Internal service communication
    internal_api_key: str
    express_service_url: str = "http://localhost:3000"

    gemini_api_key: str | None = None
    qdrant_url: str = "http://qdrant:6333"
    qdrant_api_key: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()