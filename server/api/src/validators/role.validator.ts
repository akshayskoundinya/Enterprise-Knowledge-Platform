import mongoose from "mongoose";
import { z } from "zod";

import { Permissions } from "../constants";

const objectIdSchema = z
    .string()
    .refine(
        (value) => mongoose.isValidObjectId(value),
        "Invalid ID"
    );

const permissionSchema = z.enum(
    Object.values(Permissions) as [
        string,
        ...string[]
    ]
);

export const createRoleSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Role name is required")
        .transform((value) => value.toUpperCase()),

    description: z
        .string()
        .trim()
        .min(1, "Role description is required"),

    permissions: z
        .array(permissionSchema)
        .min(1, "At least one permission is required"),
});

export const updateRoleSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Role name cannot be empty")
            .transform((value) => value.toUpperCase())
            .optional(),

        description: z
            .string()
            .trim()
            .min(1, "Role description cannot be empty")
            .optional(),

        permissions: z
            .array(permissionSchema)
            .min(1, "At least one permission is required")
            .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required",
        }
    );

export const roleIdSchema = z.object({
    id: objectIdSchema,
});

export type CreateRoleInput =
    z.infer<typeof createRoleSchema>;

export type UpdateRoleInput =
    z.infer<typeof updateRoleSchema>;