import { createAppError } from "../../errors";
import type { Permission } from "../../constants";
import { roleRepository } from "../../repositories";

interface CreateRoleInput {
    name: string;
    description: string;
    permissions: Permission[];
}

interface UpdateRoleInput {
    name?: string;
    description?: string;
    permissions?: Permission[];
}

export async function createRole(
    input: CreateRoleInput
) {
    const existingRole = await roleRepository.findByName(
        input.name
    );

    if (existingRole) {
        throw createAppError(
            "A role with this name already exists",
            409,
            "ROLE_ALREADY_EXISTS"
        );
    }

    return roleRepository.create(input);
}

export async function getRoles() {
    return roleRepository.findAll();
}

export async function getRole(roleId: string) {
    const role = await roleRepository.findById(roleId);

    if (!role) {
        throw createAppError(
            "Role not found",
            404,
            "ROLE_NOT_FOUND"
        );
    }

    return role;
}

export async function updateRole(
    roleId: string,
    input: UpdateRoleInput
) {
    const existingRole = await roleRepository.findById(
        roleId
    );

    if (!existingRole) {
        throw createAppError(
            "Role not found",
            404,
            "ROLE_NOT_FOUND"
        );
    }

    if (existingRole.isSystemRole) {
        throw createAppError(
            "System roles cannot be modified",
            403,
            "SYSTEM_ROLE_MODIFICATION_FORBIDDEN"
        );
    }

    if (
        input.name &&
        input.name !== existingRole.name
    ) {
        const roleWithName =
            await roleRepository.findByName(input.name);

        if (roleWithName) {
            throw createAppError(
                "A role with this name already exists",
                409,
                "ROLE_ALREADY_EXISTS"
            );
        }
    }

    const updatedRole = await roleRepository.updateById(
        roleId,
        input
    );

    if (!updatedRole) {
        throw createAppError(
            "Role not found",
            404,
            "ROLE_NOT_FOUND"
        );
    }

    return updatedRole;
}