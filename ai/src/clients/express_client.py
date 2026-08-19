import httpx

from src.config.settings import get_settings


async def get_document_content(
    document_id: str,
) -> bytes:
    settings = get_settings()

    url = (
        f"{settings.express_service_url}"
        f"/internal/v1/documents/"
        f"{document_id}/content"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            headers={
                "X-Internal-API-Key":
                    settings.internal_api_key,
            },
        )

    response.raise_for_status()

    return response.content