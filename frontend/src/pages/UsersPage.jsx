import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createUser, deleteUser, fetchUsers, updateUser } from '../services/usersService';
import { useHeader } from '../app/HeaderContext';
import { useTranslation } from 'react-i18next';
import DataTable from '../components/ui/DataTable/DataTable';
import Modal from '../components/ui/Modal/Modal';
import Form from '../components/ui/Form/Form';
import { useMeta } from '../hooks/useMeta';
import { can } from '../utils/permissions';
import { useLoading } from '../contexts/LoadingContext';
import { getCache, isDataDifferent, setCache } from '../utils/cache';

function normalizeRoleNames(roles = []) {
  if (!Array.isArray(roles) || roles.length === 0) {
    return '-';
  }

  return roles.map((role) => (typeof role === 'string' ? role : role.name)).join(', ');
}

/**
 * Users management page.
 *
 * WHY:
 * Combines listing + CRUD modals in one place so we can keep
 * table state (search/sort/pagination) stable while editing data.
 */
function UsersPage() {
  const { setTitle, setIsRefreshing } = useHeader();
  const { t } = useTranslation();
  const { showLoading, hideLoading } = useLoading();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableErrorMessage, setTableErrorMessage] = useState(null);
  const [isRefreshingFromCache, setIsRefreshingFromCache] = useState(false);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState({ key: null, direction: null });
  const tableRef = useRef(null);
  // WHY:
  // StrictMode can trigger effect twice in development.
  // This guard prevents duplicate initial fetches and noisy UI flicker.
  const hasFetched = useRef(false);
  const usersRef = useRef([]);
  const USERS_CACHE_KEY = 'users_table_rows';
  const USERS_CACHE_TTL_MS = 60_000;
  const [modalState, setModalState] = useState({ type: null, user: null });
  const [formValues, setFormValues] = useState({ name: '', email: '', password: '', roles: [], permissions: [], denied_permissions: [] });
  const [formErrors, setFormErrors] = useState({});
  const [formErrorMessage, setFormErrorMessage] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [deniedPermissions, setDeniedPermissions] = useState([]);
  const [manuallyAddedPermissions, setManuallyAddedPermissions] = useState([]);
  const [manuallyRemovedPermissions, setManuallyRemovedPermissions] = useState([]);
  const { meta } = useMeta();
  const roles = meta?.roles || [];
  const permissions = meta?.current_user_permissions || [];
  const availablePermissions = meta?.permissions || [];
  const currentUserId = meta?.current_user?.id ?? null;
  // WHY:
  // Consistent naming improves readability and maintainability across the project.
  // WHY:
  // Keep role assignment policy configurable from one place
  // without changing form component internals.
  const ALLOW_MULTIPLE_ROLES = false;

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useEffect(() => {
    setTitle(t('users'));
  }, [setTitle, t]);

  const loadUsers = useCallback(async (options = {}) => {
    const { keepVisibleData = false } = options;

    try {
      const hasRowsVisible = keepVisibleData || usersRef.current.length > 0;
      // WHY:
      // Keep existing rows visible during background refresh to avoid flicker.
      setIsLoading(!hasRowsVisible);
      setTableErrorMessage(null);
      setIsRefreshing(true);
      if (hasRowsVisible) {
        setIsRefreshingFromCache(true);
      }

      const response = await fetchUsers();

      const payload = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      // WHY:
      // State is only updated when data changes to prevent unnecessary re-renders.
      if (isDataDifferent(usersRef.current, payload)) {
        setUsers(payload);
        usersRef.current = payload;
      }
      setCache(USERS_CACHE_KEY, payload, USERS_CACHE_TTL_MS);
    } catch (err) {
      // WHY:
      // Keep diagnostics in console for developers, but UI must stay localized
      // and avoid exposing backend internals to end users.
      console.error('Users fetch failed', err);
      setTableErrorMessage(t('unexpected_error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsRefreshingFromCache(false);
    }
  }, [setIsRefreshing, t]);

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    hasFetched.current = true;
    const cachedUsers = getCache(USERS_CACHE_KEY);
    if (Array.isArray(cachedUsers) && cachedUsers.length > 0) {
      // WHY:
      // Show cached table rows instantly on page revisit, then refresh in background.
      setUsers(cachedUsers);
      setIsLoading(false);
      setIsRefreshingFromCache(true);
      usersRef.current = cachedUsers;
      loadUsers({ keepVisibleData: true });
      return;
    }

    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) {
      return users;
    }

    const term = search.toLowerCase();
    return users.filter((user) => {
      const roleNames = normalizeRoleNames(user.roles).toLowerCase();
      return (
        String(user.id).includes(term)
        || user.name?.toLowerCase().includes(term)
        || user.email?.toLowerCase().includes(term)
        || roleNames.includes(term)
      );
    });
  }, [users, search]);

  const sortedUsers = useMemo(() => {
    if (!sort.key || !sort.direction) {
      return filteredUsers;
    }

    const sorted = [...filteredUsers].sort((a, b) => {
      const aValue = sort.key === 'roles' ? normalizeRoleNames(a.roles) : a[sort.key];
      const bValue = sort.key === 'roles' ? normalizeRoleNames(b.roles) : b[sort.key];

      const left = (aValue ?? '').toString().toLowerCase();
      const right = (bValue ?? '').toString().toLowerCase();

      if (left < right) return sort.direction === 'asc' ? -1 : 1;
      if (left > right) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredUsers, sort]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedUsers.slice(start, start + perPage);
  }, [sortedUsers, page, perPage]);

  const columns = useMemo(
    () => [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: t('name'), sortable: true },
      { key: 'email', label: t('email'), sortable: true },
      {
        key: 'roles',
        label: t('roles'),
        sortable: true,
        render: (_, row) => normalizeRoleNames(row.roles),
      },
    ],
    [t],
  );

  const rolesPermissionsMap = useMemo(() => {
    // WHY:
    // Role permissions are driven by backend to keep RBAC logic consistent
    // and avoid hardcoded mappings in UI.
    if (meta?.role_permissions && typeof meta.role_permissions === 'object') {
      return meta.role_permissions;
    }

    if (meta?.rolesPermissions && typeof meta.rolesPermissions === 'object') {
      return meta.rolesPermissions;
    }

    if (meta?.roles_permissions && typeof meta.roles_permissions === 'object') {
      return meta.roles_permissions;
    }

    // Fallback for shape where roles include nested permissions.
    if (Array.isArray(meta?.roles)) {
      return meta.roles.reduce((acc, role) => {
        const roleName = role?.name;
        if (!roleName) {
          return acc;
        }

        const permissionNames = Array.isArray(role?.permissions)
          ? role.permissions.map((permission) => (typeof permission === 'string' ? permission : permission?.name)).filter(Boolean)
          : [];

        acc[roleName] = permissionNames;
        return acc;
      }, {});
    }

    return {};
  }, [meta]);

  const getRoleDefaultPermissions = useCallback((roleNames) => {
    const defaultPermissions = roleNames.flatMap((roleName) => rolesPermissionsMap[roleName] || []);
    return [...new Set(defaultPermissions)];
  }, [rolesPermissionsMap]);

  const computeEffectivePermissions = useCallback((roleNames, addedPermissions, removedPermissions, deniedPermissionNames = []) => {
    const roleDefaults = getRoleDefaultPermissions(roleNames);
    const removedSet = new Set(removedPermissions);
    const deniedSet = new Set(deniedPermissionNames);

    const fromRoles = roleDefaults.filter((permissionName) => !removedSet.has(permissionName));

    const merged = [...new Set([...fromRoles, ...addedPermissions])];
    return merged.filter((permissionName) => !deniedSet.has(permissionName));
  }, [getRoleDefaultPermissions]);

  const roleDerivedPermissionsForUi = useMemo(() => (
    getRoleDefaultPermissions(selectedRoles)
      .filter((permissionName) => !manuallyRemovedPermissions.includes(permissionName))
  ), [getRoleDefaultPermissions, manuallyRemovedPermissions, selectedRoles]);
  const isEditingSelf = modalState.type === 'edit'
    && modalState.user
    && Number(modalState.user.id) === Number(currentUserId);

  const formSchema = useMemo(
    () => [
      { name: 'name', label: t('name'), type: 'text', required: true, requiredMessage: t('field_required') },
      { name: 'email', label: t('email'), type: 'email', required: true, requiredMessage: t('field_required') },
      {
        name: 'password',
        label: t('password'),
        type: 'password',
        required: modalState.type === 'create',
        requiredMessage: t('field_required'),
      },
      {
        name: 'roles',
        label: t('roles'),
        type: 'chips',
        multiple: ALLOW_MULTIPLE_ROLES,
        required: true,
        requiredMessage: t('field_required'),
        options: roles.map((role) => ({ value: role.name, label: role.name })),
        // WHY:
        // Security rule: user must not be able to remove own critical permissions.
        // We prevent self-editing of RBAC fields in UI to avoid accidental lockout.
        disabled: isEditingSelf,
      },
      {
        name: 'permissions',
        label: t('permissions'),
        type: 'permissions',
        // WHY:
        // Permissions provide fine-grained access control beyond roles.
        // Roles define groups, permissions define exact capabilities.
        options: availablePermissions.map((permission) => ({
          value: permission.name,
          label: permission.name,
        })),
        roleDerivedPermissions: roleDerivedPermissionsForUi,
        manualPermissions: manuallyAddedPermissions,
        removedPermissions: manuallyRemovedPermissions,
        deniedPermissions,
        disabled: isEditingSelf,
        hidden: availablePermissions.length === 0,
      },
    ],
    [
      roles,
      availablePermissions,
      modalState.type,
      t,
      roleDerivedPermissionsForUi,
      manuallyAddedPermissions,
      manuallyRemovedPermissions,
      deniedPermissions,
      isEditingSelf,
    ],
  );

  const openCreateModal = () => {
    setFormValues({ name: '', email: '', password: '', roles: [], permissions: [], denied_permissions: [] });
    setSelectedRoles([]);
    setSelectedPermissions([]);
    setDeniedPermissions([]);
    setManuallyAddedPermissions([]);
    setManuallyRemovedPermissions([]);
    setFormErrors({});
    setFormErrorMessage(null);
    setModalState({ type: 'create', user: null });
  };

  const openEditModal = useCallback((user) => {
    const roleNamesFromUser = Array.isArray(user.roles)
      ? user.roles
        .map((role) => {
          if (typeof role === 'object' && role?.name) {
            return role.name;
          }

          if (typeof role === 'string') {
            return role;
          }

          return null;
        })
        .filter(Boolean)
      : [];

    const directPermissionNames = Array.isArray(user.permissions)
      ? user.permissions.map((permission) => (typeof permission === 'string' ? permission : permission.name))
      : [];
    const deniedPermissionNames = Array.isArray(user.denied_permissions)
      ? user.denied_permissions.map((permission) => (typeof permission === 'string' ? permission : permission.name))
      : [];

    const roleDefaultPermissions = getRoleDefaultPermissions(roleNamesFromUser);
    const roleDefaultSet = new Set(roleDefaultPermissions);

    // WHY:
    // In edit mode, permissions come from two sources:
    // 1. roles (default)
    // 2. manual overrides
    // We separate them to give clear UX and avoid accidental permission loss.
    // WHY:
    // Denied permissions override both role-based and manually added permissions,
    // giving full control over access restrictions.
    const initialManuallyAdded = directPermissionNames.filter((permissionName) => !roleDefaultSet.has(permissionName));
    const initialManuallyRemoved = [];
    const initialFinalPermissions = computeEffectivePermissions(
      roleNamesFromUser,
      initialManuallyAdded,
      initialManuallyRemoved,
      deniedPermissionNames,
    );

    setFormValues({
      name: user.name || '',
      email: user.email || '',
      password: '',
      roles: roleNamesFromUser,
      permissions: initialFinalPermissions,
      denied_permissions: deniedPermissionNames,
    });
    setSelectedRoles(roleNamesFromUser);
    setSelectedPermissions(initialFinalPermissions);
    setDeniedPermissions(deniedPermissionNames);
    setManuallyAddedPermissions(initialManuallyAdded);
    setManuallyRemovedPermissions(initialManuallyRemoved);
    setFormErrors({});
    setFormErrorMessage(null);
    setModalState({ type: 'edit', user });
  }, [computeEffectivePermissions, getRoleDefaultPermissions]);

  const openDeleteModal = (user) => {
    setModalState({ type: 'delete', user });
  };

  const closeModal = () => {
    setModalState({ type: null, user: null });
    setSelectedRoles([]);
    setSelectedPermissions([]);
    setDeniedPermissions([]);
    setManuallyAddedPermissions([]);
    setManuallyRemovedPermissions([]);
    setFormErrors({});
    setFormErrorMessage(null);
  };

  const handleFormChange = (name, value) => {
    if ((name === 'roles' || name === 'permissions') && isEditingSelf) {
      return;
    }

    if (name === 'roles') {
      const nextRoles = Array.isArray(value) ? value : [];
      setSelectedRoles(nextRoles);

      const nextEffectivePermissions = computeEffectivePermissions(
        nextRoles,
        manuallyAddedPermissions,
        manuallyRemovedPermissions,
        deniedPermissions,
      );

      setSelectedPermissions(nextEffectivePermissions);
      setFormValues((prev) => ({ ...prev, roles: nextRoles, permissions: nextEffectivePermissions, denied_permissions: deniedPermissions }));
      setFormErrors((prev) => ({ ...prev, [name]: null }));
      return;
    }

    if (name === 'permissions') {
      const nextPermissions = Array.isArray(value) ? value : [];
      const roleDefaults = getRoleDefaultPermissions(selectedRoles);
      const roleDefaultsSet = new Set(roleDefaults);
      const previousSelectedSet = new Set(selectedPermissions);
      const deniedSet = new Set(deniedPermissions);

      const manuallyAddedSet = new Set(manuallyAddedPermissions);
      const manuallyRemovedSet = new Set(manuallyRemovedPermissions);

      // WHY:
      // RBAC permissions come from roles but must allow manual override,
      // including removing inherited permissions.
      availablePermissions.forEach((permission) => {
        const permissionName = permission.name;
        const wasSelected = previousSelectedSet.has(permissionName);
        const isSelectedNow = nextPermissions.includes(permissionName);
        const wasDenied = deniedSet.has(permissionName);

        if (wasDenied && !isSelectedNow) {
          return;
        }

        if (wasDenied && isSelectedNow) {
          deniedSet.delete(permissionName);
        }

        if (!wasDenied && wasSelected && !isSelectedNow) {
          deniedSet.add(permissionName);

          if (roleDefaultsSet.has(permissionName)) {
            manuallyRemovedSet.add(permissionName);
          } else {
            manuallyAddedSet.delete(permissionName);
          }
          return;
        }

        if (wasSelected === isSelectedNow && !wasDenied) {
          return;
        }

        if (isSelectedNow) {
          if (roleDefaultsSet.has(permissionName)) {
            manuallyRemovedSet.delete(permissionName);
          } else {
            manuallyAddedSet.add(permissionName);
          }
          return;
        }

        if (roleDefaultsSet.has(permissionName)) {
          manuallyRemovedSet.add(permissionName);
        } else {
          manuallyAddedSet.delete(permissionName);
        }
      });

      const nextManuallyAdded = [...manuallyAddedSet];
      const nextManuallyRemoved = [...manuallyRemovedSet];
      const nextDeniedPermissions = [...deniedSet];
      const nextEffectivePermissions = computeEffectivePermissions(
        selectedRoles,
        nextManuallyAdded,
        nextManuallyRemoved,
        nextDeniedPermissions,
      );

      setDeniedPermissions(nextDeniedPermissions);
      setManuallyAddedPermissions(nextManuallyAdded);
      setManuallyRemovedPermissions(nextManuallyRemoved);
      setSelectedPermissions(nextEffectivePermissions);
      setFormValues((prev) => ({
        ...prev,
        permissions: nextEffectivePermissions,
        denied_permissions: nextDeniedPermissions,
      }));
      setFormErrors((prev) => ({ ...prev, [name]: null }));
      return;
    }

    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const applySubmitError = (submitError) => {
    const errorData = submitError?.response?.data || submitError?.data;
    const errorMap = {
      // Future backend-to-i18n mapping placeholder.
      // 'The email has already been taken.': t('email_taken'),
      // 'The password field is required.': t('password_required'),
    };

    if (errorData?.errors) {
      // WHY:
      // Backend field errors are preserved to keep precise form feedback,
      // while global message stays localized and user-friendly.
      setFormErrors(errorData.errors || {});
      setFormErrorMessage(errorMap[errorData?.message] || t('validation_error'));
      return;
    }

    setFormErrors({});
    setFormErrorMessage(t('unexpected_error'));
  };

  const toPayload = (values) => ({
    name: values.name.trim(),
    email: values.email.trim(),
    ...(values.password ? { password: values.password } : {}),
    // WHY:
    // UI operates on readable role names, but backend contract is role IDs.
    // Mapping stays here so the rest of the form can remain presentation-focused.
    roles: (selectedRoles.length ? selectedRoles : values.roles || [])
      .map((roleName) => roles.find((role) => role.name === roleName)?.id)
      .filter(Boolean)
      .map((roleId) => Number(roleId)),
    permissions: selectedPermissions.length ? selectedPermissions : values.permissions || [],
    denied_permissions: deniedPermissions.length ? deniedPermissions : values.denied_permissions || [],
  });

  const handleSubmitForm = async (values) => {
    setFormErrorMessage(null);
    setFormErrors({});
    const payload = toPayload(values);

    if (modalState.type === 'create') {
      try {
        // WHY:
        // Global loader blocks concurrent interactions while mutation is in-flight.
        showLoading('Creating user...');
        const created = await createUser(payload);
        const user = created?.data || created;
        if (user && user.id) {
          setUsers((prev) => {
            const next = [user, ...prev];
            setCache(USERS_CACHE_KEY, next, USERS_CACHE_TTL_MS);
            return next;
          });
        }
        closeModal();
      } catch (submitError) {
        applySubmitError(submitError);
      } finally {
        hideLoading();
      }
      return;
    }

    if (modalState.type === 'edit' && modalState.user) {
      try {
        // WHY:
        // Update path reuses the same loader pattern for consistent UX expectations.
        showLoading('Updating user...');
        const updated = await updateUser(modalState.user.id, payload);
        const updatedUser = updated?.data || updated;

        setUsers((prev) => {
          const next = prev.map((user) => {
            if (user.id !== modalState.user.id) {
              return user;
            }

            return updatedUser && updatedUser.id ? updatedUser : { ...user, ...payload };
          });
          setCache(USERS_CACHE_KEY, next, USERS_CACHE_TTL_MS);
          return next;
        });
        closeModal();
      } catch (submitError) {
        applySubmitError(submitError);
      } finally {
        hideLoading();
      }
    }
  };

  const handleDelete = async () => {
    if (!modalState.user) {
      return;
    }

    try {
      showLoading('Deleting user...');
      await deleteUser(modalState.user.id);
      setUsers((prev) => {
        const next = prev.filter((user) => user.id !== modalState.user.id);
        setCache(USERS_CACHE_KEY, next, USERS_CACHE_TTL_MS);
        return next;
      });
      closeModal();
    } catch (submitError) {
      const errorData = submitError?.response?.data || submitError?.data;
      if (errorData?.errors) {
        setFormErrors(errorData.errors || {});
        setFormErrorMessage(t('validation_error'));
        return;
      }

      setFormErrorMessage(t('unexpected_error'));
    } finally {
      hideLoading();
    }
  };

  const canCreate = can('users.create', meta);

  const actions = useMemo(
    () => [
      {
        key: 'edit',
        label: `\u270F\uFE0F ${t('edit')}`,
        permission: 'users.edit',
        onClick: openEditModal,
      },
      {
        key: 'delete',
        label: `\u{1F5D1} ${t('delete')}`,
        permission: 'users.delete',
        variant: 'danger',
        onClick: openDeleteModal,
      },
    ],
    [openEditModal, t],
  );

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage);
    requestAnimationFrame(scrollToTable);
  }, []);

  const handlePerPageChange = useCallback((value) => {
    setPerPage(value);
    setPage(1);
    requestAnimationFrame(scrollToTable);
  }, []);

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleSort = useCallback((nextSort) => {
    setSort(nextSort);
    setPage(1);
  }, []);

  return (
    <section ref={tableRef}>
      {isRefreshingFromCache ? (
        <p className="data-table__status-text">{t('table_refreshing_cached')}</p>
      ) : null}

      {canCreate ? (
        <div className="users-page__actions">
          <button type="button" className="form__btn form__btn--primary" onClick={openCreateModal}>
            + {t('create_user')}
          </button>
        </div>
      ) : null}

      <DataTable
        columns={columns}
        data={paginatedUsers}
        loading={isLoading}
        error={tableErrorMessage}
        onRetry={loadUsers}
        total={sortedUsers.length}
        page={page}
        perPage={perPage}
        perPageOptions={[5, 10, 20, 50]}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        onSearch={handleSearch}
        onSort={handleSort}
        sort={sort}
        actions={actions}
        permissions={permissions}
        searchPlaceholder={t('search_users')}
        emptyMessage={t('no_users')}
      />

      <Modal
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'edit' ? t('edit_user') : t('create_user')}
        onClose={closeModal}
      >
        {formErrorMessage ? (
          <div className="form-error-global">{formErrorMessage}</div>
        ) : null}

        <Form
          schema={formSchema}
          values={formValues}
          errors={formErrors}
          setErrors={setFormErrors}
          onChange={handleFormChange}
          onSubmit={handleSubmitForm}
          onCancel={closeModal}
          submitLabel={modalState.type === 'edit' ? t('save_changes') : t('create')}
          cancelLabel={t('cancel')}
        />
      </Modal>

      <Modal
        isOpen={modalState.type === 'delete'}
        title={t('delete_user')}
        onClose={closeModal}
        footer={
          <div className="form__actions">
            <button type="button" className="form__btn form__btn--secondary" onClick={closeModal}>
              {t('cancel')}
            </button>
            <button type="button" className="form__btn form__btn--danger" onClick={handleDelete}>
              {'\u{1F5D1} '} {t('delete')}
            </button>
          </div>
        }
      >
        <div className="modal__confirm">
          <p className="modal__confirm-text">
            {t('confirm_delete_user')}: <strong>{modalState.user?.name}</strong>?
          </p>
        </div>
      </Modal>
    </section>
  );
}

export default UsersPage;
