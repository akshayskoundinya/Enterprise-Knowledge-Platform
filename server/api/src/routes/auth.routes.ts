import { Router } from "express";

import {
    loginController,
    logoutController,
    refreshController,
    logoutAllController,
} from "../controllers/auth.controller";

import { validate } from "../middleware/validate";
import {
    loginSchema,
    refreshSchema,
} from "../validators/auth.validator";
import { authenticate, authorize } from "../middleware";
import { Permissions } from "../constants";

const router = Router();

router.post(
    "/login",
    validate(loginSchema),
    loginController
);

router.post(
    "/refresh",
    validate(refreshSchema),
    refreshController
);

router.post(
    "/logout",
    validate(refreshSchema),
    logoutController
);

router.post(
    "/logout-all",
    authenticate,
    logoutAllController
);

export default router;