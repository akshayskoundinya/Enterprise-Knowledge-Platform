import { UserModel } from "../../models";

async function findById(userId: string) {
    return UserModel.findById(userId);
}

async function findByEmail(email: string) {
    return UserModel.findOne({ email });
}

async function findAll() {
    return UserModel.find().sort({ createdAt: -1 });
}

async function create(data: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    roleId: string;
}) {
    return UserModel.create(data);
}

async function updateById<T extends object>(
    userId: string,
    data: T
) {
    return UserModel.findByIdAndUpdate(
        userId,
        data,
        {
            new: true,
            runValidators: true,
        }
    );
}

async function deactivate(userId: string) {
    return UserModel.findByIdAndUpdate(
        userId,
        {
            $set: {
                status: "INACTIVE",
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );
}

export const userRepository = {
    findById,
    findByEmail,
    findAll,
    create,
    updateById,
    deactivate,
};