import { Request, Response } from "express";

import { search } from "../services/retrieval";

export async function searchDocumentsController(
    req: Request,
    res: Response
): Promise<void> {
    if (!req.user) {
        res.status(401).json({
            error: {
                message: "Authentication required",
                code: "AUTHENTICATION_REQUIRED",
            },
        });
        return;
    }

    const result = await search({
        userId: req.user.id,
        roleId: req.user.roleId,
        query: req.body.query,
        topK: req.body.topK,
    });

    res.status(200).json({
        data: result,
    });
}