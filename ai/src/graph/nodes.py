from src.generation.context import build_context
from src.generation.gemini import get_generation_model
from src.generation.parser import extract_text
from src.services.retrieval import retrieve_documents
from src.graph.state import RAGState
from src.guardrails.query_groundedness import (
    QueryGroundedness,
)
from src.core.exceptions import GenerationError


async def retrieve_node(
    state: RAGState,
) -> dict:
    results = await retrieve_documents(
        query=state["query"],
        allowed_document_ids=state[
            "allowed_document_ids"
        ],
        top_k=state["top_k"],
    )

    return {
        "retrieved_documents": results,
    }


async def generate_node(
    state: RAGState,
) -> dict:
    results = state["retrieved_documents"]

    if not results:
        return {
            "answer": (
                "The provided documents do not contain "
                "enough information to answer this question."
            )
        }

    context = build_context(results)

    model = get_generation_model()

    prompt = f"""
You are a document question-answering assistant.

Answer the user's question using only the information
provided in the retrieved document context.

Rules:
1. Do not use information that is not present in the context.
2. Do not invent facts, sources, citations, or numbers.
3. If the context does not contain enough information
   to answer the question, say that the provided documents
   do not contain enough information.
4. Give a concise and direct answer.
5. When making a factual claim, reference the relevant
   source using its [Source N] identifier.

Retrieved document context:

{context}

User question:

{state["query"]}
"""

    try:
        response = await model.ainvoke(prompt)
    except Exception as exc:
        raise GenerationError(
            "Answer generation failed"
        ) from exc

    return {"answer": extract_text(response.content)}

def validate_output_node(
    state: RAGState,
) -> dict:
    validator = QueryGroundedness()

    context = build_context(
        state["retrieved_documents"]
    )

    result = validator.validate(
        state["answer"],
        {
            "context": context,
        },
    )

    if result.outcome.value == "fail":
        return {
            "answer": (
                "I could not produce a sufficiently "
                "grounded answer from the provided documents."
            )
        }

    return {
        "answer": state["answer"],
    }