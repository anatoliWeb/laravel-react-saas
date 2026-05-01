export function can(permission, meta) {
  const permissions = meta?.current_user_permissions;

  if (!Array.isArray(permissions) || permissions.length === 0) {
    return false;
  }

  return permissions.includes(permission);
}
