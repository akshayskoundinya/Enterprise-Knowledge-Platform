import { apiClient } from "@/services/api";

import type {
    Document,
    DocumentResponse,
    DocumentsResponse,
} from "./document.types";

export async function getDocuments(): Promise<Document[]> {
    const response =
        await apiClient.get<DocumentsResponse>(
            "/documents",
        );

    return response.data.data;
}

export async function getDocument(
    documentId: string,
): Promise<Document> {
    const response =
        await apiClient.get<DocumentResponse>(
            `/documents/${documentId}`,
        );

    return response.data.data;
}

export async function uploadDocument(
    file: File,
): Promise<Document> {
    const formData = new FormData();

    formData.append("file", file);

    const response =
        await apiClient.post<DocumentResponse>(
            "/documents",
            formData,
        );

    return response.data.data;
}

export async function deleteDocument(
    documentId: string,
): Promise<void> {
    await apiClient.delete(
        `/documents/${documentId}`,
    );
}

export async function downloadDocument(
    documentId: string,
): Promise<Blob> {
    const response =
        await apiClient.get<Blob>(
            `/documents/${documentId}/download`,
            {
                responseType: "blob",
            },
        );

    return response.data;
}