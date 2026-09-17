import type { Document } from "@/features/documents/document.types";

interface RecentDocumentsProps {
    documents: Document[];
}

function RecentDocuments({
    documents,
}: RecentDocumentsProps) {
    const recentDocuments = documents.slice(0, 5);

    return (
        <section className="recent-documents card">
            <header className="recent-documents__header">
                <h2>Recent Documents</h2>
                <p>Your latest uploaded documents.</p>
            </header>

            {recentDocuments.length === 0 ? (
                <div className="recent-documents__empty">
                    <p>No documents available.</p>
                </div>
            ) : (
                <ul className="recent-documents__list">
                    {recentDocuments.map((document) => (
                        <li
                            key={document.id}
                            className="recent-documents__item"
                        >
                            <div className="recent-documents__info">
                                <strong>
                                    {document.name}
                                </strong>
                            </div>

                            <span
                                className={`status-badge status-badge--${document.status.toLowerCase()}`}
                            >
                                {document.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default RecentDocuments;