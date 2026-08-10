import {
    invalidCredentialsError,
    inactiveAccountError,
    invalidRefreshTokenError,
} from "../../errors";
import {
    refreshTokenRepository,
    userRepository,
} from "../../repositories";

import {
    comparePassword,
    hashToken,
    jwtUtils,
} from "../../security";

import type { TokenPair, TokenPayload } from "../../security";

interface LoginInput {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
}

export async function login(
    input: LoginInput
): Promise<TokenPair> {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
        throw invalidCredentialsError();
    }

    if (user.status !== "ACTIVE") {
        throw inactiveAccountError();
    }

    const passwordMatches = await comparePassword(
        input.password,
        user.passwordHash
    );

    if (!passwordMatches) {
        throw invalidCredentialsError();
    }

    const userId = user._id.toString();

    const accessToken = jwtUtils.generateAccessToken(userId);

    const refreshToken = jwtUtils.generateRefreshToken(userId);

    const tokenHash = hashToken(refreshToken);

    const expiresAt = jwtUtils.getRefreshTokenExpiresAt();

    await refreshTokenRepository.create({
        userId,
        tokenHash,
        expiresAt,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
    });

    return {
        accessToken,
        refreshToken,
    };
}

export async function refresh(
    refreshToken: string
): Promise<TokenPair> {
    let payload: TokenPayload;

    try {
        payload = jwtUtils.verifyRefreshToken(refreshToken);
    } catch {
        throw invalidCredentialsError();
    }

    if (!payload.sub) {
        throw invalidCredentialsError();
    }

    const tokenHash = hashToken(refreshToken);

    const storedToken =
        await refreshTokenRepository.findActiveByHash(tokenHash);

    if (!storedToken) {
        throw invalidRefreshTokenError();
    }

    const user = await userRepository.findById(payload.sub);

    if (!user) {
        throw invalidRefreshTokenError();
    }

    if (user.status !== "ACTIVE") {
        throw inactiveAccountError();
    }

    /*
     * Revoke the old refresh token before issuing
     * the replacement token.
     */
    await refreshTokenRepository.revoke(tokenHash);

    const userId = user._id.toString();

    const newAccessToken =
        jwtUtils.generateAccessToken(userId);

    const newRefreshToken =
        jwtUtils.generateRefreshToken(userId);

    const newTokenHash = hashToken(newRefreshToken);

    const expiresAt =
        jwtUtils.getRefreshTokenExpiresAt();

    await refreshTokenRepository.create({
        userId,
        tokenHash: newTokenHash,
        expiresAt,
        ipAddress: storedToken.ipAddress ?? undefined,
        userAgent: storedToken.userAgent ?? undefined,
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
}