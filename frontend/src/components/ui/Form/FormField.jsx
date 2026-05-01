function FormField({
  field,
  value,
  error,
  onChange,
}) {
  const inputClassName = `form-field__input ${error ? 'is-error' : ''}`;

  if (field.type === 'chips') {
    const selectedValues = Array.isArray(value) ? value : [];
    const isMultiSelect = field.multiple !== false;

    return (
      <div className="form-field">
        <label className="form-field__label">
          {field.label}
        </label>

        <div className="form-field__chips">
          {(field.options || []).map((option) => {
            const isActive = selectedValues.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                className={`form-chip ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  let nextValues;

                  if (isMultiSelect) {
                    nextValues = isActive
                      ? selectedValues.filter((item) => item !== option.value)
                      : [...selectedValues, option.value];
                  } else {
                    nextValues = isActive ? [] : [option.value];
                  }

                  onChange(field.name, nextValues);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {error ? <p className="form-field__error">{error}</p> : null}
      </div>
    );
  }

  if (field.type === 'permissions') {
    const selectedValues = Array.isArray(value) ? value : [];
    const groupedPermissions = (field.options || []).reduce((acc, option) => {
      const [moduleName = 'general', action = option.label] = String(option.value).split('.');
      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }

      acc[moduleName].push({
        ...option,
        action,
      });
      return acc;
    }, {});

    return (
      <div className="form-field">
        <label className="form-field__label">
          {field.label}
        </label>

        <div className="permission-groups">
          {Object.entries(groupedPermissions).map(([moduleName, items]) => (
            <div key={moduleName} className="permission-group">
              <p className="permission-group__title">{moduleName}</p>
              <div className="permission-group__items">
                {items.map((option) => {
                  const isActive = selectedValues.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`permission-toggle ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        const nextValues = isActive
                          ? selectedValues.filter((item) => item !== option.value)
                          : [...selectedValues, option.value];

                        onChange(field.name, nextValues);
                      }}
                    >
                      <span className="permission-toggle__indicator">{isActive ? 'x' : ''}</span>
                      <span>{option.action}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {error ? <p className="form-field__error">{error}</p> : null}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="form-field">
        <label htmlFor={field.name} className="form-field__label">
          {field.label}
        </label>

        <select
          id={field.name}
          name={field.name}
          multiple={Boolean(field.multiple)}
          value={value ?? (field.multiple ? [] : '')}
          onChange={(event) => {
            if (field.multiple) {
              const selected = Array.from(event.target.selectedOptions, (option) => option.value);
              onChange(field.name, selected);
              return;
            }

            onChange(field.name, event.target.value);
          }}
          className={inputClassName}
        >
          {!field.multiple ? <option value="">{field.placeholder || 'Select option'}</option> : null}
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error ? <p className="form-field__error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="form-field">
      <label htmlFor={field.name} className="form-field__label">
        {field.label}
      </label>

      <input
        id={field.name}
        name={field.name}
        type={field.type || 'text'}
        value={value ?? ''}
        onChange={(event) => onChange(field.name, event.target.value)}
        className={inputClassName}
        placeholder={field.placeholder || ''}
      />

      {error ? <p className="form-field__error">{error}</p> : null}
    </div>
  );
}

export default FormField;
