export type UserStatus =
    | "ACTIVE"
    | "INACTIVE";

export interface AdminUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface UsersResponse {
    data: AdminUser[];
}

export interface UserResponse {
    data: AdminUser;
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: string;
}

export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    roleId?: string;
    status?: UserStatus;
}

export interface AdminRole {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    isSystemRole: boolean;
}

export interface AdminRoleApiResponse {
    _id: string;
    name: string;
    description: string;
    permissions: string[];
    isSystemRole: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface RolesResponse {
    data: AdminRoleApiResponse[];
}

export interface RoleResponse {
    data: AdminRoleApiResponse;
}

export interface CreateRoleRequest {
    name: string;
    description: string;
    permissions: string[];
}

export interface UpdateRoleRequest {
    name?: string;
    description?: string;
    permissions?: string[];
}
