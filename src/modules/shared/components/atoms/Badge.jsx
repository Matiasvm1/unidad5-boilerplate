const TONES = {
  success: {
    pill: 'bg-med-active-bg text-med-active-text',
    dot: 'bg-med-active-text',
  },
  danger: {
    pill: 'bg-med-danger-bg text-med-danger-text',
    dot: 'bg-med-danger-text',
  },
  warning: {
    pill: 'bg-med-leave-bg text-med-leave-text',
    dot: 'bg-med-leave-text',
  },
  neutral: { pill: 'bg-slate-100 text-slate-700', dot: 'bg-slate-500' },
};

// Status pill with a dot (spec 10: appointment and doctor states).
function Badge({ tone = 'neutral', children }) {
  const { pill, dot } = TONES[tone] ?? TONES.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${pill}`}
    >
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  );
}

export default Badge;
