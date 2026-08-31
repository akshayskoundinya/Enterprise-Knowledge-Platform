import { Router } from "express";

import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import roleRoutes from "./role.routes";
import documentRoutes from "./document.routes";
import internalDocumentRoutes from "./internal-document.routes";
import retrievalRoutes from "./retrieval.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/documents", documentRoutes);
router.use(
    "/internal/v1/documents",
    internalDocumentRoutes
);
router.use("/retrieval", retrievalRoutes);
export default router;