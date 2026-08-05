import { InferSchemaType, model, Schema } from "mongoose";

const roleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        permissions: [
            {
                type: String,
                required: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);


export type Role = InferSchemaType<typeof roleSchema>;

export const RoleModel = model("Role", roleSchema);