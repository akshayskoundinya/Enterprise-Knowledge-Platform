export type DocumentStatus =
    | "UPLOADED"
    | "PROCESSING"
    | "READY"
    | "FAILED";

export interface Document {
    id: string;
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedBy: string;
    status: DocumentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentsResponse {
    data: Document[];
}

export interface DocumentResponse {
    data: Document;
}