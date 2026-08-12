import { Request, Response, NextFunction } from "express";

import {
    login,
    logout,
    refresh,
    logoutAll,
} from "../services/auth";

import { invalidAccessTokenError } from "../errors";

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

export async function logoutController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { refreshToken } = req.body;

        await logout(refreshToken);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function logoutAllController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            next(invalidAccessTokenError());
            return;
        }

        await logoutAll(req.user.id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}