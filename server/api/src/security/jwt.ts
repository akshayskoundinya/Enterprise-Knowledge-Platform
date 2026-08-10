import jwt from "jsonwebtoken";
import ms from "ms";

import { env } from "../config";
import type { TokenPayload } from "./types";

function generateAccessToken(userId: string): string {
    return jwt.sign(
        {
            sub: userId,
        },
        env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
        }
    );
}

function generateRefreshToken(userId: string): string {
    return jwt.sign(
        {
            sub: userId,
        },
        env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
        }
    );
}

function verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(
        token,
        env.ACCESS_TOKEN_SECRET
    ) as TokenPayload;
}

function verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(
        token,
        env.REFRESH_TOKEN_SECRET
    ) as TokenPayload;
}

function getRefreshTokenExpiresAt(): Date {
    const duration = ms(env.REFRESH_TOKEN_EXPIRES_IN);

    return new Date(Date.now() + duration);
}

export const jwtUtils = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    getRefreshTokenExpiresAt,
};