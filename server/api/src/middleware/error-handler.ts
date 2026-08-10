import { NextFunction, Request, Response } from "express";

import { isAppError } from "../errors";
import { logger } from "../logger";

export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (isAppError(error)) {
        res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
            },
        });

        return;
    }

    logger.error(
        {
            module: "api",
            err: error,
        },
        "Unhandled application error"
    );

    res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
        },
    });
}