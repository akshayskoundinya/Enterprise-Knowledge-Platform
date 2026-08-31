import { env } from "../config/env";

interface ProcessDocumentRequest {
    documentId: string;
    storageKey: string;
    mimeType: string;
    allowedUserIds: string[];
}

interface ProcessDocumentResponse {
    document_id: string;
    status: string;
}

interface SearchDocumentsRequest {
    query: string;
    userId: string;
    allowedDocumentIds: string[];
    topK: number;
}

interface RetrievedChunk {
    chunk_id: string;
    document_id: string;
    page: number | null;
    text: string;
    score: number;
}

interface SearchDocumentsResponse {
    results: RetrievedChunk[];
}

export async function processDocument(
    input: ProcessDocumentRequest
): Promise<ProcessDocumentResponse> {
    const response = await fetch(
        `${env.AI_SERVICE_URL}/internal/v1/documents/process`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Internal-API-Key": env.AI_INTERNAL_API_KEY,
            },
            body: JSON.stringify({
                document_id: input.documentId,
                storage_key: input.storageKey,
                mime_type: input.mimeType,
                allowed_user_ids: input.allowedUserIds,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`AI service returned HTTP ${response.status}`);
    }

    return response.json() as Promise<ProcessDocumentResponse>;
}

export async function searchDocuments(
    input: SearchDocumentsRequest
): Promise<SearchDocumentsResponse> {
    const response = await fetch(
        `${env.AI_SERVICE_URL}/internal/v1/retrieval/search`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Internal-API-Key": env.AI_INTERNAL_API_KEY,
            },
            body: JSON.stringify({
                query: input.query,
                user_id: input.userId,
                allowed_document_ids:
                    input.allowedDocumentIds,
                top_k: input.topK,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            `AI service returned HTTP ${response.status}`
        );
    }

    return response.json() as Promise<SearchDocumentsResponse>;
}