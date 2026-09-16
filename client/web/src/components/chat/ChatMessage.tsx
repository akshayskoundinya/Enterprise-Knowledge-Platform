import type { ChatMessage as ChatMessageType } from "@/features/chat/chat.types";

interface ChatMessageProps {
    message: ChatMessageType;
}

function ChatMessage({
    message,
}: ChatMessageProps) {
    const isUser =
        message.role === "user";

    return (
        <article
            className={`chat-message ${isUser
                    ? "chat-message--user"
                    : "chat-message--assistant"
                }`}
        >
            <div className="chat-message__role">
                {isUser ? "You" : "Assistant"}
            </div>

            <div className="chat-message__content">
                {message.content}
            </div>

            {!isUser &&
                message.sources &&
                message.sources.length > 0 && (
                    <div className="chat-message__sources">
                        <strong>Sources</strong>

                        <ul>
                            {message.sources.map(
                                (source) => (
                                    <li
                                        key={
                                            source.chunk_id
                                        }
                                    >
                                        Document{" "}
                                        {
                                            source.document_id
                                        }

                                        {source.page !==
                                            null &&
                                            ` — Page ${source.page}`}
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>
                )}
        </article>
    );
}

export default ChatMessage;