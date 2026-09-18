import { useState } from "react";
import type { SubmitEvent } from "react";
import {
    Link,
    Navigate,
    useNavigate,
} from "react-router-dom";

import { login as loginApi } from "@/features/auth/auth.api";
import { useAuth } from "@/features/auth/useAuth";

import "./LoginPage.css";

function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    if (isAuthenticated) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError(null);
        setIsLoading(true);

        try {
            const response = await loginApi({
                email,
                password,
            });

            login(
                response.data.accessToken,
                response.data.refreshToken,
            );

            navigate("/dashboard");
        } catch {
            setError("Invalid email or password.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="login-page">
            <div className="login-container">
                <div className="login-brand">
                    <Link
                        to="/"
                        className="login-brand__link"
                    >
                        Enterprise Knowledge Platform
                    </Link>

                    <p>
                        Secure organizational knowledge
                    </p>
                </div>

                <section
                    className="login-card"
                    aria-labelledby="login-title"
                >
                    <div className="login-card__header">
                        <h1 id="login-title">
                            Welcome back
                        </h1>

                        <p>
                            Sign in to access your
                            organization&apos;s knowledge.
                        </p>
                    </div>

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                        aria-describedby={
                            error
                                ? "login-error"
                                : undefined
                        }
                    >
                        <div className="login-field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value,
                                    )
                                }
                                placeholder="you@company.com"
                                autoComplete="email"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <p
                                id="login-error"
                                className="login-error"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            className="login-submit"
                            type="submit"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>
                    </form>
                </section>

                <p className="login-footer">
                    Access is managed according to your
                    organization&apos;s role and permissions.
                </p>
            </div>
        </main>
    );
}

export default LoginPage;