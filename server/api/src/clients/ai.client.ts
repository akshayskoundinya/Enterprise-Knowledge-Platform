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