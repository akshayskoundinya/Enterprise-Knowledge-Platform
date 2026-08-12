import { UserModel } from "../../models";

async function findByEmail(email: string) {
    return UserModel.findOne({ email });
}

async function findById(userId: string) {
    return UserModel.findById(userId);
}

async function create(user: Parameters<typeof UserModel.create>[0]) {
    return UserModel.create(user);
}

export const userRepository = {
    findByEmail,
    findById,
    create,
};