import { env } from "../config/env";
import { Roles, UserStatus } from "../constants";
import { logger } from "../logger";
import { RoleModel, UserModel } from "../models";
import { hashPassword } from "../security/password";

export async function seedEmployee(): Promise<void> {
    const employeeRole = await RoleModel.findOne({
        name: Roles.EMPLOYEE,
    });

    if (!employeeRole) {
        throw new Error(
            "EMPLOYEE role not found. Please run the role seeder first."
        );
    }

    const existingEmployee = await UserModel.findOne({
        email: env.DEFAULT_EMPLOYEE_EMAIL,
    });

    if (existingEmployee) {
        logger.info(
            { module: "database" },
            "Employee user already exists. Skipping seeding."
        );

        return;
    }

    const passwordHash = await hashPassword(
        env.DEFAULT_EMPLOYEE_PASSWORD
    );

    await UserModel.create({
        firstName: "Test",
        lastName: "Employee",
        email: env.DEFAULT_EMPLOYEE_EMAIL,
        passwordHash,
        roleId: employeeRole._id,
        status: UserStatus.ACTIVE,
    });

    logger.info(
        { module: "database" },
        "Employee user seeded successfully"
    );
}