import { NextFunction, Request, Response } from "express";

import { invalidCredentialsError } from "../errors";
import { jwtUtils } from "../security";
import { userRepository } from "../repositories";
import { invalidAccessTokenError } from "../errors";

export async function authenticate(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            next(invalidCredentialsError());
            return;
        }

        const [scheme, token] = authorization.split(" ");

        if (scheme !== "Bearer" || !token) {
            next(invalidCredentialsError());
            return;
        }

        const payload = jwtUtils.verifyAccessToken(token);

        if (!payload.sub) {
            next(invalidCredentialsError());
            return;
        }

        const user = await userRepository.findById(payload.sub);

        if (!user || user.status !== "ACTIVE") {
            next(invalidCredentialsError());
            return;
        }

        req.user = {
            id: user._id.toString(),
            roleId: user.roleId.toString(),
        };

        next();
    } catch {
        next(invalidCredentialsError());
        next(invalidAccessTokenError());
    }
}