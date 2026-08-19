import type {
    NextFunction,
    Request,
    Response,
    RequestHandler,
} from "express";
import { timingSafeEqual } from "node:crypto";

import { env } from "../config/env";

import type { DocumentParams } from "../types/document";

export const requireInternalApiKey: RequestHandler<
    DocumentParams
> = (
    req: Request<DocumentParams>,
    res: Response,
    next: NextFunction
) => {
        const providedKey =
            req.header("X-Internal-API-Key");

        if (!providedKey) {
            return res.status(401).json({
                error: {
                    code: "INTERNAL_AUTH_REQUIRED",
                    message: "Internal API key required",
                },
            });
        }

        const providedBuffer =
            Buffer.from(providedKey);

        const expectedBuffer =
            Buffer.from(env.AI_INTERNAL_API_KEY);

        if (
            providedBuffer.length !==
            expectedBuffer.length ||
            !timingSafeEqual(
                providedBuffer,
                expectedBuffer
            )
        ) {
            return res.status(401).json({
                error: {
                    code: "INVALID_INTERNAL_API_KEY",
                    message: "Invalid internal API key",
                },
            });
        }

        next();
    };