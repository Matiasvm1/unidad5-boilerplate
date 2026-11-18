import Icon from '../atoms/Icon';

const tones = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  info: 'bg-med-primary-50 border-med-primary-200 text-med-primary-900',
};

function Alert({ tone = 'error', children, className = '' }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2 p-3 border rounded-lg text-xs ${tones[tone] ?? tones.error} ${className}`}
    >
      <Icon name={tone} className="w-4 h-4 shrink-0 mt-px" />
      <p>{children}</p>
    </div>
  );
}

export default Alert;
