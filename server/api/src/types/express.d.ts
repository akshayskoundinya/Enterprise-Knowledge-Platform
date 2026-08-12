import type { AuthenticatedUser } from "../security";

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

export { };