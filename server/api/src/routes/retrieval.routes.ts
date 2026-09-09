import { Router } from "express";

import { Permissions } from "../constants";
import {
    generateAnswerController,
    searchDocumentsController,
} from "../controllers";
import {
    authenticate,
    authorize,
    validate,
} from "../middleware";
import {
    retrievalSearchSchema,
} from "../validators/retrieval.validator";

const router = Router();

router.post(
    "/search",
    authenticate,
    authorize(Permissions.DOCUMENT_READ),
    validate(retrievalSearchSchema),
    searchDocumentsController
);

router.post(
    "/answer",
    authenticate,
    authorize(Permissions.DOCUMENT_READ),
    validate(retrievalSearchSchema),
    generateAnswerController
);

export default router;