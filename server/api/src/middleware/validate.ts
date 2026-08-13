import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { createAppError } from "../errors";

type RequestPart = "body" | "params" | "query";

export function validate(
    schema: z.ZodType,
    part: RequestPart = "body"
) {
    return (
        req: Request,
        _res: Response,
        next: NextFunction
    ): void => {
        const result = schema.safeParse(req[part]);

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

        req[part] = result.data;

        next();
    };
}