from fastapi import APIRouter, Depends
from fastapi.testclient import TestClient

from src.api.dependencies import verify_internal_api_key
from src.config.settings import get_settings
from src.main import app


router = APIRouter(
    prefix="/test-auth",
)


@router.get("/protected")
async def protected_endpoint(
    _: None = Depends(verify_internal_api_key),
):
    return {"status": "ok"}


app.include_router(router)

client = TestClient(app)


def test_missing_api_key_returns_401():
    response = client.get("/test-auth/protected")

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid internal API key",
    }


def test_invalid_api_key_returns_401():
    response = client.get(
        "/test-auth/protected",
        headers={"X-Internal-API-Key": "invalid-key"},
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid internal API key",
    }


def test_valid_api_key_is_accepted():
    settings = get_settings()

    response = client.get(
        "/test-auth/protected",
        headers={
            "X-Internal-API-Key": settings.internal_api_key,
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
    }