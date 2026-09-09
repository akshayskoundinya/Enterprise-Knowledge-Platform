from src.config.settings import get_settings
from src.core.exceptions import GenerationError
from src.generation.gemini import get_generation_model
from src.generation.parser import extract_text


async def generate_multi_queries(query: str) -> list[str]:
    settings = get_settings()

    model = get_generation_model()

    prompt = f"""
Generate three alternative search queries for the following
user question.

The alternative queries should preserve the original intent
while using different wording or perspectives.

Return only the three queries, one per line.

User question:
{query}
"""

    try:
        response = await model.ainvoke(prompt)
    except Exception as exc:
        raise GenerationError(
            "Multi-query generation failed"
        ) from exc

    text = extract_text(response.content)

    queries = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    return queries[:3]