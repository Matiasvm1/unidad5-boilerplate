import Icon from './Icon';

// Plain <input> styled for the app. Works with React Hook Form's register
// (React 19 passes ref as a regular prop). `icon` adds a leading icon and
// `endAdornment` a trailing element, such as a show/hide password button.
function Input({
  invalid = false,
  icon,
  endAdornment,
  className = '',
  ...restProps
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-med-text-muted">
          <Icon name={icon} />
        </span>
      )}
      <input
        aria-invalid={invalid || undefined}
        className={`w-full min-h-11 border rounded-lg py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent ${
          icon ? 'pl-10' : 'pl-3.5'
        } ${endAdornment ? 'pr-12' : 'pr-3.5'} ${
          invalid ? 'border-red-400 bg-red-50/20' : 'border-med-border'
        } ${className}`}
        {...restProps}
      />
      {endAdornment && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-0.5">
          {endAdornment}
        </span>
      )}
    </div>
  );
}

export default Input;
