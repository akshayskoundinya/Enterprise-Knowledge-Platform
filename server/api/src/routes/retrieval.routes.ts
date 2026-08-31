import { Router } from "express";

import { Permissions } from "../constants";
import {
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

export default router;