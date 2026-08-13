import { Router } from "express";

import {
    createRoleController,
    getRoleController,
    getRolesController,
    updateRoleController,
} from "../controllers/role.controller";

import { Permissions } from "../constants";

import { authenticate, authorize } from "../middleware";
import { validate } from "../middleware/validate";

import {
    createRoleSchema,
    roleIdSchema,
    updateRoleSchema,
} from "../validators/role.validator";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(Permissions.ROLE_CREATE),
    validate(createRoleSchema),
    createRoleController
);

router.get(
    "/",
    authenticate,
    authorize(Permissions.ROLE_READ),
    getRolesController
);

router.get(
    "/:id",
    authenticate,
    authorize(Permissions.ROLE_READ),
    validate(roleIdSchema, "params"),
    getRoleController
);

router.patch(
    "/:id",
    authenticate,
    authorize(Permissions.ROLE_UPDATE),
    validate(roleIdSchema, "params"),
    validate(updateRoleSchema),
    updateRoleController
);

export default router;