import { apiClient } from "@/services/api";

import type {
    AdminRole,
    AdminUser,
    CreateRoleRequest,
    CreateUserRequest,
    RoleResponse,
    RolesResponse,
    UpdateRoleRequest,
    UpdateUserRequest,
    UserResponse,
    UsersResponse,
} from "./admin.types";

export async function getUsers(): Promise<AdminUser[]> {
    const response =
        await apiClient.get<UsersResponse>("/users");

    return response.data.data;
}

export async function getUser(
    userId: string,
): Promise<AdminUser> {
    const response =
        await apiClient.get<UserResponse>(
            `/users/${userId}`,
        );

    return response.data.data;
}

export async function createUser(
    request: CreateUserRequest,
): Promise<AdminUser> {
    const response =
        await apiClient.post<UserResponse>(
            "/users",
            request,
        );

    return response.data.data;
}

export async function updateUser(
    userId: string,
    request: UpdateUserRequest,
): Promise<AdminUser> {
    const response =
        await apiClient.patch<UserResponse>(
            `/users/${userId}`,
            request,
        );

    return response.data.data;
}

export async function deactivateUser(
    userId: string,
): Promise<void> {
    await apiClient.delete(`/users/${userId}`);
}

export async function getRoles(): Promise<AdminRole[]> {
    const response =
        await apiClient.get<RolesResponse>("/roles");

    return response.data.data.map((role) => ({
        id: role._id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isSystemRole: role.isSystemRole,
    }));
}

export async function getRole(
    roleId: string,
): Promise<AdminRole> {
    const response =
        await apiClient.get<RoleResponse>(
            `/roles/${roleId}`,
        );

    const role = response.data.data;

    return {
        id: role._id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isSystemRole: role.isSystemRole,
    };
}

export async function createRole(
    request: CreateRoleRequest,
): Promise<AdminRole> {
    const response =
        await apiClient.post<RoleResponse>(
            "/roles",
            request,
        );

    const role = response.data.data;

    return {
        id: role._id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isSystemRole: role.isSystemRole,
    };
}

export async function updateRole(
    roleId: string,
    request: UpdateRoleRequest,
): Promise<AdminRole> {
    const response =
        await apiClient.patch<RoleResponse>(
            `/roles/${roleId}`,
            request,
        );

    const role = response.data.data;

    return {
        id: role._id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isSystemRole: role.isSystemRole,
    };
}