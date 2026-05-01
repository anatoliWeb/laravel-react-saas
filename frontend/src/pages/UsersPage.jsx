import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchUsers } from '../services/usersService';
import { useHeader } from '../app/HeaderContext';
import { useTranslation } from 'react-i18next';
import DataTable from '../components/ui/DataTable/DataTable';

function normalizeRoleNames(roles = []) {
  if (!Array.isArray(roles) || roles.length === 0) {
    return '-';
  }

  return roles.map((role) => (typeof role === 'string' ? role : role.name)).join(', ');
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

  // Simulated permission payload until backend permissions are connected.
  const permissions = ['users.edit', 'users.delete'];

  useEffect(() => {
    setTitle(t('users'));
  }, [setTitle, t]);

  useEffect(() => {
    async function loadUsers() {
      try {
        setIsRefreshing(true);

        const response = await fetchUsers();
        // Debug helper: keep while stabilizing API response contracts.
        console.log('Users API response:', response);

        // Support both API shapes:
        // 1) [{...}, {...}]
        // 2) { data: [{...}, {...}] }
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

  const actions = useMemo(
    () => [
      {
        key: 'edit',
        label: t('edit'),
        permission: 'users.edit',
        onClick: (user) => {
          window.alert(`${t('edit')}: ${user.name}`);
        },
      },
      {
        key: 'delete',
        label: t('delete'),
        permission: 'users.delete',
        variant: 'danger',
        onClick: (user) => {
          window.alert(`${t('delete')}: ${user.name}`);
        },
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
    </section>
  );
}

export default UsersPage;
