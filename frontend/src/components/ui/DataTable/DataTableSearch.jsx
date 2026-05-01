import { useMemo, useState } from 'react';
import { debounce } from '../../../utils/debounce';

function DataTableSearch({ onSearch, placeholder }) {
  const [value, setValue] = useState('');

  const debouncedSearch = useMemo(() => debounce(onSearch, 400), [onSearch]);

  return (
    <input
      type="search"
      className="data-table__search search-input"
      value={value}
      onChange={(event) => {
        const nextValue = event.target.value;
        setValue(nextValue);
        debouncedSearch(nextValue);
      }}
      placeholder={placeholder}
    />
  );
}

export default DataTableSearch;
