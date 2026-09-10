import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginApi } from "@/features/auth/auth.api";
import { useAuth } from "@/features/auth/useAuth";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
        <main>
            <h1>Enterprise Knowledge Platform</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                {error && (
                    <p role="alert">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Signing in..."
                        : "Sign in"}
                </button>
            </form>
        </main>
    );
}

export default LoginPage;