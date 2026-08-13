import { Router } from "express";

import {
    createUserController,
    deactivateUserController,
    getUserController,
    getUsersController,
    updateUserController,
} from "../controllers/user.controller";

import { authenticate, authorize } from "../middleware";

import { Permissions } from "../constants";

import { validate } from "../middleware/validate";

import {
    createUserSchema,
    updateUserSchema,
    userIdSchema,
} from "../validators/user.validator";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(Permissions.USER_CREATE),
    validate(createUserSchema),
    createUserController
);

router.get(
    "/",
    authenticate,
    authorize(Permissions.USER_READ),
    getUsersController
);

router.get(
    "/:id",
    authenticate,
    authorize(Permissions.USER_READ),
    validate(userIdSchema, "params"),
    getUserController
);

router.patch(
    "/:id",
    authenticate,
    authorize(Permissions.USER_UPDATE),
    validate(userIdSchema, "params"),
    validate(updateUserSchema),
    updateUserController
);

router.delete(
    "/:id",
    authenticate,
    authorize(Permissions.USER_DELETE),
    validate(userIdSchema, "params"),
    deactivateUserController
);

export default router;