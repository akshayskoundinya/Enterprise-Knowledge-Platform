import { userRepository } from "../../repositories";
import { roleRepository } from "../../repositories";
import { hashPassword } from "../../security/password";
import { createAppError } from "../../errors";
import type {
    CreateUserInput,
    UpdateUserInput,
} from "../../validators/user.validator";

export async function createUser(
    input: CreateUserInput
) {
    const existingUser = await userRepository.findByEmail(
        input.email
    );

    if (existingUser) {
        throw createAppError(
            "A user with this email already exists",
            409,
            "USER_ALREADY_EXISTS"
        );
    }

    const role = await roleRepository.findById(input.roleId);

    if (!role) {
        throw createAppError(
            "Role not found",
            404,
            "ROLE_NOT_FOUND"
        );
    }

    const passwordHash = await hashPassword(input.password);

    return userRepository.create({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        passwordHash,
        roleId: input.roleId,
    });
}

export async function getUsers() {
    return userRepository.findAll();
}

export async function getUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw createAppError(
            "User not found",
            404,
            "USER_NOT_FOUND"
        );
    }

    return user;
}

export async function updateUser(
    userId: string,
    input: UpdateUserInput
) {
    const existingUser = await userRepository.findById(userId);

    if (!existingUser) {
        throw createAppError(
            "User not found",
            404,
            "USER_NOT_FOUND"
        );
    }

    if (input.email && input.email !== existingUser.email) {
        const emailExists = await userRepository.findByEmail(
            input.email
        );

        if (emailExists) {
            throw createAppError(
                "A user with this email already exists",
                409,
                "USER_ALREADY_EXISTS"
            );
        }
    }

    if (input.roleId) {
        const role = await roleRepository.findById(
            input.roleId
        );

        if (!role) {
            throw createAppError(
                "Role not found",
                404,
                "ROLE_NOT_FOUND"
            );
        }
    }

    const updatedUser = await userRepository.updateById(
        userId,
        input
    );

    if (!updatedUser) {
        throw createAppError(
            "User not found",
            404,
            "USER_NOT_FOUND"
        );
    }

    return updatedUser;
}

export async function deactivateUser(
    userId: string
) {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw createAppError(
            "User not found",
            404,
            "USER_NOT_FOUND"
        );
    }

    return userRepository.deactivate(userId);
}