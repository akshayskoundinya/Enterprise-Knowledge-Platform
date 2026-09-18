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

router.use("/api/auth", authRoutes);

router.use("/api/users", userRoutes);

router.use("/api/roles", roleRoutes);

router.use("/api/documents", documentRoutes);

router.use(
    "/internal/v1/documents",
    internalDocumentRoutes,
);

router.use("/api/retrieval", retrievalRoutes);

export default router;