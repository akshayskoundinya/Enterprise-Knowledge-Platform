import { env } from "../config/env";
import { Roles, UserStatus } from "../constants";
import { logger } from "../logger";
import { RoleModel, UserModel } from "../models";
import { hashPassword } from "../utils/password";

export async function seedAdmin(): Promise<void> {
    const adminRole = await RoleModel.findOne({
        name: Roles.ADMIN,
    });

    if (!adminRole) {
        throw new Error("ADMIN role not found. Please run the role seeder first.");
    }

    const existingAdmin = await UserModel.findOne({
        email: env.DEFAULT_ADMIN_EMAIL,
    });

    if (existingAdmin) {
        logger.info(
            { module: "database" },
            "Admin user already exists. Skipping seeding."
        );

        return;
    }

    const passwordHash = await hashPassword(env.DEFAULT_ADMIN_PASSWORD);

    const result = await UserModel.create({
        firstName: "System",
        lastName: "Administrator",
        email: env.DEFAULT_ADMIN_EMAIL,
        passwordHash,
        roleId: adminRole._id,
        status: UserStatus.ACTIVE,
    });

    logger.info(
        {
            module: "database",
            result,
        },
        "Admin user seeded successfully"
    );
}