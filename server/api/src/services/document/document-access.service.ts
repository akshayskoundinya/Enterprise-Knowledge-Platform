import { createAppError } from "../../errors";
import { Permissions } from "../../constants";
import { roleRepository } from "../../repositories";

interface AccessUser {
    id: string;
    roleId: string;
}

export async function canAccessDocument(
    user: AccessUser,
    documentOwnerId: string
): Promise<boolean> {
    const role = await roleRepository.findById(
        user.roleId
    );

    if (!role) {
        throw createAppError(
            "Role not found",
            404,
            "ROLE_NOT_FOUND"
        );
    }

    const canReadAll =
        role.permissions.includes(
            Permissions.DOCUMENT_READ_ALL
        );

    if (canReadAll) {
        return true;
    }

    return user.id === documentOwnerId;
}