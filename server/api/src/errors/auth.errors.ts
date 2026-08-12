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

export function invalidAccessTokenError() {
    return createAppError(
        "Invalid access token",
        401,
        "INVALID_ACCESS_TOKEN"
    );
}

export function insufficientPermissionsError() {
    return createAppError(
        "You do not have permission to perform this action",
        403,
        "INSUFFICIENT_PERMISSIONS"
    );
}