import FormField from './FormField';

/**
 * Reusable schema-driven form wrapper.
 *
 * WHY:
 * Centralizes required-field validation and submit gating so modal forms
 * can stay declarative and avoid duplicate validation code per page.
 */
function Form({
  schema,
  values,
  errors = {},
  setErrors,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    schema.forEach((field) => {
      if (!field.required) {
        return;
      }

      const fieldValue = values[field.name];
      const isEmptyArray = Array.isArray(fieldValue) && fieldValue.length === 0;
      const isEmptyString = !Array.isArray(fieldValue) && !String(fieldValue ?? '').trim();

      if (isEmptyArray || isEmptyString) {
        nextErrors[field.name] = field.requiredMessage || 'This field is required';
      }
    });

    // WHY:
    // We stop submit early to keep API calls reserved for valid payloads
    // and let users fix issues immediately in current modal context.
    setErrors?.(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit?.(values);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__fields">
        {schema.map((field) => (
          field.hidden ? null : (
          <FormField
            key={field.name}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            onChange={onChange}
          />
          )
        ))}
      </div>

      <div className="form__actions">
        <button type="button" className="form__btn form__btn--secondary" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="submit" className="form__btn form__btn--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default Form;
