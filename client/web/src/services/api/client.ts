import axios from "axios";

import {
    clearTokens,
    getAccessToken,
} from "@/features/auth/auth.storage";

export const apiClient = axios.create({
    baseURL: "/api",
});

apiClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
        config.headers.Authorization =
            `Bearer ${accessToken}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                clearTokens();

                if (
                    window.location.pathname !==
                    "/login"
                ) {
                    window.location.assign("/login");
                }
            }
        }

        return Promise.reject(error);
    },
);