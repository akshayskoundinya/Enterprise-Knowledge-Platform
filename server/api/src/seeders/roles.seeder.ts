import { RoleModel } from "../models";
import { Permissions, Roles } from "../constants";
import { logger } from "../logger";

const defaultRoles = [
    {
        name: Roles.ADMIN,
        description: "System administrator",
        permissions: Object.values(Permissions),
        isSystemRole: true,
    },
    {
        name: Roles.MANAGER,
        description: "Manager",
        permissions: [
            Permissions.DOCUMENT_READ,
            Permissions.DOCUMENT_UPLOAD,
            Permissions.USER_READ,
            Permissions.CHAT_CREATE,
            Permissions.CHAT_READ,
        ],
        isSystemRole: true,
    },
    {
        name: Roles.EMPLOYEE,
        description: "Employee",
        permissions: [
            Permissions.DOCUMENT_READ,
            Permissions.CHAT_CREATE,
            Permissions.CHAT_READ,
        ],
        isSystemRole: true,
    },
];

export async function seedRoles(): Promise<void> {
    for (const role of defaultRoles) {
        const result = await RoleModel.updateOne(
            { name: role.name },
            role,
            { upsert: true }
        );

        logger.debug(
            {
                module: "database",
                role: role.name,
                result,
            },
            "Role seeded"
        );

        logger.info(result);
    }

    const count = await RoleModel.countDocuments();

    logger.info({ count }, "Number of roles in database");
}