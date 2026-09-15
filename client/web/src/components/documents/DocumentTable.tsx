import type { Document } from "@/features/documents";

interface DocumentTableProps {
    documents: Document[];
    onDownload: (document: Document) => void;
    onDelete: (document: Document) => void;
}

function DocumentTable({
    documents,
    onDownload,
    onDelete,
}: DocumentTableProps) {
    return (
        <div className="document-table-container">
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
                            <td>
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
                                    className={`document-status document-status--${document.status.toLowerCase()}`}
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
                                <button
                                    type="button"
                                    onClick={() =>
                                        onDownload(
                                            document,
                                        )
                                    }
                                >
                                    Download
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDelete(
                                            document,
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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