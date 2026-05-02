import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DataTableHeader from './DataTableHeader';
import DataTableSearch from './DataTableSearch';
import DataTablePagination from './DataTablePagination';

/**
 * Generic SaaS DataTable.
 *
 * WHY:
 * Encapsulates shared table UX (loading/empty/search/actions/pagination)
 * so feature pages only provide data and behavior, not repeated markup.
 */
function DataTable({
  columns,
  data,
  loading,
  error = null,
  total,
  page,
  perPage,
  perPageOptions = [10, 20, 50],
  onPageChange,
  onPerPageChange,
  onSearch,
  onSort,
  sort,
  actions = [],
  permissions = [],
  filters = null,
  searchPlaceholder,
  emptyMessage,
  onRetry,
}) {
  const { t } = useTranslation();
  const rows = data ?? [];

  const visibleActions = useMemo(() => {
    // WHY:
    // Permission filtering is UI-level defense-in-depth;
    // backend still enforces authorization for real operations.
    return actions.filter((action) => !action.permission || permissions.includes(action.permission));
  }, [actions, permissions]);

  return (
    <section className="data-table">
      <div className="data-table__toolbar">
        <DataTableSearch
          onSearch={onSearch}
          placeholder={searchPlaceholder || t('search')}
        />

        {filters ? <div className="data-table__filters">{filters}</div> : null}
      </div>

      <div className="data-table__wrap">
        <table className="data-table__table">
          <DataTableHeader
            columns={columns}
            sort={sort}
            onSort={onSort}
            showActions={visibleActions.length > 0}
          />

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (visibleActions.length > 0 ? 1 : 0)} className="data-table__state">
                  <div className="data-table__loading-block">
                    <span className="data-table__loading-shimmer" />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length + (visibleActions.length > 0 ? 1 : 0)} className="data-table__state">
                  <div className="data-table__status">
                    <p className="data-table__status-text">{error || t('unexpected_error')}</p>
                    {onRetry ? (
                      <button type="button" className="data-table__retry-btn" onClick={onRetry}>
                        {t('retry')}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ) : !Array.isArray(rows) || !rows.length ? (
              <tr>
                <td colSpan={columns.length + (visibleActions.length > 0 ? 1 : 0)} className="data-table__state">
                  {emptyMessage || t('no_data')}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id ?? JSON.stringify(row)}>
                  {columns.map((column) => (
                    <td key={`${row.id ?? 'row'}-${column.key}`}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}

                  {visibleActions.length > 0 ? (
                    <td className="data-table__actions-cell">
                      <div className="data-table__actions">
                        {visibleActions.map((action) => (
                          <button
                            key={`${action.key}-${row.id}`}
                            type="button"
                            className={`data-table__action-btn data-table__action-col-btn ${action.variant ? `is-${action.variant}` : ''}`}
                            onClick={() => action.onClick?.(row)}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DataTablePagination
        page={page}
        perPage={perPage}
        perPageOptions={perPageOptions}
        total={total}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
      />
    </section>
  );
}

export default DataTable;
