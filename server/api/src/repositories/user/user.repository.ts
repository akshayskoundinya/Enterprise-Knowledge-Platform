import { UserModel } from "../../models";

async function findByEmail(email: string) {
    return UserModel.findOne({ email }).populate("roleId");
}

async function findById(id: string) {
    return UserModel.findById(id).populate("roleId");
}

async function create(user: Parameters<typeof UserModel.create>[0]) {
    return UserModel.create(user);
}

export const userRepository = {
    findByEmail,
    findById,
    create,
};