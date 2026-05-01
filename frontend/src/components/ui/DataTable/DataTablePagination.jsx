import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

function buildPages(totalPages, currentPage) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];

  if (currentPage > 3) {
    pages.push('left-ellipsis');
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push('right-ellipsis');
  }

  pages.push(totalPages);

  return pages;
}

function DataTablePagination({
  page,
  perPage,
  perPageOptions = [10, 20, 50],
  total,
  onPageChange,
  onPerPageChange,
}) {
  const { t } = useTranslation();
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const perPageRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = useMemo(() => buildPages(totalPages, page), [totalPages, page]);
  const showPagerControls = totalPages > 1;
  const canShowPerPage = total > Math.min(...perPageOptions);

  useEffect(() => {
    const onOutsideClick = (event) => {
      if (perPageRef.current && !perPageRef.current.contains(event.target)) {
        setIsPerPageOpen(false);
      }
    };

    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  const handlePageChangeSafe = (nextPage) => {
    const safePage = Math.max(1, Math.min(totalPages, nextPage));
    if (safePage !== page) {
      onPageChange?.(safePage);
    }
  };

  return (
    <div className="pagination-wrapper data-table__pagination">
      {canShowPerPage ? (
        <div className="pagination-left data-table__per-page">
          <span className="data-table__per-page-label">{t('rows_per_page')}</span>
          <div
            className={`data-table__per-page-dropdown language-switcher ${isPerPageOpen ? 'is-open' : ''}`}
            ref={perPageRef}
          >
            <button
              type="button"
              className="data-table__per-page-select language-switcher__trigger"
              onClick={() => setIsPerPageOpen((value) => !value)}
              aria-haspopup="listbox"
              aria-expanded={isPerPageOpen}
            >
              {perPage}
            </button>

            <div className="data-table__per-page-menu language-switcher__menu" role="listbox">
              {perPageOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="option"
                  className={`language-switcher__option ${option === perPage ? 'is-active' : ''}`}
                  aria-selected={option === perPage}
                  onClick={() => {
                    onPerPageChange?.(option);
                    setIsPerPageOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {showPagerControls ? (
        <>
          <div className="pagination-center data-table__page-list pagination">
            {pages.map((item) => {
              if (typeof item !== 'number') {
                return (
                  <span key={item} className="data-table__ellipsis">
                    ...
                  </span>
                );
              }

              return (
                  <button
                    key={item}
                    type="button"
                    className={`data-table__page-btn ${item === page ? 'is-active active' : ''}`}
                    onClick={() => handlePageChangeSafe(item)}
                  >
                    {item}
                  </button>
              );
            })}
          </div>

          <div className="pagination-right">
            <button
              type="button"
              className="data-table__page-btn"
              disabled={page <= 1}
              onClick={() => handlePageChangeSafe(page - 1)}
            >
              {t('previous')}
            </button>

            <button
              type="button"
              className="data-table__page-btn"
              disabled={page >= totalPages}
              onClick={() => handlePageChangeSafe(page + 1)}
            >
              {t('next')}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default DataTablePagination;
