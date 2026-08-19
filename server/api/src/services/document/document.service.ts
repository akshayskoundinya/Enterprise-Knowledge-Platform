import { createAppError } from "../../errors";
import { documentRepository, roleRepository } from "../../repositories";
import { localStorage } from "../../storage";
import { validateFileSignature } from "../../security/file-signature";
import { Permissions } from "../../constants";
import { processDocument } from "../../clients";
import {
    canAccessDocument,
} from "./document-access.service";


interface CreateDocumentInput {
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    storageKey: string;
    uploadedBy: string;
}

interface UploadDocumentInput {
    file: Buffer;
    originalName: string;
    mimeType: string;
    uploadedBy: string;
}

export async function createDocument(
    input: CreateDocumentInput
) {
    return documentRepository.create(input);
}

export async function getDocuments() {
    return documentRepository.findAll();
}

export async function getDocumentsByOwner(
    userId: string
) {
    return documentRepository.findByOwner(userId);
}

export async function getDocument(
    documentId: string
) {
    const document =
        await documentRepository.findById(documentId);

    if (!document) {
        throw createAppError(
            "Document not found",
            404,
            "DOCUMENT_NOT_FOUND"
        );
    }

    return document;
}

export async function uploadDocument(
    input: UploadDocumentInput
) {
    validateFileSignature(
        input.file,
        input.mimeType
    );

    const storedFile = await localStorage.save(
        input.file,
        input.originalName
    );

    try {
        const document =
            await documentRepository.create({
                name: input.originalName,
                originalName: input.originalName,
                mimeType: input.mimeType,
                size: storedFile.size,
                storageKey: storedFile.storageKey,
                uploadedBy: input.uploadedBy,
            });

        try {
            await processDocument({
                documentId: document._id.toString(),
                storageKey: document.storageKey,
                mimeType: document.mimeType,
                allowedUserIds: [
                    input.uploadedBy,
                ],
            });

            const processingDocument =
                await documentRepository.updateStatus(
                    document._id.toString(),
                    "PROCESSING"
                );

            return processingDocument ?? document;
        } catch (error) {
            console.error(
                "Failed to start AI document processing:",
                error
            );
        }

        return document;
    } catch (error) {
        await localStorage.delete(
            storedFile.storageKey
        );

        throw error;
    }
}

export async function getAccessibleDocuments(
    userId: string,
    roleId: string
) {
    const role = await roleRepository.findById(roleId);

    if (!role) {
        throw createAppError(
            "Role not found",
            404,
            "ROLE_NOT_FOUND"
        );
    }

    const canReadAll = role.permissions.includes(
        Permissions.DOCUMENT_READ_ALL
    );

    if (canReadAll) {
        return documentRepository.findAll();
    }

    return documentRepository.findByOwner(userId);
}

export async function getAccessibleDocument(
    documentId: string,
    userId: string,
    roleId: string
) {
    const document =
        await documentRepository.findById(documentId);

    if (!document) {
        throw createAppError(
            "Document not found",
            404,
            "DOCUMENT_NOT_FOUND"
        );
    }

    const canAccess =
        await canAccessDocument(
            {
                id: userId,
                roleId,
            },
            document.uploadedBy.toString()
        );

    if (!canAccess) {
        throw createAppError(
            "You do not have access to this document",
            403,
            "DOCUMENT_ACCESS_FORBIDDEN"
        );
    }

    return document;
}

export async function deleteDocument(
    documentId: string,
    userId: string,
    roleId: string
): Promise<void> {
    const document =
        await documentRepository.findById(documentId);

    if (!document) {
        throw createAppError(
            "Document not found",
            404,
            "DOCUMENT_NOT_FOUND"
        );
    }

    const canAccess =
        await canAccessDocument(
            {
                id: userId,
                roleId,
            },
            document.uploadedBy.toString()
        );

    if (!canAccess) {
        throw createAppError(
            "You do not have access to this document",
            403,
            "DOCUMENT_ACCESS_FORBIDDEN"
        );
    }

    await localStorage.delete(
        document.storageKey
    );

    await documentRepository.deleteById(
        documentId
    );
}

export async function downloadDocument(
    documentId: string,
    userId: string,
    roleId: string
) {
    const document =
        await documentRepository.findById(documentId);

    if (!document) {
        throw createAppError(
            "Document not found",
            404,
            "DOCUMENT_NOT_FOUND"
        );
    }

    const canAccess =
        await canAccessDocument(
            {
                id: userId,
                roleId,
            },
            document.uploadedBy.toString()
        );

    if (!canAccess) {
        throw createAppError(
            "You do not have access to this document",
            403,
            "DOCUMENT_ACCESS_FORBIDDEN"
        );
    }

    const file = await localStorage.get(
        document.storageKey
    );

    return {
        document,
        file,
    };
}

export async function updateDocument(
    documentId: string,
    userId: string,
    roleId: string,
    input: {
        name?: string;
    }
) {
    const document =
        await documentRepository.findById(documentId);

    if (!document) {
        throw createAppError(
            "Document not found",
            404,
            "DOCUMENT_NOT_FOUND"
        );
    }

    const canAccess =
        await canAccessDocument(
            {
                id: userId,
                roleId,
            },
            document.uploadedBy.toString()
        );

    if (!canAccess) {
        throw createAppError(
            "You do not have access to this document",
            403,
            "DOCUMENT_ACCESS_FORBIDDEN"
        );
    }

    const updatedDocument =
        await documentRepository.updateById(
            documentId,
            input
        );

    if (!updatedDocument) {
        throw createAppError(
            "Document not found",
            404,
            "DOCUMENT_NOT_FOUND"
        );
    }

    return updatedDocument;
}

export async function getInternalDocumentContent(
    documentId: string
) {
    const document =
        await documentRepository.findById(
            documentId
        );

    if (!document) {
        throw createAppError(
            "Document not found",
            404,
            "DOCUMENT_NOT_FOUND"
        );
    }

    const file = await localStorage.get(
        document.storageKey
    );

    return {
        document,
        file,
    };
}