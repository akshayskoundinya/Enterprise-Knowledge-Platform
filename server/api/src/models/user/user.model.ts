import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        passwordHash: {
            type: String,
            required: true,
        },

        roleId: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },

        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE",
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model("User", userSchema);