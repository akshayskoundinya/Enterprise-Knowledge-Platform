import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine(
    (value) => mongoose.isValidObjectId(value),
    "Invalid ID"
  );

export const createUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required"),

  email: z.email(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  roleId: objectIdSchema,
});

export const updateUserSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name cannot be empty")
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name cannot be empty")
      .optional(),

    email: z
      .email()
      .optional(),

    roleId: objectIdSchema.optional(),

    status: z
      .enum(["ACTIVE", "INACTIVE"])
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required",
    }
  );

export const userIdSchema = z.object({
  id: objectIdSchema,
});

export type CreateUserInput =
  z.infer<typeof createUserSchema>;

export type UpdateUserInput =
  z.infer<typeof updateUserSchema>;