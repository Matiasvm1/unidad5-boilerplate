function Textarea({ invalid = false, className = '', rows = 4, ...restProps }) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={`w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted transition resize-y focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent ${
        invalid ? 'border-red-400 bg-red-50/20' : 'border-med-border'
      } ${className}`}
      {...restProps}
    />
  );
}

export default Textarea;
