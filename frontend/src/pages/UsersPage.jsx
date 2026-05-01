import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createUser, deleteUser, fetchUsers, updateUser } from '../services/usersService';
import { useHeader } from '../app/HeaderContext';
import { useTranslation } from 'react-i18next';
import DataTable from '../components/ui/DataTable/DataTable';
import Modal from '../components/ui/Modal/Modal';
import Form from '../components/ui/Form/Form';
import { useMeta } from '../hooks/useMeta';
import { can } from '../utils/permissions';

function normalizeRoleNames(roles = []) {
  if (!Array.isArray(roles) || roles.length === 0) {
    return '-';
  }

  return roles.map((role) => (typeof role === 'string' ? role : role.name)).join(', ');
}

function mapRoleIdsToObjects(roleIds, availableRoles) {
  return (roleIds || [])
    .map((roleId) => availableRoles.find((role) => Number(role.id) === Number(roleId)))
    .filter(Boolean)
    .map((role) => ({ id: role.id, name: role.name }));
}

function UsersPage() {
  const { setTitle, setIsRefreshing } = useHeader();
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState({ key: null, direction: null });
  const tableRef = useRef(null);
  const hasFetched = useRef(false);
  const [modalState, setModalState] = useState({ type: null, user: null });
  const [formValues, setFormValues] = useState({ name: '', email: '', roles: [], permissions: [] });
  const [formErrors, setFormErrors] = useState({});
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const { meta } = useMeta();
  const roles = meta?.roles || [];
  const permissions = meta?.current_user_permissions || [];
  const availablePermissions = meta?.permissions || [];
  const ALLOW_MULTIPLE_ROLES = false;

  useEffect(() => {
    setTitle(t('users'));
  }, [setTitle, t]);

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    hasFetched.current = true;

    async function loadUsers() {
      try {
        setIsRefreshing(true);

        const response = await fetchUsers();

        const payload = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        setUsers(payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    }

    loadUsers();
  }, [setIsRefreshing]);

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

  const formSchema = useMemo(
    () => [
      { name: 'name', label: t('name'), type: 'text', required: true, requiredMessage: t('field_required') },
      { name: 'email', label: t('email'), type: 'email', required: true, requiredMessage: t('field_required') },
      {
        name: 'roles',
        label: t('roles'),
        type: 'chips',
        multiple: ALLOW_MULTIPLE_ROLES,
        required: true,
        requiredMessage: t('field_required'),
        options: roles.map((role) => ({ value: role.name, label: role.name })),
      },
      {
        name: 'permissions',
        label: t('permissions'),
        type: 'permissions',
        options: availablePermissions.map((permission) => ({
          value: permission.name,
          label: permission.name,
        })),
        hidden: !can('users.edit_permissions', meta),
      },
    ],
    [roles, availablePermissions, meta, t],
  );

  const openCreateModal = () => {
    setFormValues({ name: '', email: '', roles: [], permissions: [] });
    setSelectedRoles([]);
    setSelectedPermissions([]);
    setFormErrors({});
    setModalState({ type: 'create', user: null });
  };

  const openEditModal = (user) => {
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

    setFormValues({
      name: user.name || '',
      email: user.email || '',
      roles: roleNamesFromUser,
      permissions: directPermissionNames,
    });
    setSelectedRoles(roleNamesFromUser);
    setSelectedPermissions(directPermissionNames);
    setFormErrors({});
    setModalState({ type: 'edit', user });
  };

  const openDeleteModal = (user) => {
    setModalState({ type: 'delete', user });
  };

  const closeModal = () => {
    setModalState({ type: null, user: null });
    setSelectedRoles([]);
    setSelectedPermissions([]);
    setFormErrors({});
  };

  const handleFormChange = (name, value) => {
    if (name === 'roles') {
      setSelectedRoles(value);
    }

    if (name === 'permissions') {
      setSelectedPermissions(value);
    }

    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const toPayload = (values) => ({
    name: values.name.trim(),
    email: values.email.trim(),
    roles: (selectedRoles.length ? selectedRoles : values.roles || [])
      .map((roleName) => roles.find((role) => role.name === roleName)?.id)
      .filter(Boolean)
      .map((roleId) => Number(roleId)),
    permissions: selectedPermissions.length ? selectedPermissions : values.permissions || [],
  });

  const handleSubmitForm = async (values) => {
    const payload = toPayload(values);

    if (modalState.type === 'create') {
      try {
        const created = await createUser(payload);
        const user = created?.data || created;
        if (user && user.id) {
          setUsers((prev) => [user, ...prev]);
        }
      } catch (submitError) {
        const nextId = users.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1;
        setUsers((prev) => [{
          id: nextId,
          ...payload,
          roles: mapRoleIdsToObjects(payload.roles, roles),
        }, ...prev]);
      }
      closeModal();
      return;
    }

    if (modalState.type === 'edit' && modalState.user) {
      try {
        const updated = await updateUser(modalState.user.id, payload);
        const updatedUser = updated?.data || updated;

        setUsers((prev) => prev.map((user) => {
          if (user.id !== modalState.user.id) {
            return user;
          }

          return updatedUser && updatedUser.id ? updatedUser : { ...user, ...payload };
        }));
      } catch (submitError) {
        setUsers((prev) => prev.map((user) => {
          if (user.id !== modalState.user.id) {
            return user;
          }

          return {
            ...user,
            ...payload,
            roles: mapRoleIdsToObjects(payload.roles, roles),
          };
        }));
      }
      closeModal();
    }
  };

  const handleDelete = async () => {
    if (!modalState.user) {
      return;
    }

    try {
      await deleteUser(modalState.user.id);
    } catch (submitError) {
      // Keep optimistic UI behavior in local-only mode.
    }

    setUsers((prev) => prev.filter((user) => user.id !== modalState.user.id));
    closeModal();
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
    [t],
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
      {canCreate ? (
        <div className="users-page__actions">
          <button type="button" className="form__btn form__btn--primary" onClick={openCreateModal}>
            + {t('create_user')}
          </button>
        </div>
      ) : null}

      {error ? <p className="error-message">{error}</p> : null}

      <DataTable
        columns={columns}
        data={paginatedUsers}
        loading={loading}
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
      />

      <Modal
        isOpen={modalState.type === 'create' || modalState.type === 'edit'}
        title={modalState.type === 'edit' ? t('edit_user') : t('create_user')}
        onClose={closeModal}
      >
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
