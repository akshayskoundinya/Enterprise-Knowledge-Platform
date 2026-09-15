import { useEffect, useState } from "react";

import {
    DashboardStatCard,
    RecentDocuments,
} from "@/components/dashboard";

import { getDocuments } from "@/features/documents/document.api";
import { getDocumentMetrics } from "@/features/documents/document.utils";
import type { Document } from "@/features/documents/document.types";

function DashboardPage() {
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
                    "Unable to load dashboard data.",
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadDocuments();
    }, []);

    if (isLoading) {
        return <h1>Loading dashboard...</h1>;
    }

    if (error) {
        return (
            <div>
                <h1>Dashboard</h1>
                <p>{error}</p>
            </div>
        );
    }

    const metrics = getDocumentMetrics(documents);

    return (
        <main>
            <header>
                <h1>Dashboard</h1>

                <p>
                    Your knowledge platform overview.
                </p>
            </header>

            <section>
                <DashboardStatCard
                    label="Total Documents"
                    value={metrics.total}
                />

                <DashboardStatCard
                    label="Ready"
                    value={metrics.ready}
                />

                <DashboardStatCard
                    label="Processing"
                    value={metrics.processing}
                />
            </section>

            <RecentDocuments
                documents={documents}
            />
        </main>
    );
}

export default DashboardPage;