import { useEffect, useMemo, useState } from "react";

import { getDocuments } from "@/features/documents/document.api";
import type {
    Document,
    DocumentStatus,
} from "@/features/documents/document.types";

import "./AnalyticsPage.css";

const STATUS_LABELS: Record<DocumentStatus, string> = {
    UPLOADED: "Uploaded",
    PROCESSING: "Processing",
    READY: "Ready",
    FAILED: "Failed",
};

const STATUS_CLASSES: Record<DocumentStatus, string> = {
    UPLOADED: "analytics-status analytics-status--uploaded",
    PROCESSING: "analytics-status analytics-status--processing",
    READY: "analytics-status analytics-status--ready",
    FAILED: "analytics-status analytics-status--failed",
};

function AnalyticsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        getDocuments()
            .then((data) => {
                if (!isMounted) {
                    return;
                }

                setDocuments(data);
            })
            .catch(() => {
                if (!isMounted) {
                    return;
                }

                setError(
                    "Unable to load analytics. Please try again.",
                );
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const statistics = useMemo(() => {
        const statusCounts: Record<DocumentStatus, number> = {
            UPLOADED: 0,
            PROCESSING: 0,
            READY: 0,
            FAILED: 0,
        };

        const fileTypeCounts = new Map<string, number>();

        for (const document of documents) {
            statusCounts[document.status] += 1;

            const extension = getFileExtension(
                document.originalName,
            );

            fileTypeCounts.set(
                extension,
                (fileTypeCounts.get(extension) ?? 0) + 1,
            );
        }

        return {
            total: documents.length,
            statusCounts,
            fileTypes: [...fileTypeCounts.entries()]
                .sort(([, countA], [, countB]) => countB - countA),
        };
    }, [documents]);

    if (isLoading) {
        return (
            <main className="page">
                <header className="page-header">
                    <h1>Analytics</h1>
                    <p>
                        Monitor document and AI system activity.
                    </p>
                </header>

                <section className="card analytics-loading">
                    Loading analytics...
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page">
                <header className="page-header">
                    <h1>Analytics</h1>
                    <p>
                        Monitor document and AI system activity.
                    </p>
                </header>

                <section
                    className="card analytics-error"
                    role="alert"
                >
                    {error}
                </section>
            </main>
        );
    }

    return (
        <main className="page">
            <header className="page-header">
                <h1>Analytics</h1>
                <p>
                    Monitor document and AI system activity.
                </p>
            </header>

            <section className="analytics-grid">
                <div className="card">
                    <div className="analytics-section-header">
                        <div>
                            <h2>Document status</h2>
                            <p>
                                Current processing status of your
                                accessible documents.
                            </p>
                        </div>
                    </div>

                    <div className="analytics-status-list">
                        {(Object.keys(STATUS_LABELS) as DocumentStatus[])
                            .map((status) => (
                                <div
                                    className="analytics-status-row"
                                    key={status}
                                >
                                    <div className="analytics-status-info">
                                        <span
                                            className={
                                                STATUS_CLASSES[status]
                                            }
                                        >
                                            {STATUS_LABELS[status]}
                                        </span>

                                        <span>
                                            {statistics.statusCounts[status]}
                                        </span>
                                    </div>

                                    <div className="analytics-progress">
                                        <div
                                            className={`analytics-progress-bar analytics-progress-bar--${status.toLowerCase()}`}
                                            style={{
                                                width: `${getPercentage(
                                                    statistics.statusCounts[
                                                    status
                                                    ],
                                                    statistics.total,
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="card">
                    <div className="analytics-section-header">
                        <div>
                            <h2>File types</h2>
                            <p>
                                Distribution of uploaded document
                                formats.
                            </p>
                        </div>
                    </div>

                    {statistics.fileTypes.length === 0 ? (
                        <p className="analytics-empty">
                            No documents available.
                        </p>
                    ) : (
                        <div className="analytics-file-types">
                            {statistics.fileTypes.map(
                                ([extension, count]) => (
                                    <div
                                        className="analytics-file-row"
                                        key={extension}
                                    >
                                        <span className="analytics-file-name">
                                            {extension}
                                        </span>

                                        <div className="analytics-file-bar-container">
                                            <div
                                                className="analytics-file-bar"
                                                style={{
                                                    width: `${getPercentage(
                                                        count,
                                                        statistics.total,
                                                    )}%`,
                                                }}
                                            />
                                        </div>

                                        <span className="analytics-file-count">
                                            {count}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    )}
                </div>
            </section>

            <section className="card analytics-ai-section">
                <div className="analytics-section-header">
                    <div>
                        <h2>AI analytics</h2>
                        <p>
                            Retrieval and generation metrics will
                            appear here when exposed by the analytics
                            API.
                        </p>
                    </div>

                    <span className="analytics-coming-soon">
                        Coming later
                    </span>
                </div>

                <div className="analytics-ai-grid">
                    <AnalyticsMetricPlaceholder
                        title="Token usage"
                        description="Input, output, and total token consumption."
                    />

                    <AnalyticsMetricPlaceholder
                        title="Latency"
                        description="Retrieval and generation response times."
                    />

                    <AnalyticsMetricPlaceholder
                        title="Retrieval quality"
                        description="Precision, recall, and ranking metrics."
                    />

                    <AnalyticsMetricPlaceholder
                        title="Groundedness"
                        description="How well generated answers are supported by retrieved context."
                    />

                    <AnalyticsMetricPlaceholder
                        title="Relevance"
                        description="Quality of retrieved context and generated answers."
                    />

                    <AnalyticsMetricPlaceholder
                        title="Hallucination"
                        description="Evaluation results for unsupported generated content."
                    />
                </div>
            </section>
        </main>
    );
}

interface AnalyticsMetricPlaceholderProps {
    title: string;
    description: string;
}

function AnalyticsMetricPlaceholder({
    title,
    description,
}: AnalyticsMetricPlaceholderProps) {
    return (
        <div className="analytics-metric-placeholder">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

function getFileExtension(fileName: string): string {
    const extension = fileName
        .split(".")
        .pop()
        ?.toUpperCase();

    return extension ? `.${extension}` : "Unknown";
}

function getPercentage(
    value: number,
    total: number,
): number {
    if (total === 0) {
        return 0;
    }

    return Math.round((value / total) * 100);
}

export default AnalyticsPage;