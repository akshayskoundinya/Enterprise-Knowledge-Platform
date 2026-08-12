import { RefreshTokenModel } from "../../models";
import { CreateRefreshTokenInput } from "./types";

async function create(data: CreateRefreshTokenInput) {
    return RefreshTokenModel.create(data);
}

async function findByHash(tokenHash: string) {
    return RefreshTokenModel.findOne({
        tokenHash,
        revokedAt: null,
    });
}

async function findActiveByHash(tokenHash: string) {
    return RefreshTokenModel.findOne({
        tokenHash,
        revokedAt: null,
        expiresAt: {
            $gt: new Date(),
        },
    });
}

async function updateLastUsed(tokenHash: string) {
    return RefreshTokenModel.updateOne(
        {
            tokenHash,
        },
        {
            lastUsedAt: new Date(),
        }
    );
}

async function revoke(tokenHash: string) {
    return RefreshTokenModel.updateOne(
        {
            tokenHash,
        },
        {
            $set: {
                revokedAt: new Date(),
            },
        }
    );
}

async function revokeAllForUser(userId: string) {

    await RefreshTokenModel.updateMany(
        {
            userId,
            revokedAt: null,
        },
        {
            $set: {
                revokedAt: new Date(),
            },
        }
    );

}

export const refreshTokenRepository = {
    create,
    findActiveByHash,
    revoke,
    revokeAllForUser,
};