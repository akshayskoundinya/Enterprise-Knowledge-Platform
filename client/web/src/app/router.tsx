import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import ProtectedRoute from "./ProtectedRoute";

import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/dashboard",
                element: <DashboardPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);