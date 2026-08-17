import {
    HydratedDocument,
    model,
    Schema,
    Types,
} from "mongoose";

export interface Document {
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    storageKey: string;
    uploadedBy: Types.ObjectId;
    status:
    | "UPLOADED"
    | "PROCESSING"
    | "READY"
    | "FAILED";
    createdAt: Date;
    updatedAt: Date;
}

export type DocumentDocument =
    HydratedDocument<Document>;

const documentSchema = new Schema<Document>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        originalName: {
            type: String,
            required: true,
            trim: true,
        },

        mimeType: {
            type: String,
            required: true,
            trim: true,
        },

        size: {
            type: Number,
            required: true,
            min: 1,
        },

        storageKey: {
            type: String,
            required: true,
            unique: true,
        },

        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: [
                "UPLOADED",
                "PROCESSING",
                "READY",
                "FAILED",
            ],
            default: "UPLOADED",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const DocumentModel = model<Document>(
    "Document",
    documentSchema
);