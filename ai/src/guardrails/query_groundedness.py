from typing import Any, Dict, Optional

from guardrails.validator_base import (
    FailResult,
    PassResult,
    ValidationResult,
    Validator,
    register_validator,
)


@register_validator(
    name="guardrails/query_groundedness",
    data_type="string",
)
class QueryGroundedness(Validator):
    """Validate that a generated RAG answer references its sources.

    This validator performs lightweight structural validation.

    It does not determine semantic truth. Semantic groundedness
    will be measured separately through the evaluation pipeline.
    """

    def __init__(
        self,
        require_sources: bool = True,
        on_fail: Optional[str] = None,
    ):
        super().__init__(
            on_fail=on_fail,
            require_sources=require_sources,
        )

        self.require_sources = require_sources

    def validate(
        self,
        value: Any,
        metadata: Dict,
    ) -> ValidationResult:
        if not isinstance(value, str):
            return FailResult(
                error_message=(
                    "Generated answer must be a string."
                )
            )

        answer = value.strip()

        if not answer:
            return FailResult(
                error_message=(
                    "Generated answer must not be empty."
                )
            )

        if self.require_sources:
            context = metadata.get("context", "")

            if context and "[Source " not in answer:
                return FailResult(
                    error_message=(
                        "Generated answer must reference "
                        "at least one retrieved source."
                    )
                )

        return PassResult()