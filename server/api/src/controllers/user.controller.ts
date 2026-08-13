import { NextFunction, Request, Response } from "express";

import {
    createUser,
    deactivateUser,
    getUser,
    getUsers,
    updateUser,
} from "../services/user";
import { toUserResponse } from "../mapper/user.mapper";

export async function createUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await createUser(req.body);

        res.status(201).json({
            data: toUserResponse(user),
        });
    } catch (error) {
        next(error);
    }
}

export async function getUsersController(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const users = await getUsers();

        res.status(200).json({
            data: users.map(toUserResponse),
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await getUser(req.params.id);

        res.status(200).json({
            data: toUserResponse(user),
        });
    } catch (error) {
        next(error);
    }
}

export async function updateUserController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = await updateUser(
            req.params.id,
            req.body
        );

        res.status(200).json({
            data: toUserResponse(user),
        });
    } catch (error) {
        next(error);
    }
}

export async function deactivateUserController(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await deactivateUser(req.params.id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}