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
        <section className="document-upload card">
            <div className="document-upload__content">
                <div>
                    <h2>Upload Document</h2>

                    <p>
                        Add a document to your knowledge
                        base.
                    </p>
                </div>

                <label
                    className={`document-upload__button button button--primary${isUploading
                            ? " document-upload__button--disabled"
                            : ""
                        }`}
                >
                    {isUploading
                        ? "Uploading..."
                        : "Choose File"}

                    <input
                        type="file"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </label>
            </div>

            {error && (
                <p
                    className="document-upload__error"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </section>
    );
}

export default DocumentUpload;