import { useState } from "react";
import type { SubmitEvent } from "react";

import "./ChatInput.css";

interface ChatInputProps {
    onSubmit: (query: string) => void;
    disabled: boolean;
}

function ChatInput({
    onSubmit,
    disabled,
}: ChatInputProps) {
    const [query, setQuery] = useState("");

    function handleSubmit(
        event: SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const trimmedQuery = query.trim();

        if (!trimmedQuery || disabled) {
            return;
        }

        onSubmit(trimmedQuery);
        setQuery("");
    }

    return (
        <form
            className="chat-input"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                value={query}
                onChange={(event) =>
                    setQuery(event.target.value)
                }
                placeholder="Ask a question about your documents..."
                disabled={disabled}
                aria-label="Ask a question"
            />

            <button
                type="submit"
                className="button button--primary"
                disabled={
                    disabled ||
                    query.trim().length === 0
                }
            >
                {disabled ? "Thinking..." : "Send"}
            </button>
        </form>
    );
}

export default ChatInput;