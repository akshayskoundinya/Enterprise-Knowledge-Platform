class AIServiceError(Exception):
    """Base exception for expected AI service failures."""


class RetrievalError(AIServiceError):
    """Raised when document retrieval fails."""


class GenerationError(AIServiceError):
    """Raised when answer generation fails."""


class GuardrailError(AIServiceError):
    """Raised when guardrail validation fails."""