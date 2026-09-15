interface DashboardStatCardProps {
    label: string;
    value: number;
}

function DashboardStatCard({
    label,
    value,
}: DashboardStatCardProps) {
    return (
        <div>
            <p>{label}</p>
            <strong>{value}</strong>
        </div>
    );
}

export default DashboardStatCard;