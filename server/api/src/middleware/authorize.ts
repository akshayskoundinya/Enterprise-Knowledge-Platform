import { NextFunction, Request, Response } from "express";

import { insufficientPermissionsError } from "../errors";
import { roleRepository } from "../repositories";
import type { Permission } from "../constants";

export function authorize(permission: Permission) {
    return async (
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                next(insufficientPermissionsError());
                return;
            }

            const role = await roleRepository.findById(
                req.user.roleId
            );

            if (!role) {
                next(insufficientPermissionsError());
                return;
            }

            if (!role.permissions.includes(permission)) {
                next(insufficientPermissionsError());
                return;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}