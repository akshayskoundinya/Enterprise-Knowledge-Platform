import type {
    ChatMessage as ChatMessageType,
} from "@/features/chat/chat.types";

import "./ChatMessage.css";

interface ChatMessageProps {
    message: ChatMessageType;
}

function ChatMessage({
    message,
}: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <article
            className={`chat-message ${isUser
                    ? "chat-message--user"
                    : "chat-message--assistant"
                }`}
        >
            <div className="chat-message__content">
                <div className="chat-message__role">
                    {isUser ? "You" : "Assistant"}
                </div>

                <div className="chat-message__bubble">
                    {message.content}
                </div>

                {!isUser &&
                    message.sources &&
                    message.sources.length > 0 && (
                        <div className="chat-message__sources">
                            <div className="chat-message__sources-title">
                                Sources
                            </div>

                            <ul>
                                {message.sources.map(
                                    (source) => (
                                        <li
                                            key={
                                                source.chunk_id
                                            }
                                        >
                                            {source.document_name}

                                            {source.page !==
                                                null &&
                                                ` — Page ${source.page}`}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    )}
            </div>
        </article>
    );
}

export default ChatMessage;