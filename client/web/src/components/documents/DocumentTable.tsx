import type { Document } from "@/features/documents/document.types";

interface DocumentTableProps {
    documents: Document[];
}

function DocumentTable({
    documents,
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function formatFileSize(sizeInBytes: number): string {
    if (sizeInBytes < 1024) {
        return `${sizeInBytes} B`;
    }

    if (sizeInBytes < 1024 * 1024) {
        return `${(sizeInBytes / 1024).toFixed(1)} KB`;
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