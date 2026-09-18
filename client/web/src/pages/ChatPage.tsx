import { useState } from "react";

import {
    ChatInput,
    ChatMessage,
} from "@/components/chat";

import { askQuestion } from "@/features/chat/chat.api";
import type {
    ChatMessage as ChatMessageType,
} from "@/features/chat/chat.types";

import "./ChatPage.css";

function ChatPage() {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(query: string) {
        setError(null);

        const userMessage: ChatMessageType = {
            id: crypto.randomUUID(),
            role: "user",
            content: query,
        };

        setMessages((currentMessages) => [
            ...currentMessages,
            userMessage,
        ]);

        setIsLoading(true);

        try {
            const response = await askQuestion({
                query,
                topK: 5,
            });

            const assistantMessage: ChatMessageType = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: response.answer,
                sources: response.sources,
            };

            setMessages((currentMessages) => [
                ...currentMessages,
                assistantMessage,
            ]);
        } catch {
            setError(
                "Unable to get an answer. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="page chat-page">
            <header className="page-header">
                <h1>Chat</h1>
                <p>
                    Ask questions about your accessible documents.
                </p>
            </header>

            <ChatInput
                onSubmit={handleSubmit}
                disabled={isLoading}
            />

            <section
                className="chat-messages"
                aria-label="Conversation"
            >
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        <h2>Ask a question</h2>
                        <p>
                            Ask about your accessible documents
                            to get started.
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                        />
                    ))
                )}

                <div
                    className="chat-status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {isLoading &&
                        "Assistant is thinking..."}
                </div>

                {error && (
                    <div
                        className="chat-error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}
            </section>
        </main>
    );
}

export default ChatPage;