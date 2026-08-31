from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from src.generation.gemini import get_generation_model


class MultiQueryOutput(BaseModel):
    queries: list[str] = Field(
        min_length=1,
        max_length=5,
    )


MULTI_QUERY_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are a search query expansion assistant.

Generate alternative search queries that represent
different ways of expressing the user's information need.

Rules:
- Generate 3 alternative queries.
- Preserve the original information need.
- Use different wording and terminology where useful.
- Do not answer the user's question.
- Do not explain your reasoning.
- Return only the structured query list.
""",
        ),
        (
            "human",
            "Original query:\n{query}",
        ),
    ]
)


async def generate_multi_queries(
    query: str,
) -> list[str]:

    model = get_generation_model()

    structured_model = model.with_structured_output(
        MultiQueryOutput
    )

    chain = MULTI_QUERY_PROMPT | structured_model

    result = await chain.ainvoke(
        {"query": query}
    )

    queries = [
        item.strip()
        for item in result.queries
        if item.strip()
    ]

    return queries