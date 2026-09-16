import { useEffect, useMemo, useState } from "react";
import type { SubmitEvent } from "react";

import {
    createRole,
    createUser,
    deactivateUser,
    getRoles,
    getUsers,
    updateRole,
    updateUser,
} from "@/features/admin";

import type {
    AdminRole,
    AdminUser,
    CreateRoleRequest,
    CreateUserRequest,
    UpdateRoleRequest,
    UpdateUserRequest,
} from "@/features/admin";

const permissionGroups = [
    {
        label: "Users",
        permissions: [
            ["user:create", "Create users"],
            ["user:read", "Read users"],
            ["user:update", "Update users"],
            ["user:delete", "Delete users"],
        ],
    },
    {
        label: "Roles",
        permissions: [
            ["role:create", "Create roles"],
            ["role:read", "Read roles"],
            ["role:update", "Update roles"],
            ["role:delete", "Delete roles"],
        ],
    },
    {
        label: "Documents",
        permissions: [
            ["document:upload", "Upload documents"],
            ["document:read", "Read documents"],
            ["document:read:all", "Read all documents"],
            ["document:update", "Update documents"],
            ["document:delete", "Delete documents"],
        ],
    },
    {
        label: "Chat",
        permissions: [
            ["chat:create", "Create chat"],
            ["chat:read", "Read chat"],
        ],
    },
    {
        label: "Administration",
        permissions: [
            ["admin:dashboard", "Admin dashboard"],
        ],
    },
] as const;

function AdminPage() {
    const [activeTab, setActiveTab] =
        useState<"users" | "roles">("users");

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [roles, setRoles] = useState<AdminRole[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] =
        useState<string | null>(null);

    const [showUserForm, setShowUserForm] =
        useState(false);

    const [showRoleForm, setShowRoleForm] =
        useState(false);

    const [editingUser, setEditingUser] =
        useState<AdminUser | null>(null);

    const [editingRole, setEditingRole] =
        useState<AdminRole | null>(null);

    // async function loadAdminData() {
    //     setIsLoading(true);
    //     setError(null);

    //     try {
    //         const [usersData, rolesData] =
    //             await Promise.all([
    //                 getUsers(),
    //                 getRoles(),
    //             ]);

    //         setUsers(usersData);
    //         setRoles(rolesData);
    //     } catch {
    //         setError(
    //             "Unable to load administration data.",
    //         );
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    useEffect(() => {
        async function load() {
            try {
                setIsLoading(true);
                setError(null);

                const [usersData, rolesData] = await Promise.all([
                    getUsers(),
                    getRoles(),
                ]);

                setUsers(usersData);
                setRoles(rolesData);
            } catch {
                setError("Unable to load admin data.");
            } finally {
                setIsLoading(false);
            }
        }

        void load();
    }, []);

    const roleMap = useMemo(
        () =>
            new Map(
                roles.map((role) => [
                    role.id,
                    role.name,
                ]),
            ),
        [roles],
    );

    async function handleCreateUser(
        request: CreateUserRequest,
    ) {
        const user = await createUser(request);

        setUsers((currentUsers) => [
            user,
            ...currentUsers,
        ]);

        setShowUserForm(false);
    }

    async function handleUpdateUser(
        userId: string,
        request: UpdateUserRequest,
    ) {
        const user = await updateUser(
            userId,
            request,
        );

        setUsers((currentUsers) =>
            currentUsers.map((currentUser) =>
                currentUser.id === user.id
                    ? user
                    : currentUser,
            ),
        );

        setEditingUser(null);
    }

    async function handleDeactivateUser(
        user: AdminUser,
    ) {
        const confirmed = window.confirm(
            `Deactivate ${user.firstName} ${user.lastName}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            await deactivateUser(user.id);

            setUsers((currentUsers) =>
                currentUsers.map((currentUser) =>
                    currentUser.id === user.id
                        ? {
                            ...currentUser,
                            status: "INACTIVE",
                        }
                        : currentUser,
                ),
            );
        } catch {
            setError(
                "Unable to deactivate the user.",
            );
        }
    }

    async function handleCreateRole(
        request: CreateRoleRequest,
    ) {
        const role = await createRole(request);

        setRoles((currentRoles) => [
            ...currentRoles,
            role,
        ]);

        setShowRoleForm(false);
    }

    async function handleUpdateRole(
        roleId: string,
        request: UpdateRoleRequest,
    ) {
        const role = await updateRole(
            roleId,
            request,
        );

        setRoles((currentRoles) =>
            currentRoles.map((currentRole) =>
                currentRole.id === role.id
                    ? role
                    : currentRole,
            ),
        );

        setEditingRole(null);
    }

    return (
        <main className="page admin-page">
            <header className="page-header">
                <h1>Administration</h1>
                <p>
                    Manage users, roles, and permissions.
                </p>
            </header>

            {error && (
                <div
                    className="admin-alert"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <div className="admin-tabs">
                <button
                    type="button"
                    className={
                        activeTab === "users"
                            ? "admin-tab admin-tab--active"
                            : "admin-tab"
                    }
                    onClick={() =>
                        setActiveTab("users")
                    }
                >
                    Users
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "roles"
                            ? "admin-tab admin-tab--active"
                            : "admin-tab"
                    }
                    onClick={() =>
                        setActiveTab("roles")
                    }
                >
                    Roles
                </button>
            </div>

            {activeTab === "users" ? (
                <UsersSection
                    users={users}
                    roleMap={roleMap}
                    isLoading={isLoading}
                    onCreate={() =>
                        setShowUserForm(true)
                    }
                    onEdit={setEditingUser}
                    onDeactivate={
                        handleDeactivateUser
                    }
                />
            ) : (
                <RolesSection
                    roles={roles}
                    isLoading={isLoading}
                    onCreate={() =>
                        setShowRoleForm(true)
                    }
                    onEdit={setEditingRole}
                />
            )}

            {showUserForm && (
                <UserForm
                    roles={roles}
                    onSubmit={handleCreateUser}
                    onClose={() =>
                        setShowUserForm(false)
                    }
                />
            )}

            {editingUser && (
                <UserEditForm
                    user={editingUser}
                    roles={roles}
                    onSubmit={handleUpdateUser}
                    onClose={() =>
                        setEditingUser(null)
                    }
                />
            )}

            {showRoleForm && (
                <RoleForm
                    onSubmit={handleCreateRole}
                    onClose={() =>
                        setShowRoleForm(false)
                    }
                />
            )}

            {editingRole && (
                <RoleEditForm
                    role={editingRole}
                    onSubmit={handleUpdateRole}
                    onClose={() =>
                        setEditingRole(null)
                    }
                />
            )}
        </main>
    );
}

interface UsersSectionProps {
    users: AdminUser[];
    roleMap: Map<string, string>;
    isLoading: boolean;
    onCreate: () => void;
    onEdit: (user: AdminUser) => void;
    onDeactivate: (user: AdminUser) => void;
}

function UsersSection({
    users,
    roleMap,
    isLoading,
    onCreate,
    onEdit,
    onDeactivate,
}: UsersSectionProps) {
    return (
        <section className="card admin-section">
            <div className="admin-section__header">
                <div>
                    <h2>Users</h2>
                    <p>
                        Manage user accounts and roles.
                    </p>
                </div>

                <button
                    type="button"
                    className="button button--primary"
                    onClick={onCreate}
                >
                    Create user
                </button>
            </div>

            {isLoading ? (
                <p className="admin-empty">
                    Loading users...
                </p>
            ) : users.length === 0 ? (
                <p className="admin-empty">
                    No users found.
                </p>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th />
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        {user.firstName}{" "}
                                        {user.lastName}
                                    </td>

                                    <td>
                                        {user.email}
                                    </td>

                                    <td>
                                        {roleMap.get(
                                            user.roleId,
                                        ) ?? "Unknown"}
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                user.status ===
                                                    "ACTIVE"
                                                    ? "status-badge status-badge--ready"
                                                    : "status-badge status-badge--failed"
                                            }
                                        >
                                            {user.status}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="admin-table__actions">
                                            <button
                                                type="button"
                                                className="button button--secondary"
                                                onClick={() =>
                                                    onEdit(
                                                        user,
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            {user.status ===
                                                "ACTIVE" && (
                                                    <button
                                                        type="button"
                                                        className="button button--danger"
                                                        onClick={() =>
                                                            onDeactivate(
                                                                user,
                                                            )
                                                        }
                                                    >
                                                        Deactivate
                                                    </button>
                                                )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

interface RolesSectionProps {
    roles: AdminRole[];
    isLoading: boolean;
    onCreate: () => void;
    onEdit: (role: AdminRole) => void;
}

function RolesSection({
    roles,
    isLoading,
    onCreate,
    onEdit,
}: RolesSectionProps) {
    return (
        <section className="card admin-section">
            <div className="admin-section__header">
                <div>
                    <h2>Roles</h2>
                    <p>
                        Manage roles and their permissions.
                    </p>
                </div>

                <button
                    type="button"
                    className="button button--primary"
                    onClick={onCreate}
                >
                    Create role
                </button>
            </div>

            {isLoading ? (
                <p className="admin-empty">
                    Loading roles...
                </p>
            ) : roles.length === 0 ? (
                <p className="admin-empty">
                    No roles found.
                </p>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Permissions</th>
                                <th>Type</th>
                                <th />
                            </tr>
                        </thead>

                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.id}>
                                    <td>
                                        <strong>
                                            {role.name}
                                        </strong>
                                    </td>

                                    <td>
                                        {role.description}
                                    </td>

                                    <td>
                                        {
                                            role.permissions
                                                .length
                                        }
                                    </td>

                                    <td>
                                        {role.isSystemRole
                                            ? "System"
                                            : "Custom"}
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="button button--secondary"
                                            onClick={() =>
                                                onEdit(
                                                    role,
                                                )
                                            }
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

interface UserFormProps {
    roles: AdminRole[];
    onSubmit: (
        request: CreateUserRequest,
    ) => Promise<void>;
    onClose: () => void;
}

function UserForm({
    roles,
    onSubmit,
    onClose,
}: UserFormProps) {
    const [form, setForm] =
        useState<CreateUserRequest>({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            roleId: roles[0]?.id ?? "",
        });

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError(null);
        setIsSaving(true);

        try {
            await onSubmit(form);
        } catch {
            setError(
                "Unable to create the user.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Modal
            title="Create user"
            onClose={onClose}
        >
            <form
                className="admin-form"
                onSubmit={handleSubmit}
            >
                <input
                    className="input"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            firstName:
                                event.target.value,
                        })
                    }
                    required
                />

                <input
                    className="input"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            lastName:
                                event.target.value,
                        })
                    }
                    required
                />

                <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            email:
                                event.target.value,
                        })
                    }
                    required
                />

                <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            password:
                                event.target.value,
                        })
                    }
                    minLength={8}
                    required
                />

                <select
                    className="select"
                    value={form.roleId}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            roleId:
                                event.target.value,
                        })
                    }
                    required
                >
                    {roles.map((role) => (
                        <option
                            key={role.id}
                            value={role.id}
                        >
                            {role.name}
                        </option>
                    ))}
                </select>

                {error && (
                    <p
                        className="admin-form__error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <FormActions
                    isSaving={isSaving}
                    submitLabel="Create user"
                    onClose={onClose}
                />
            </form>
        </Modal>
    );
}

interface UserEditFormProps {
    user: AdminUser;
    roles: AdminRole[];
    onSubmit: (
        userId: string,
        request: UpdateUserRequest,
    ) => Promise<void>;
    onClose: () => void;
}

function UserEditForm({
    user,
    roles,
    onSubmit,
    onClose,
}: UserEditFormProps) {
    const [form, setForm] =
        useState<UpdateUserRequest>({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roleId: user.roleId,
            status: user.status,
        });

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError(null);
        setIsSaving(true);

        try {
            await onSubmit(user.id, form);
        } catch {
            setError(
                "Unable to update the user.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Modal
            title="Edit user"
            onClose={onClose}
        >
            <form
                className="admin-form"
                onSubmit={handleSubmit}
            >
                <input
                    className="input"
                    value={form.firstName ?? ""}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            firstName:
                                event.target.value,
                        })
                    }
                    required
                />

                <input
                    className="input"
                    value={form.lastName ?? ""}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            lastName:
                                event.target.value,
                        })
                    }
                    required
                />

                <input
                    className="input"
                    type="email"
                    value={form.email ?? ""}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            email:
                                event.target.value,
                        })
                    }
                    required
                />

                <select
                    className="select"
                    value={form.roleId ?? ""}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            roleId:
                                event.target.value,
                        })
                    }
                    required
                >
                    {roles.map((role) => (
                        <option
                            key={role.id}
                            value={role.id}
                        >
                            {role.name}
                        </option>
                    ))}
                </select>

                <select
                    className="select"
                    value={form.status ?? "ACTIVE"}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            status:
                                event.target.value as
                                | "ACTIVE"
                                | "INACTIVE",
                        })
                    }
                >
                    <option value="ACTIVE">
                        Active
                    </option>
                    <option value="INACTIVE">
                        Inactive
                    </option>
                </select>

                {error && (
                    <p
                        className="admin-form__error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <FormActions
                    isSaving={isSaving}
                    submitLabel="Save changes"
                    onClose={onClose}
                />
            </form>
        </Modal>
    );
}

interface RoleFormProps {
    onSubmit: (
        request: CreateRoleRequest,
    ) => Promise<void>;
    onClose: () => void;
}

function RoleForm({
    onSubmit,
    onClose,
}: RoleFormProps) {
    const [form, setForm] =
        useState<CreateRoleRequest>({
            name: "",
            description: "",
            permissions: [],
        });

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (form.permissions.length === 0) {
            setError(
                "Select at least one permission.",
            );
            return;
        }

        setError(null);
        setIsSaving(true);

        try {
            await onSubmit(form);
        } catch {
            setError(
                "Unable to create the role.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    function togglePermission(
        permission: string,
    ) {
        setForm((currentForm) => ({
            ...currentForm,
            permissions:
                currentForm.permissions.includes(
                    permission,
                )
                    ? currentForm.permissions.filter(
                        (item) =>
                            item !== permission,
                    )
                    : [
                        ...currentForm.permissions,
                        permission,
                    ],
        }));
    }

    return (
        <Modal
            title="Create role"
            onClose={onClose}
        >
            <form
                className="admin-form"
                onSubmit={handleSubmit}
            >
                <input
                    className="input"
                    placeholder="Role name"
                    value={form.name}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            name:
                                event.target.value,
                        })
                    }
                    required
                />

                <textarea
                    className="textarea"
                    placeholder="Description"
                    value={form.description}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            description:
                                event.target.value,
                        })
                    }
                    required
                />

                <PermissionSelector
                    selected={form.permissions}
                    onToggle={togglePermission}
                />

                {error && (
                    <p
                        className="admin-form__error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <FormActions
                    isSaving={isSaving}
                    submitLabel="Create role"
                    onClose={onClose}
                />
            </form>
        </Modal>
    );
}

interface RoleEditFormProps {
    role: AdminRole;
    onSubmit: (
        roleId: string,
        request: UpdateRoleRequest,
    ) => Promise<void>;
    onClose: () => void;
}

function RoleEditForm({
    role,
    onSubmit,
    onClose,
}: RoleEditFormProps) {
    const [form, setForm] =
        useState<UpdateRoleRequest>({
            name: role.name,
            description: role.description,
            permissions: role.permissions,
        });

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (
            !form.permissions ||
            form.permissions.length === 0
        ) {
            setError(
                "Select at least one permission.",
            );
            return;
        }

        setError(null);
        setIsSaving(true);

        try {
            await onSubmit(role.id, form);
        } catch {
            setError(
                "Unable to update the role.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    function togglePermission(
        permission: string,
    ) {
        setForm((currentForm) => {
            const permissions =
                currentForm.permissions ?? [];

            return {
                ...currentForm,
                permissions:
                    permissions.includes(
                        permission,
                    )
                        ? permissions.filter(
                            (item) =>
                                item !==
                                permission,
                        )
                        : [
                            ...permissions,
                            permission,
                        ],
            };
        });
    }

    return (
        <Modal
            title={`Edit ${role.name}`}
            onClose={onClose}
        >
            <form
                className="admin-form"
                onSubmit={handleSubmit}
            >
                <input
                    className="input"
                    value={form.name ?? ""}
                    disabled={role.isSystemRole}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            name:
                                event.target.value,
                        })
                    }
                    required
                />

                <textarea
                    className="textarea"
                    value={form.description ?? ""}
                    onChange={(event) =>
                        setForm({
                            ...form,
                            description:
                                event.target.value,
                        })
                    }
                    required
                />

                <PermissionSelector
                    selected={
                        form.permissions ?? []
                    }
                    onToggle={togglePermission}
                />

                {role.isSystemRole && (
                    <p className="admin-form__hint">
                        This is a system role. Its name
                        cannot be changed.
                    </p>
                )}

                {error && (
                    <p
                        className="admin-form__error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <FormActions
                    isSaving={isSaving}
                    submitLabel="Save changes"
                    onClose={onClose}
                />
            </form>
        </Modal>
    );
}

interface PermissionSelectorProps {
    selected: string[];
    onToggle: (permission: string) => void;
}

function PermissionSelector({
    selected,
    onToggle,
}: PermissionSelectorProps) {
    return (
        <div className="permission-selector">
            <h3>Permissions</h3>

            {permissionGroups.map((group) => (
                <fieldset
                    className="permission-group"
                    key={group.label}
                >
                    <legend>{group.label}</legend>

                    {group.permissions.map(
                        ([value, label]) => (
                            <label
                                className="permission-item"
                                key={value}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(
                                        value,
                                    )}
                                    onChange={() =>
                                        onToggle(
                                            value,
                                        )
                                    }
                                />

                                <span>{label}</span>
                            </label>
                        ),
                    )}
                </fieldset>
            ))}
        </div>
    );
}

interface FormActionsProps {
    isSaving: boolean;
    submitLabel: string;
    onClose: () => void;
}

function FormActions({
    isSaving,
    submitLabel,
    onClose,
}: FormActionsProps) {
    return (
        <div className="admin-form__actions">
            <button
                type="button"
                className="button button--secondary"
                onClick={onClose}
                disabled={isSaving}
            >
                Cancel
            </button>

            <button
                type="submit"
                className="button button--primary"
                disabled={isSaving}
            >
                {isSaving
                    ? "Saving..."
                    : submitLabel}
            </button>
        </div>
    );
}

interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

function Modal({
    title,
    onClose,
    children,
}: ModalProps) {
    return (
        <div className="modal-backdrop">
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="modal__header">
                    <h2 id="modal-title">
                        {title}
                    </h2>

                    <button
                        type="button"
                        className="modal__close"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="modal__body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AdminPage;