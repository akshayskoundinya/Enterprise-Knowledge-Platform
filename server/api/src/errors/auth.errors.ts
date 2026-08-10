import { createAppError } from "./app-error";

export function invalidCredentialsError() {
    return createAppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS"
    );
}

export function inactiveAccountError() {
    return createAppError(
        "User account is inactive",
        403,
        "ACCOUNT_INACTIVE"
    );
}

export function invalidRefreshTokenError() {
    return createAppError(
        "Invalid refresh token",
        401,
        "INVALID_REFRESH_TOKEN"
    );
}