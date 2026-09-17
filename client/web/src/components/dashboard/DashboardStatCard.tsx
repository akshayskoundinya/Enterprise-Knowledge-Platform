interface DashboardStatCardProps {
    label: string;
    value: number;
}

function DashboardStatCard({
    label,
    value,
}: DashboardStatCardProps) {
    return (
        <article className="dashboard-stat-card">
            <p className="dashboard-stat-card__label">
                {label}
            </p>

            <strong className="dashboard-stat-card__value">
                {value}
            </strong>
        </article>
    );
}

export default DashboardStatCard;