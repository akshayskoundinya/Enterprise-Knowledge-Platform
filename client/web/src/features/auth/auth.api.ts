import { apiClient } from "@/services/api";

import type {
    LoginRequest,
    LoginResponse,
} from "./auth.types";

export async function login(
    credentials: LoginRequest,
): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        credentials,
    );

    return response.data;
}