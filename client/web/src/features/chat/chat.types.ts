export interface ChatRequest {
    query: string;
    topK: number;
}

export interface ChatSource {
    chunk_id: string;
    document_id: string;
    document_name: string;
    page: number | null;
}

export interface ChatResponseData {
    answer: string;
    sources: ChatSource[];
}

export interface ChatResponse {
    data: ChatResponseData;
}

export type ChatMessageRole =
    | "user"
    | "assistant";

export interface ChatMessage {
    id: string;
    role: ChatMessageRole;
    content: string;
    sources?: ChatSource[];
}