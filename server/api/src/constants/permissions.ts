export const Permissions = {
    // User
    USER_CREATE: "user:create",
    USER_READ: "user:read",
    USER_UPDATE: "user:update",
    USER_DELETE: "user:delete",

    // Role
    ROLE_CREATE: "role:create",
    ROLE_READ: "role:read",
    ROLE_UPDATE: "role:update",
    ROLE_DELETE: "role:delete",

    // Document
    DOCUMENT_UPLOAD: "document:upload",
    DOCUMENT_READ: "document:read",
    DOCUMENT_UPDATE: "document:update",
    DOCUMENT_DELETE: "document:delete",

    // Chat
    CHAT_CREATE: "chat:create",
    CHAT_READ: "chat:read",

    // Admin
    ADMIN_DASHBOARD: "admin:dashboard",
} as const;

export type Permission =
    (typeof Permissions)[keyof typeof Permissions];