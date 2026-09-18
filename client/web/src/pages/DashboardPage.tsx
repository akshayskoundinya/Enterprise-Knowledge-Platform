import { useEffect, useState } from "react";

import {
    DashboardStatCard,
    RecentDocuments,
} from "@/components/dashboard";

import { getDocuments } from "@/features/documents/document.api";
import { getDocumentMetrics } from "@/features/documents/document.utils";
import type { Document } from "@/features/documents/document.types";

import "./DashboardPage.css";

function DashboardPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadDocuments() {
            try {
                const result = await getDocuments();

                setDocuments(result);
            } catch {
                setError("Unable to load dashboard data.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadDocuments();
    }, []);

    if (isLoading) {
        return (
            <main className="page dashboard-page">
                <header className="page-header">
                    <h1>Dashboard</h1>
                    <p>Your knowledge platform overview.</p>
                </header>

                <div
                    className="dashboard-state"
                    role="status"
                    aria-live="polite"
                >
                    <p>Loading dashboard...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page dashboard-page">
                <header className="page-header">
                    <h1>Dashboard</h1>
                    <p>Your knowledge platform overview.</p>
                </header>

                <div
                    className="dashboard-state dashboard-state--error"
                    role="alert"
                >
                    <h2>Unable to load dashboard</h2>
                    <p>{error}</p>
                </div>
            </main>
        );
    }

    const metrics = getDocumentMetrics(documents);

    return (
        <main className="page dashboard-page">
            <header className="page-header">
                <h1>Dashboard</h1>
                <p>Your knowledge platform overview.</p>
            </header>

            <section
                className="dashboard-stats"
                aria-label="Document statistics"
            >
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

                <DashboardStatCard
                    label="Failed"
                    value={metrics.failed}
                />
            </section>

            <section
                className="dashboard-section"
                aria-label="Recent documents"
            >
                <RecentDocuments documents={documents} />
            </section>
        </main>
    );
}

export default DashboardPage;