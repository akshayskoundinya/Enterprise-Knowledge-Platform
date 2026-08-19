import { Router } from "express";

import {
    requireInternalApiKey,
} from "../middleware";

import {
    getInternalDocumentContentController,
} from "../controllers";

import type { DocumentParams } from "../types/document";

const router = Router();

router.get<DocumentParams>(
    "/:id/content",
    requireInternalApiKey,
    getInternalDocumentContentController
);

export default router;