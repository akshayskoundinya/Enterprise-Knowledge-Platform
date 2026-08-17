import {
    NextFunction,
    Request,
    Response,
} from "express";

import {
    getAccessibleDocument,
    getAccessibleDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    updateDocument,
} from "../services/document";

import { toDocumentResponse } from "../mapper/document.mapper";

import { createAppError } from "../errors";

export async function uploadDocumentController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.file) {
            next(
                createAppError(
                    "Document file is required",
                    400,
                    "DOCUMENT_FILE_REQUIRED"
                )
            );

            return;
        }

        if (!req.user) {
            next(
                createAppError(
                    "Authenticated user required",
                    401,
                    "UNAUTHENTICATED"
                )
            );

            return;
        }

        const document = await uploadDocument({
            file: req.file.buffer,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            uploadedBy: req.user.id,
        });

        res.status(201).json({
            data: toDocumentResponse(document),
        });
    } catch (error) {
        next(error);
    }
}

export async function getDocumentsController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            next(
                createAppError(
                    "Authenticated user required",
                    401,
                    "UNAUTHENTICATED"
                )
            );

            return;
        }

        const documents =
            await getAccessibleDocuments(
                req.user.id,
                req.user.roleId
            );

        res.status(200).json({
            data: documents.map(
                toDocumentResponse
            ),
        });
    } catch (error) {
        next(error);
    }
}

export async function getDocumentController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            next(
                createAppError(
                    "Authenticated user required",
                    401,
                    "UNAUTHENTICATED"
                )
            );

            return;
        }

        const document =
            await getAccessibleDocument(
                req.params.id,
                req.user.id,
                req.user.roleId
            );

        res.status(200).json({
            data: toDocumentResponse(document),
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteDocumentController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            next(
                createAppError(
                    "Authenticated user required",
                    401,
                    "UNAUTHENTICATED"
                )
            );

            return;
        }

        await deleteDocument(
            req.params.id,
            req.user.id,
            req.user.roleId
        );

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function downloadDocumentController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            next(
                createAppError(
                    "Authenticated user required",
                    401,
                    "UNAUTHENTICATED"
                )
            );

            return;
        }

        const {
            document,
            file,
        } = await downloadDocument(
            req.params.id,
            req.user.id,
            req.user.roleId
        );

        res.setHeader(
            "Content-Type",
            document.mimeType
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${encodeURIComponent(
                document.originalName
            )}"`
        );

        res.status(200).send(file);
    } catch (error) {
        next(error);
    }
}

export async function updateDocumentController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            next(
                createAppError(
                    "Authenticated user required",
                    401,
                    "UNAUTHENTICATED"
                )
            );

            return;
        }

        const document =
            await updateDocument(
                req.params.id,
                req.user.id,
                req.user.roleId,
                req.body
            );

        res.status(200).json({
            data: toDocumentResponse(document),
        });
    } catch (error) {
        next(error);
    }
}