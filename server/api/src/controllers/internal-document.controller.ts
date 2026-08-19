import type { Request, Response } from "express";

import {
    getInternalDocumentContent,
} from "../services/document";

import type { DocumentParams } from "../types/document";

export async function getInternalDocumentContentController(
    req: Request<DocumentParams>,
    res: Response
) {
    const result =
        await getInternalDocumentContent(
            req.params.id
        );

    res
        .status(200)
        .type(result.document.mimeType)
        .send(result.file);
}