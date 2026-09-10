import { useMemo, useState } from "react";

import {
    clearTokens,
    getAccessToken,
    saveTokens,
} from "./auth.storage";
import { AuthContext } from "./auth.context";

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [accessToken, setAccessToken] =
        useState<string | null>(getAccessToken());

    function login(
        accessToken: string,
        refreshToken: string,
    ) {
        saveTokens(accessToken, refreshToken);
        setAccessToken(accessToken);
    }

    function logout() {
        clearTokens();
        setAccessToken(null);
    }

    const value = useMemo(
        () => ({
            accessToken,
            isAuthenticated: accessToken !== null,
            login,
            logout,
        }),
        [accessToken],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}