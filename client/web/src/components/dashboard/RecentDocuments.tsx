import type { Document } from "@/features/documents/document.types";

interface RecentDocumentsProps {
    documents: Document[];
}

function RecentDocuments({
    documents,
}: RecentDocumentsProps) {
    if (documents.length === 0) {
        return (
            <section>
                <h2>Recent Documents</h2>
                <p>No documents available.</p>
            </section>
        );
    }

    return (
        <section>
            <h2>Recent Documents</h2>

            <ul>
                {documents.slice(0, 5).map((document) => (
                    <li key={document.id}>
                        <strong>
                            {document.name}
                        </strong>

                        {" — "}

                        <span>
                            {document.status}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default RecentDocuments;