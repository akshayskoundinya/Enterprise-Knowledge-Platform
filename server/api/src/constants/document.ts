export const DocumentMimeTypes = {
    PDF: "application/pdf",
    PLAIN_TEXT: "text/plain",
    DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;

export const ALLOWED_DOCUMENT_MIME_TYPES =
    Object.values(DocumentMimeTypes);

export const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024;