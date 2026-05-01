import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DataTableHeader from './DataTableHeader';
import DataTableSearch from './DataTableSearch';
import DataTablePagination from './DataTablePagination';

function DataTable({
  columns,
  data,
  loading,
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
}) {
  const { t } = useTranslation();
  const rows = Array.isArray(data) ? data : [];

  const visibleActions = useMemo(() => {
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
                  {t('loading')}
                </td>
              </tr>
            ) : !rows.length ? (
              <tr>
                <td colSpan={columns.length + (visibleActions.length > 0 ? 1 : 0)} className="data-table__state">
                  {t('no_data')}
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
