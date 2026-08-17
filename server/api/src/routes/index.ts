import { Router } from "express";

import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import roleRoutes from "./role.routes";
import documentRoutes from "./document.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/documents", documentRoutes);
router.get("/:id/download", documentRoutes);
router.get("/:id", documentRoutes);
router.patch("/:id", documentRoutes);
export default router;