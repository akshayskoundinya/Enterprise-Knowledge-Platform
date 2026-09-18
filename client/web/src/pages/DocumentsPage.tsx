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

import "./DocumentsPage.css";

function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    async function handleDownload(document: Document) {
        setActionError(null);
        setDownloadingDocumentId(document.id);

        try {
            const file = await downloadDocument(document.id);

            const url = URL.createObjectURL(file);

            const link = window.document.createElement("a");

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

    async function handleDelete(document: Document) {
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
                        currentDocument.id !== document.id,
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
                setError("Unable to load documents.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadDocuments();
    }, []);

    if (isLoading) {
        return (
            <main className="page documents-page">
                <header className="page-header">
                    <h1>Documents</h1>
                    <p>Manage your knowledge documents.</p>
                </header>

                <div
                    className="documents-state"
                    role="status"
                    aria-live="polite"
                >
                    <p>Loading documents...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page documents-page">
                <header className="page-header">
                    <h1>Documents</h1>
                    <p>Manage your knowledge documents.</p>
                </header>

                <div
                    className="documents-state documents-state--error"
                    role="alert"
                >
                    <h2>Unable to load documents</h2>
                    <p>{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="page documents-page">
            <header className="page-header">
                <h1>Documents</h1>
                <p>Manage your knowledge documents.</p>
            </header>

            <section
                className="documents-upload"
                aria-labelledby="documents-upload-title"
            >
                <DocumentUpload
                    onUploaded={handleUploaded}
                />
            </section>

            {actionError && (
                <div
                    className="documents-action-error"
                    role="alert"
                >
                    {actionError}
                </div>
            )}

            <section
                className="documents-list"
                aria-labelledby="documents-list-title"
            >
                <h2
                    id="documents-list-title"
                    className="visually-hidden"
                >
                    Your documents
                </h2>

                {documents.length === 0 ? (
                    <div className="documents-state">
                        <h2>No documents yet</h2>
                        <p>
                            Upload a document to start building
                            your knowledge base.
                        </p>
                    </div>
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
            </section>
        </main>
    );
}

export default DocumentsPage;