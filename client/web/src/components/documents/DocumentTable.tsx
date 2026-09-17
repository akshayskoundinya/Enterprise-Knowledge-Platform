import type { Document } from "@/features/documents";

interface DocumentTableProps {
    documents: Document[];
    onDownload: (document: Document) => void;
    onDelete: (document: Document) => void;
    downloadingDocumentId: string | null;
    deletingDocumentId: string | null;
}

function DocumentTable({
    documents,
    onDownload,
    onDelete,
    downloadingDocumentId,
    deletingDocumentId,
}: DocumentTableProps) {
    return (
        <div className="document-table-container card">
            <div className="document-table-wrapper">
                <table className="document-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Status</th>
                            <th>Uploaded</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {documents.map((document) => (
                            <tr key={document.id}>
                                <td className="document-table__name">
                                    <strong>
                                        {document.name}
                                    </strong>
                                </td>

                                <td>
                                    {document.mimeType}
                                </td>

                                <td>
                                    {formatFileSize(
                                        document.size,
                                    )}
                                </td>

                                <td>
                                    <span
                                        className={`status-badge status-badge--${document.status.toLowerCase()}`}
                                    >
                                        {document.status}
                                    </span>
                                </td>

                                <td>
                                    {formatDate(
                                        document.createdAt,
                                    )}
                                </td>

                                <td>
                                    <div className="document-table__actions">
                                        <button
                                            type="button"
                                            className="button button--secondary"
                                            onClick={() =>
                                                onDownload(document)
                                            }
                                            disabled={
                                                downloadingDocumentId ===
                                                document.id ||
                                                deletingDocumentId ===
                                                document.id
                                            }
                                        >
                                            {downloadingDocumentId ===
                                                document.id
                                                ? "Downloading..."
                                                : "Download"}
                                        </button>

                                        <button
                                            type="button"
                                            className="button button--danger"
                                            onClick={() =>
                                                onDelete(document)
                                            }
                                            disabled={
                                                downloadingDocumentId ===
                                                document.id ||
                                                deletingDocumentId ===
                                                document.id
                                            }
                                        >
                                            {deletingDocumentId ===
                                                document.id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function formatFileSize(
    sizeInBytes: number,
): string {
    if (sizeInBytes < 1024) {
        return `${sizeInBytes} B`;
    }

    if (sizeInBytes < 1024 * 1024) {
        return `${(
            sizeInBytes / 1024
        ).toFixed(1)} KB`;
    }

    return `${(
        sizeInBytes /
        (1024 * 1024)
    ).toFixed(1)} MB`;
}

function formatDate(date: string): string {
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
    }).format(new Date(date));
}

export default DocumentTable;