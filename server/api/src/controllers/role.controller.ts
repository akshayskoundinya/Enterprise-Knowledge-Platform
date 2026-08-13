import { NextFunction, Request, Response } from "express";

import {
    createRole,
    getRole,
    getRoles,
    updateRole,
} from "../services/role";

export async function createRoleController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const role = await createRole(req.body);

        res.status(201).json({
            data: role,
        });
    } catch (error) {
        next(error);
    }
}

export async function getRolesController(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const roles = await getRoles();

        res.status(200).json({
            data: roles,
        });
    } catch (error) {
        next(error);
    }
}

export async function getRoleController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const role = await getRole(req.params.id);

        res.status(200).json({
            data: role,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateRoleController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const role = await updateRole(
            req.params.id,
            req.body
        );

        res.status(200).json({
            data: role,
        });
    } catch (error) {
        next(error);
    }
}