import type { Permission } from "../../constants";
import { RoleModel } from "../../models";

async function findById(roleId: string) {
    return RoleModel.findById(roleId);
}

async function findAll() {
    return RoleModel.find().sort({ name: 1 });
}

async function findByName(name: string) {
    return RoleModel.findOne({ name });
}

async function create(data: {
    name: string;
    description: string;
    permissions: Permission[];
}) {
    return RoleModel.create(data);
}

async function updateById<T extends object>(
    roleId: string,
    data: T
) {
    return RoleModel.findByIdAndUpdate(
        roleId,
        data,
        {
            new: true,
            runValidators: true,
        }
    );
}

export const roleRepository = {
    findById,
    findAll,
    create,
    updateById,
    findByName,
};