import { createAppError } from "../errors";
import { DocumentMimeTypes } from "../constants";

function isPdf(buffer: Buffer): boolean {
    return buffer.subarray(0, 5).toString() === "%PDF-";
}

function isZipContainer(buffer: Buffer): boolean {
    return (
        buffer.length >= 4 &&
        buffer[0] === 0x50 &&
        buffer[1] === 0x4b &&
        buffer[2] === 0x03 &&
        buffer[3] === 0x04
    );
}

export function validateFileSignature(
    buffer: Buffer,
    mimeType: string
): void {
    if (buffer.length === 0) {
        throw createAppError(
            "Uploaded file is empty",
            400,
            "EMPTY_DOCUMENT"
        );
    }

    if (mimeType === DocumentMimeTypes.PDF) {
        if (!isPdf(buffer)) {
            throw createAppError(
                "File content does not match PDF format",
                400,
                "INVALID_DOCUMENT_CONTENT"
            );
        }

        return;
    }

    if (
        mimeType ===
        DocumentMimeTypes.DOCX
    ) {
        if (!isZipContainer(buffer)) {
            throw createAppError(
                "File content does not match DOCX format",
                400,
                "INVALID_DOCUMENT_CONTENT"
            );
        }

        return;
    }

    if (
        mimeType ===
        DocumentMimeTypes.PLAIN_TEXT
    ) {
        return;
    }

    throw createAppError(
        "Unsupported document type",
        400,
        "UNSUPPORTED_DOCUMENT_TYPE"
    );
}