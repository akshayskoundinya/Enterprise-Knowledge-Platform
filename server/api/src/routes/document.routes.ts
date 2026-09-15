import { Router } from "express";

import { Permissions } from "../constants";

import {
    uploadDocumentController,
    getDocumentsController,
    getDocumentController,
    downloadDocumentController,
    updateDocumentController,
    deleteDocumentController,
} from "../controllers";

import {
    authenticate,
    authorize,
    validate,
    uploadSingleDocument,
} from "../middleware";

import {
    documentIdSchema,
    updateDocumentSchema,
} from "../validators/document.validator";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(Permissions.DOCUMENT_UPLOAD),
    uploadSingleDocument,
    uploadDocumentController,
);

router.get(
    "/",
    authenticate,
    authorize(Permissions.DOCUMENT_READ),
    getDocumentsController,
);

router.patch(
    "/:id",
    authenticate,
    authorize(Permissions.DOCUMENT_UPDATE),
    validate(documentIdSchema, "params"),
    validate(updateDocumentSchema),
    updateDocumentController,
);

router.delete(
    "/:id",
    authenticate,
    authorize(Permissions.DOCUMENT_DELETE),
    validate(documentIdSchema, "params"),
    deleteDocumentController,
);

router.get(
    "/:id/download",
    authenticate,
    authorize(Permissions.DOCUMENT_READ),
    validate(documentIdSchema, "params"),
    downloadDocumentController,
);

router.get(
    "/:id",
    authenticate,
    authorize(Permissions.DOCUMENT_READ),
    validate(documentIdSchema, "params"),
    getDocumentController,
);


export default router;