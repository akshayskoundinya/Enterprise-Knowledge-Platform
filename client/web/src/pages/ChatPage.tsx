import { useState } from "react";

import {
    ChatInput,
    ChatMessage,
} from "@/components/chat";

import { askQuestion } from "@/features/chat/chat.api";
import type {
    ChatMessage as ChatMessageType,
} from "@/features/chat/chat.types";

function ChatPage() {
    const [messages, setMessages] = useState<
        ChatMessageType[]
    >([]);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

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
            const response =
                await askQuestion({
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

            <section className="chat-messages">
                {messages.length === 0 ? (
                    <p>
                        Ask a question to get
                        started.
                    </p>
                ) : (
                    messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                        />
                    ))
                )}

                {isLoading && (
                    <p>Assistant is thinking...</p>
                )}

                {error && (
                    <p role="alert">
                        {error}
                    </p>
                )}
            </section>

            <ChatInput
                onSubmit={handleSubmit}
                disabled={isLoading}
            />
        </main>
    );
}

export default ChatPage;