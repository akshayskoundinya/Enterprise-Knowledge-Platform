import { useEffect, useState } from "react";

import {
    DocumentTable,
    DocumentUpload,
} from "@/components/documents";

import {
    deleteDocument,
    downloadDocument,
    getDocuments,
} from "@/features/documents/document.api";
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

    const [downloadingDocumentId, setDownloadingDocumentId] =
        useState<string | null>(null);

    const [deletingDocumentId, setDeletingDocumentId] =
        useState<string | null>(null);

    const [actionError, setActionError] =
        useState<string | null>(null);

    function handleUploaded(document: Document) {
        setDocuments((currentDocuments) => [
            document,
            ...currentDocuments,
        ]);
    }

    async function handleDownload(
        document: Document,
    ) {
        setActionError(null);
        setDownloadingDocumentId(document.id);

        try {
            const file =
                await downloadDocument(document.id);

            const url =
                URL.createObjectURL(file);

            const link =
                window.document.createElement("a");

            link.href = url;
            link.download = document.originalName;

            link.click();

            URL.revokeObjectURL(url);
        } catch {
            setActionError(
                `Unable to download "${document.originalName}".`,
            );
        } finally {
            setDownloadingDocumentId(null);
        }
    }

    async function handleDelete(
        document: Document,
    ) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${document.originalName}"?`,
        );

        if (!confirmed) {
            return;
        }

        setActionError(null);
        setDeletingDocumentId(document.id);

        try {
            await deleteDocument(document.id);

            setDocuments((currentDocuments) =>
                currentDocuments.filter(
                    (currentDocument) =>
                        currentDocument.id !==
                        document.id,
                ),
            );
        } catch {
            setActionError(
                `Unable to delete "${document.originalName}".`,
            );
        } finally {
            setDeletingDocumentId(null);
        }
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

            {actionError && (
                <p role="alert">
                    {actionError}
                </p>
            )}

            {documents.length === 0 ? (
                <p>No documents available.</p>
            ) : (
                <DocumentTable
                    documents={documents}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    downloadingDocumentId={
                        downloadingDocumentId
                    }
                    deletingDocumentId={
                        deletingDocumentId
                    }
                />
            )}
        </main>
    );
}

export default DocumentsPage;