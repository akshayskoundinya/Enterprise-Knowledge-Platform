import multer from "multer";
import type {
    NextFunction,
    Request,
    Response,
} from "express";

import {
    ALLOWED_DOCUMENT_MIME_TYPES,
    MAX_DOCUMENT_SIZE,
} from "../constants";

import { createAppError } from "../errors";

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: MAX_DOCUMENT_SIZE,
        files: 1,
    },

    fileFilter: (_req, file, callback) => {
        if (
            !ALLOWED_DOCUMENT_MIME_TYPES.includes(
                file.mimetype as typeof ALLOWED_DOCUMENT_MIME_TYPES[number]
            )
        ) {
            callback(
                createAppError(
                    "Unsupported document type",
                    400,
                    "UNSUPPORTED_DOCUMENT_TYPE"
                )
            );

            return;
        }

        callback(null, true);
    },
});

export function uploadSingleDocument(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    upload.single("file")(req, res, (error) => {
        if (!error) {
            next();
            return;
        }

        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                next(
                    createAppError(
                        "Document exceeds the maximum allowed size of 25 MB",
                        413,
                        "DOCUMENT_TOO_LARGE"
                    )
                );

                return;
            }

            if (error.code === "LIMIT_FILE_COUNT") {
                next(
                    createAppError(
                        "Only one document can be uploaded at a time",
                        400,
                        "TOO_MANY_FILES"
                    )
                );

                return;
            }
        }

        next(error);
    });
}