import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
    .string()
    .refine(
        (value) => mongoose.isValidObjectId(value),
        "Invalid ID"
    );

export const documentIdSchema = z.object({
    id: objectIdSchema,
});

export const updateDocumentSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Document name cannot be empty")
            .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required",
        }
    );