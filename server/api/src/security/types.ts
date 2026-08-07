import jwt from "jsonwebtoken";
import { env } from "../config";

export interface TokenPayload {
    sub: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface AuthenticatedUser {
    id: string;
    roleId: string;
}

function verifyAccessToken(
    token: string
): TokenPayload {
    return jwt.verify(
        token,
        env.ACCESS_TOKEN_SECRET
    ) as TokenPayload;
}