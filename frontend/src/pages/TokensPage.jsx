import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeader } from '../app/HeaderContext';
import { useMeta } from '../hooks/useMeta';
import { can } from '../utils/permissions';
import { useLoading } from '../contexts/LoadingContext';
import { createToken, deleteToken, getTokens } from '../services/tokenService';
import { formatDate } from '../utils/date';
import { getCache, isDataDifferent, setCache } from '../utils/cache';
import DataTable from '../components/ui/DataTable/DataTable';
import Modal from '../components/ui/Modal/Modal';
import Form from '../components/ui/Form/Form';

/**
 * Tokens management page.
 *
 * WHY:
 * Tokens UI is permission-controlled to ensure secure API key management.
 */
function TokensPage() {
  const { t } = useTranslation();
  const { setTitle, setIsRefreshing } = useHeader();
  const { showLoading, hideLoading } = useLoading();
  const { meta } = useMeta();

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formErrorMessage, setFormErrorMessage] = useState(null);
  const [createdTokenValue, setCreatedTokenValue] = useState(null);
  const [isRefreshingFromCache, setIsRefreshingFromCache] = useState(false);
  const hasFetched = useRef(false);
  const tokensRef = useRef([]);
  const TOKENS_CACHE_KEY = 'tokens_list';
  const TOKENS_CACHE_TTL_MS = 60_000;

  const permissions = meta?.current_user_permissions || [];
  // WHY:
  // RBAC controls visibility of token actions.
  const canViewTokens = can('tokens.view', meta);
  const canCreateToken = can('tokens.create', meta);
  const canDeleteToken = can('tokens.delete', meta);

  useEffect(() => {
    tokensRef.current = tokens;
  }, [tokens]);

  useEffect(() => {
    setTitle(t('tokens'));
  }, [setTitle, t]);

  const loadTokens = useCallback(async (options = {}) => {
    const { keepVisibleData = false } = options;

    if (!canViewTokens) {
      setTokens([]);
      setLoading(false);
      return;
    }

    try {
      const hasRowsVisible = keepVisibleData || tokensRef.current.length > 0;
      setLoading(!hasRowsVisible);
      setLoadError(null);
      setIsRefreshing(true);
      if (hasRowsVisible) {
        setIsRefreshingFromCache(true);
      }

      const response = await getTokens();
      const nextTokens = Array.isArray(response) ? response : [];
      if (isDataDifferent(tokensRef.current, nextTokens)) {
        setTokens(nextTokens);
        tokensRef.current = nextTokens;
      }
      setCache(TOKENS_CACHE_KEY, nextTokens, TOKENS_CACHE_TTL_MS);
    } catch (err) {
      console.error('Tokens fetch failed', err);
      if (err?.response?.status === 403) {
        setLoadError(t('no_access'));
      } else {
        setLoadError(t('unexpected_error'));
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setIsRefreshingFromCache(false);
    }
  }, [canViewTokens, setIsRefreshing, t]);

  useEffect(() => {
    // WHY:
    // Meta is loaded asynchronously, so permissions can be unavailable on first render.
    // We fetch tokens only after tokens.view becomes available to avoid missing the API call.
    if (!canViewTokens) {
      return;
    }

    if (hasFetched.current) {
      return;
    }

    hasFetched.current = true;

    const cachedTokens = getCache(TOKENS_CACHE_KEY);
    if (Array.isArray(cachedTokens) && cachedTokens.length > 0) {
      // WHY:
      // Show cached data immediately for fast back-navigation UX,
      // then revalidate in background to keep data fresh.
      setTokens(cachedTokens);
      setLoading(false);
      setIsRefreshingFromCache(true);
      tokensRef.current = cachedTokens;
      loadTokens({ keepVisibleData: true });
      return;
    }

    loadTokens();
  }, [canViewTokens, loadTokens]);

  const filteredTokens = useMemo(() => {
    if (!search.trim()) {
      return tokens;
    }

    const term = search.toLowerCase();
    return tokens.filter((token) => (
      String(token?.id ?? '').includes(term)
      || String(token?.name ?? '').toLowerCase().includes(term)
      || String(token?.owner?.name ?? token?.user?.name ?? '').toLowerCase().includes(term)
    ));
  }, [search, tokens]);

  const columns = useMemo(
    () => [
      { key: 'id', label: 'ID' },
      { key: 'name', label: t('name') },
      {
        key: 'owner',
        label: t('token_owner'),
        render: (_, row) => row?.owner?.name || row?.user?.name || '-',
      },
      {
        key: 'created_at',
        label: t('created_at'),
        render: (value) => (value ? formatDate(value) : '-'),
      },
    ],
    [t],
  );

  const actions = useMemo(() => {
    if (!canDeleteToken) {
      return [];
    }

    return [
      {
        key: 'delete',
        label: `\u{1F5D1} ${t('delete')}`,
        permission: 'tokens.delete',
        variant: 'danger',
        onClick: async (token) => {
          if (!window.confirm(t('confirm_delete_token'))) {
            return;
          }

          try {
            showLoading(t('deleting_token'));
            await deleteToken(token.id);
            setTokens((prev) => {
              const next = prev.filter((item) => item.id !== token.id);
              setCache(TOKENS_CACHE_KEY, next, TOKENS_CACHE_TTL_MS);
              return next;
            });
          } catch (err) {
            console.error('Token delete failed', err);
            if (err?.response?.status === 403) {
              setLoadError(t('no_access'));
            } else {
              setLoadError(t('unexpected_error'));
            }
          } finally {
            hideLoading();
          }
        },
      },
    ];
  }, [canDeleteToken, hideLoading, showLoading, t]);

  const openCreateModal = () => {
    setFormValues({ name: '' });
    setFormErrors({});
    setFormErrorMessage(null);
    setCreatedTokenValue(null);
    setModalOpen(true);
  };

  const closeCreateModal = () => {
    setModalOpen(false);
    setFormValues({ name: '' });
    setFormErrors({});
    setFormErrorMessage(null);
  };

  const handleFormChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCreateToken = async (values) => {
    try {
      showLoading(t('creating_token'));
      setFormErrorMessage(null);
      setFormErrors({});

      const response = await createToken({ name: values.name.trim() });
      const plainTextToken = response?.token || response?.plainTextToken || null;

      // WHY:
      // Token value is only returned once by backend,
      // so UI must display it immediately after creation.
      setCreatedTokenValue(plainTextToken || t('token_created_no_secret'));
      await loadTokens();
    } catch (err) {
      const errorData = err?.response?.data || err?.data;
      if (err?.response?.status === 403) {
        setFormErrorMessage(t('no_access'));
      } else if (errorData?.errors) {
        setFormErrors(errorData.errors);
        setFormErrorMessage(t('validation_error'));
      } else {
        setFormErrorMessage(t('unexpected_error'));
      }
    } finally {
      hideLoading();
    }
  };

  if (!canViewTokens) {
    return (
      <section className="data-table">
        <div className="data-table__status">
          <p className="data-table__status-text">{t('no_access')}</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {isRefreshingFromCache ? (
        <p className="data-table__status-text">{t('tokens_refreshing_cached')}</p>
      ) : null}

      {canCreateToken ? (
        <div className="users-page__actions">
          <button type="button" className="form__btn form__btn--primary" onClick={openCreateModal}>
            + {t('create_token')}
          </button>
        </div>
      ) : null}

      <DataTable
        columns={columns}
        data={filteredTokens}
        loading={loading}
        error={loadError}
        onRetry={loadTokens}
        total={filteredTokens.length}
        page={1}
        perPage={filteredTokens.length || 1}
        onPageChange={() => {}}
        onPerPageChange={() => {}}
        onSearch={setSearch}
        onSort={() => {}}
        sort={{ key: null, direction: null }}
        actions={actions}
        permissions={permissions}
        searchPlaceholder={t('search_tokens')}
        emptyMessage={t('no_tokens')}
      />

      <Modal
        isOpen={modalOpen}
        title={t('create_token')}
        onClose={closeCreateModal}
      >
        {formErrorMessage ? (
          <div className="form-error-global">{formErrorMessage}</div>
        ) : null}

        {createdTokenValue ? (
          <div className="token-secret">
            <p className="token-secret__label">{t('token_value')}</p>
            <code className="token-secret__value">{createdTokenValue}</code>
            <p className="token-secret__hint">{t('copy_token_now')}</p>
          </div>
        ) : (
          <Form
            schema={[
              {
                name: 'name',
                label: t('name'),
                type: 'text',
                required: true,
                requiredMessage: t('field_required'),
              },
            ]}
            values={formValues}
            errors={formErrors}
            setErrors={setFormErrors}
            onChange={handleFormChange}
            onSubmit={handleCreateToken}
            onCancel={closeCreateModal}
            submitLabel={t('create')}
            cancelLabel={t('cancel')}
          />
        )}
      </Modal>
    </section>
  );
}

export default TokensPage;
