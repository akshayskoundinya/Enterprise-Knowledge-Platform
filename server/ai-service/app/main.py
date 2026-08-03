from fastapi import FastAPI

app = FastAPI(
    title="Enterprise Knowledge Platform AI Service",
    version="0.1.0"
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ai-service"
    }