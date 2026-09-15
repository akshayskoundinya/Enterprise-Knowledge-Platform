import type { Document } from "./document.types";

export function getDocumentMetrics(
    documents: Document[],
) {
    return {
        total: documents.length,

        ready: documents.filter(
            (document) =>
                document.status === "READY",
        ).length,

        processing: documents.filter(
            (document) =>
                document.status === "PROCESSING",
        ).length,

        failed: documents.filter(
            (document) =>
                document.status === "FAILED",
        ).length,
    };
}