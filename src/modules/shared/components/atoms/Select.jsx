// Native <select> styled like Input. Works with React Hook Form's register.
function Select({ invalid = false, className = '', children, ...restProps }) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={`w-full min-h-11 border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent disabled:bg-gray-50 disabled:text-med-text-muted disabled:cursor-not-allowed ${
        invalid ? 'border-red-400 bg-red-50/20' : 'border-med-border'
      } ${className}`}
      {...restProps}
    >
      {children}
    </select>
  );
}

export default Select;
