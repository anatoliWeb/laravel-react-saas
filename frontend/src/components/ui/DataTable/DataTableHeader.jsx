import { useTranslation } from 'react-i18next';

function nextDirection(currentSort, key) {
  if (currentSort.key !== key) {
    return 'asc';
  }

  if (currentSort.direction === 'asc') {
    return 'desc';
  }

  if (currentSort.direction === 'desc') {
    return null;
  }

  return 'asc';
}

function sortIndicator(currentSort, key) {
  if (currentSort.key !== key || !currentSort.direction) {
    return '-';
  }

  return currentSort.direction === 'asc' ? '^' : 'v';
}

function DataTableHeader({ columns, sort, onSort, showActions }) {
  const { t } = useTranslation();

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.key}>
            {column.sortable ? (
              <button
                type="button"
                className="data-table__sort-btn"
                onClick={() => {
                  const direction = nextDirection(sort, column.key);
                  onSort({ key: direction ? column.key : null, direction });
                }}
              >
                <span>{column.label}</span>
                <span className="data-table__sort-indicator">{sortIndicator(sort, column.key)}</span>
              </button>
            ) : (
              <span>{column.label}</span>
            )}
          </th>
        ))}

        {showActions ? <th className="data-table__actions-header">{t('actions')}</th> : null}
      </tr>
    </thead>
  );
}

export default DataTableHeader;
