import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth/useAuth";

import App from "@/app/App";

function HomePage() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <App />;
}

export default HomePage;