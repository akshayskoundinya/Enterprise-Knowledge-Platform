import { InferSchemaType, model, Schema, Types } from "mongoose";

const refreshTokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },

        lastUsedAt: {
            type: Date,
            default: null,
        },

        revokedAt: {
            type: Date,
            default: null,
            index: true,
        },

        ipAddress: {
            type: String,
            default: null,
        },

        userAgent: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export type RefreshToken = InferSchemaType<typeof refreshTokenSchema>;

export const RefreshTokenModel = model(
    "RefreshToken",
    refreshTokenSchema
);