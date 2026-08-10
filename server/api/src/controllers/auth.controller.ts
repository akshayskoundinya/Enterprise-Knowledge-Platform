import { Request, Response, NextFunction } from "express";

import { login, refresh } from "../services/auth";

export async function loginController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { email, password } = req.body;

        const result = await login({
            email,
            password,
            ipAddress: req.ip,
            userAgent: req.get("user-agent") ?? undefined,
        });

        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function refreshController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { refreshToken } = req.body;

        const result = await refresh(refreshToken);

        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
}