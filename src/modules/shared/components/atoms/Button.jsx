import Spinner from './Spinner';

// Variants of spec 10: primary (main action), secondary (cancel, back),
// danger (destructive) and ghost (low emphasis).
function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...restProps
}) {
  const variantStyle = {
    primary:
      'bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition',
    secondary:
      'border border-med-border text-med-text-main bg-white hover:bg-gray-50 font-medium px-4 py-2 rounded-lg transition',
    ghost:
      'text-med-text-sub hover:bg-med-primary-50 hover:text-med-primary-900 font-medium px-3 py-2 rounded-lg transition',
    danger:
      'bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition',
  };

  const appliedClass =
    `min-h-11 ${variantStyle[variant] || variantStyle.primary} disabled:opacity-60 disabled:cursor-not-allowed ${loading ? 'inline-flex items-center justify-center gap-2' : ''} ${className}`.trim();

  return (
    <button
      {...restProps}
      className={appliedClass}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export default Button;
