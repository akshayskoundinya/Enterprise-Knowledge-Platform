import { InferSchemaType, model, Schema } from "mongoose";

import type { Permission } from "../../constants";
import { Permissions } from "../../constants";

export interface RoleDocument {
    name: string;
    description: string;
    permissions: Permission[];
    isSystemRole: boolean;
}

const roleSchema = new Schema<RoleDocument>(
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
                enum: Object.values(Permissions),
                required: true,
            },
        ],

        isSystemRole: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export type Role = InferSchemaType<typeof roleSchema>;

export const RoleModel = model<RoleDocument>("Role", roleSchema);