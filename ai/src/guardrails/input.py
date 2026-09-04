from typing import Any

from guardrails import Guard
from guardrails.validator_base import Validator
from guardrails_ai.types.validation_result import (
    Outcome,
    ValidationResult,
)


class QueryLengthValidator(Validator):
    """Validate that a user query is non-empty and within limits."""

    def __init__(
        self,
        max_length: int = 2000,
        **kwargs: Any,
    ):
        super().__init__(**kwargs)
        self.max_length = max_length

    def _validate(
        self,
        value: Any,
        metadata: dict[str, Any],
    ) -> ValidationResult:

        if not isinstance(value, str):
            return ValidationResult(
                outcome=Outcome.FAIL,
                metadata={
                    "error": "Query must be a string."
                },
                validated_chunk=value,
            )

        query = value.strip()

        if not query:
            return ValidationResult(
                outcome=Outcome.FAIL,
                metadata={
                    "error": "Query cannot be empty."
                },
                validated_chunk=value,
            )

        if len(query) > self.max_length:
            return ValidationResult(
                outcome=Outcome.FAIL,
                metadata={
                    "error": (
                        f"Query cannot exceed "
                        f"{self.max_length} characters."
                    )
                },
                validated_chunk=value,
            )

        return ValidationResult(
            outcome=Outcome.PASS,
            validated_chunk=value,
        )


query_guard = Guard().use(
    QueryLengthValidator(
        max_length=2000,
        on_fail="exception",
    )
)