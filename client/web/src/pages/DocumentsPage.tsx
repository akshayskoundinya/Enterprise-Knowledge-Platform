import { useEffect, useState } from "react";

import { getDocuments } from "@/features/documents/document.api";
import type { Document } from "@/features/documents/document.types";
import { DocumentTable } from "@/components/documents";

function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>(
        [],
    );

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] = useState<string | null>(
        null,
    );

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