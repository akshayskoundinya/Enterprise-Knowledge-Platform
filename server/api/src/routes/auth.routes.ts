import { Router } from "express";

import {
    loginController,
    refreshController,
} from "../controllers/auth.controller";

import { validate } from "../middleware/validate";
import {
    loginSchema,
    refreshSchema,
} from "../validators/auth.validator";

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

export default router;