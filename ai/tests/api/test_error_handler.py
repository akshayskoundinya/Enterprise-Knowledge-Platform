from fastapi import APIRouter
from fastapi.testclient import TestClient

from src.core.exceptions import RetrievalError
from src.main import app


router = APIRouter()


@router.get("/test-retrieval-error")
async def retrieval_error_endpoint():
    raise RetrievalError("Vector retrieval failed")


app.include_router(router)

client = TestClient(app)


def test_ai_service_error_returns_503():
    response = client.get("/test-retrieval-error")

    assert response.status_code == 503
    assert response.json() == {
        "error": {
            "code": "RetrievalError",
            "message": "Vector retrieval failed",
        }
    }