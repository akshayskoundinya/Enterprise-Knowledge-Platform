import { apiClient } from "@/services/api";

import type {
    ChatRequest,
    ChatResponse,
} from "./chat.types";

export async function askQuestion(
    request: ChatRequest,
): Promise<ChatResponse["data"]> {
    const response =
        await apiClient.post<ChatResponse>(
            "/retrieval/answer",
            request,
        );

    return response.data.data;
}