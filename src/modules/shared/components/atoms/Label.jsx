function Label({ htmlFor, required = false, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-semibold text-med-text-main"
    >
      {children}
      {required && (
        <span className="text-red-500" aria-hidden="true">
          {' '}
          *
        </span>
      )}
    </label>
  );
}

export default Label;
