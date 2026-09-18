import { useState } from "react";
import {
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "@/features/auth/useAuth";
// import ThemeToggle from "@/components/theme/ThemeToggle";

import "./AppLayout.css";

function AppLayout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [isSidebarOpen, setIsSidebarOpen] =
        useState(false);

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    function closeSidebar() {
        setIsSidebarOpen(false);
    }

    return (
        <div className="app-layout">
            {isSidebarOpen && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    aria-label="Close navigation"
                    onClick={closeSidebar}
                />
            )}

            <aside
                id="app-navigation"
                className={`app-sidebar ${isSidebarOpen
                        ? "app-sidebar--open"
                        : ""
                    }`}
                aria-label="Main navigation"
            >
                <div className="app-sidebar__top">
                    <div className="app-sidebar__brand">
                        <h2>EKP</h2>
                        <span>
                            Enterprise Knowledge Platform
                        </span>
                    </div>

                    <button
                        type="button"
                        className="sidebar-close-button"
                        aria-label="Close navigation"
                        onClick={closeSidebar}
                    >
                        ✕
                    </button>
                </div>

                <nav
                    className="app-sidebar__nav"
                    aria-label="Primary"
                >
                    <NavLink
                        to="/dashboard"
                        onClick={closeSidebar}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/documents"
                        onClick={closeSidebar}
                    >
                        Documents
                    </NavLink>

                    <NavLink
                        to="/chat"
                        onClick={closeSidebar}
                    >
                        Chat
                    </NavLink>

                    <NavLink
                        to="/analytics"
                        onClick={closeSidebar}
                    >
                        Analytics
                    </NavLink>

                    <NavLink
                        to="/admin"
                        onClick={closeSidebar}
                    >
                        Admin
                    </NavLink>
                </nav>

                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </aside>

            <div className="app-main">
                <header className="app-header">
                    <button
                        type="button"
                        className="menu-button"
                        aria-label="Open navigation"
                        aria-expanded={isSidebarOpen}
                        aria-controls="app-navigation"
                        onClick={() =>
                            setIsSidebarOpen(true)
                        }
                    >
                        ☰
                    </button>

                    <span className="app-header__title">
                        Enterprise Knowledge Platform
                    </span>
                </header>

                <main className="app-content">
                    <Outlet />
                </main>
            </div>

            {/* <ThemeToggle /> */}
        </div>
    );
}

export default AppLayout;