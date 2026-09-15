import { useEffect, useState } from "react";

import {
    DocumentTable,
    DocumentUpload,
} from "@/components/documents";

import { getDocuments } from "@/features/documents/document.api";
import type { Document } from "@/features/documents/document.types";

function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>(
        [],
    );

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] = useState<string | null>(
        null,
    );

    function handleUploaded(document: Document) {
        setDocuments((currentDocuments) => [
            document,
            ...currentDocuments,
        ]);
    }

    useEffect(() => {
        async function loadDocuments() {
            try {
                const result = await getDocuments();

                setDocuments(result);
            } catch {
                setError(
                    "Unable to load documents.",
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadDocuments();
    }, []);

    if (isLoading) {
        return <h1>Loading documents...</h1>;
    }

    if (error) {
        return (
            <main>
                <h1>Documents</h1>
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main>
            <header>
                <h1>Documents</h1>
                <p>
                    Manage your knowledge documents.
                </p>
            </header>

            <DocumentUpload
                onUploaded={handleUploaded}
            />

            {documents.length === 0 ? (
                <p>No documents available.</p>
            ) : (
                <DocumentTable
                    documents={documents}
                />
            )}
        </main>
    );
}

export default DocumentsPage;