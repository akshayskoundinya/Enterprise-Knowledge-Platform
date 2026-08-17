import { Types } from "mongoose";
import { DocumentModel } from "../../models";

async function create(data: {
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    storageKey: string;
    uploadedBy: string;
}) {
    return DocumentModel.create({
        ...data,
        uploadedBy: new Types.ObjectId(data.uploadedBy),
    });
}

async function findById(documentId: string) {
    return DocumentModel.findById(documentId);
}

async function findAll() {
    return DocumentModel.find()
        .sort({ createdAt: -1 });
}

async function findByOwner(userId: string) {
    return DocumentModel.find({
        uploadedBy: new Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
}

async function updateStatus(
    documentId: string,
    status:
        | "UPLOADED"
        | "PROCESSING"
        | "READY"
        | "FAILED"
) {
    return DocumentModel.findByIdAndUpdate(
        documentId,
        {
            $set: {
                status,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );
}

async function deleteById(documentId: string) {
    return DocumentModel.findByIdAndDelete(
        documentId
    );
}

async function updateById<T extends object>(
    documentId: string,
    data: T
) {
    return DocumentModel.findByIdAndUpdate(
        documentId,
        data,
        {
            new: true,
            runValidators: true,
        }
    );
}

export const documentRepository = {
    create,
    findById,
    findAll,
    findByOwner,
    updateStatus,
    deleteById,
    updateById,
};