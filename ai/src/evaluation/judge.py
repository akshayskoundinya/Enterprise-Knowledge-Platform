from pydantic import BaseModel, Field


class JudgeResult(BaseModel):
    groundedness: float = Field(
        ge=0.0,
        le=1.0,
    )

    relevance: float = Field(
        ge=0.0,
        le=1.0,
    )

    hallucination: float = Field(
        ge=0.0,
        le=1.0,
    )

from src.generation.context import build_context
from src.generation.gemini import get_generation_model
from src.retrieval.models import RetrievalResult


def judge_generation(
    question: str,
    answer: str,
    retrieved_documents: list[RetrievalResult],
    reference_answer: str,
) -> JudgeResult:

    context = build_context(
        retrieved_documents
    )

    model = get_generation_model()

    judge = model.with_structured_output(
        JudgeResult
    )

    prompt = f"""
You are evaluating the quality of a RAG-generated answer.

Evaluate the answer using the question, retrieved
document context, and reference answer.

Scoring:

1. Groundedness:
   - 1.0 = every factual claim is supported by the
     retrieved context.
   - 0.0 = the answer is entirely unsupported by the
     retrieved context.

2. Relevance:
   - 1.0 = the answer directly and sufficiently answers
     the question.
   - 0.0 = the answer is completely irrelevant.

3. Hallucination:
   - 0.0 = no unsupported factual claims.
   - 1.0 = severe or extensive unsupported claims.

Important:
- Judge groundedness primarily against the retrieved
  context.
- Use the reference answer to understand what a good
  answer should contain.
- Do not assume information outside the supplied context.
- Return only the structured evaluation result.

Question:
{question}

Retrieved context:
{context}

Generated answer:
{answer}

Reference answer:
{reference_answer}
"""

    result = judge.invoke(prompt)

    return result