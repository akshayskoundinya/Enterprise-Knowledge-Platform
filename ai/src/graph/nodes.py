from src.generation.context import build_context
from src.generation.gemini import get_generation_model
from src.generation.parser import extract_text
from src.services.retrieval import retrieve_documents
from src.graph.state import RAGState


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

    response = await model.ainvoke(prompt)

    return {
        "answer": extract_text(response.content),
    }