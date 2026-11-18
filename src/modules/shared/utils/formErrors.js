// Moves backend 400 details onto the matching form fields (React Hook Form).
// The backend `issue` is a machine code (e.g. "invalid_format"), so the text
// shown comes from `fieldMessages`: { fieldName: 'Spanish message' }.
// Returns true when at least one detail matched a field.
function applyFieldErrors(apiError, setError, fieldMessages) {
  if (apiError?.status !== 400) {
    return false;
  }

  let applied = false;

  apiError.details.forEach(({ field, issue }) => {
    const name = Object.keys(fieldMessages).find(
      (candidate) => candidate.toLowerCase() === String(field).toLowerCase()
    );

    if (name) {
      setError(name, { type: issue ?? 'server', message: fieldMessages[name] });
      applied = true;
    }
  });

  return applied;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trimValue = (value) => (typeof value === 'string' ? value.trim() : value);

export { applyFieldErrors, EMAIL_PATTERN, trimValue };
