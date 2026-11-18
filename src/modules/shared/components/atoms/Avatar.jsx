const SIZES = {
  md: 'w-9 h-9 rounded-full text-xs',
  lg: 'w-12 h-12 rounded-xl text-base',
};

// "Dra. Ana María López" -> "AM". The title prefix is skipped.
function initials(name = '') {
  return name
    .trim()
    .replace(/^(dra?\.?)\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

// Initials instead of the mockup photos (spec 10).
function Avatar({ name, size = 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={`${SIZES[size] ?? SIZES.md} shrink-0 bg-med-primary-100 text-med-primary-700 font-bold flex items-center justify-center`}
    >
      {initials(name)}
    </span>
  );
}

export default Avatar;
