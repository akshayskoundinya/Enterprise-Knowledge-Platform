import type { DocumentDocument } from "../models";

export function toDocumentResponse(
    document: DocumentDocument
) {
    return {
        id: document._id.toString(),
        name: document.name,
        originalName: document.originalName,
        mimeType: document.mimeType,
        size: document.size,
        uploadedBy: document.uploadedBy.toString(),
        status: document.status,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
    };
}