export interface AppError {
    name: "AppError";
    message: string;
    statusCode: number;
    code: string;
}

export function createAppError(
    message: string,
    statusCode: number,
    code: string
): AppError {
    return {
        name: "AppError",
        message,
        statusCode,
        code,
    };
}

export function isAppError(error: unknown): error is AppError {
    if (typeof error !== "object" || error === null) {
        return false;
    }

    const candidate = error as Record<string, unknown>;

    return (
        candidate.name === "AppError" &&
        typeof candidate.message === "string" &&
        typeof candidate.statusCode === "number" &&
        typeof candidate.code === "string"
    );
}