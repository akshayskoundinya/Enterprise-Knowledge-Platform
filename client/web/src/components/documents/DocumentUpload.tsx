import { useState } from "react";

import { uploadDocument } from "@/features/documents/document.api";
import type { Document } from "@/features/documents/document.types";

interface DocumentUploadProps {
    onUploaded: (document: Document) => void;
}

function DocumentUpload({
    onUploaded,
}: DocumentUploadProps) {
    const [isUploading, setIsUploading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const document =
                await uploadDocument(file);

            onUploaded(document);

            event.target.value = "";
        } catch {
            setError(
                "Unable to upload document.",
            );
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <section>
            <h2>Upload Document</h2>

            <input
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
            />

            {isUploading && (
                <p>Uploading document...</p>
            )}

            {error && (
                <p role="alert">{error}</p>
            )}
        </section>
    );
}

export default DocumentUpload;