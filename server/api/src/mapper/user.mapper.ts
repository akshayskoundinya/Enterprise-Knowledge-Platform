import type { UserDocument } from "../models";

export function toUserResponse(user: UserDocument) {
    return {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId.toString(),
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}