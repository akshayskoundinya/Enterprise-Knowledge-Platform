import { useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/useAuth";

function DashboardPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <button type="button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default DashboardPage;