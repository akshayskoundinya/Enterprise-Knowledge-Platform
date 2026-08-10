import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

import { createAppError } from "../errors";

export function validate(schema: ZodSchema) {
    return (
        req: Request,
        _res: Response,
        next: NextFunction
    ): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            next(
                createAppError(
                    "Invalid request data",
                    400,
                    "VALIDATION_ERROR"
                )
            );

            return;
        }

        req.body = result.data;

        next();
    };
}