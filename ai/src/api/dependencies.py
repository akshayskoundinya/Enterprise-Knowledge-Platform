import secrets

from fastapi import Header, HTTPException, status

from src.config.settings import get_settings


async def verify_internal_api_key(
    x_internal_api_key: str | None = Header(
        default=None,
    ),
) -> None:
    settings = get_settings()

    if (
        not x_internal_api_key
        or not secrets.compare_digest(
            x_internal_api_key,
            settings.internal_api_key,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal API key",
        )