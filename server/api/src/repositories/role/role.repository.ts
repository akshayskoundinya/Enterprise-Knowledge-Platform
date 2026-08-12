import { RoleModel } from "../../models";

async function findById(roleId: string) {
    return RoleModel.findById(roleId);
}

export const roleRepository = {
    findById,
};