import Card from '../atoms/Card';
import Icon from '../atoms/Icon';

// One dashboard number. Loads on its own: while loading it pulses, and when
// its call fails it shows a dash without breaking the rest (spec P2).
function StatCard({ icon, label, value, loading = false, error = null }) {
  let content = value;

  if (loading) {
    content = (
      <span className="block h-9 w-16 rounded bg-gray-200 animate-pulse" />
    );
  } else if (error) {
    content = <span title={error.message}>—</span>;
  }

  return (
    <Card className="flex flex-col justify-between">
      <span className="w-11 h-11 rounded-xl bg-med-primary-50 text-med-primary-900 flex items-center justify-center">
        <Icon name={icon} className="w-6 h-6" />
      </span>
      <div className="mt-6" aria-busy={loading || undefined}>
        <span className="text-[11px] font-bold uppercase tracking-wider text-med-text-sub">
          {label}
        </span>
        <p className="text-3xl sm:text-4xl font-extrabold text-med-primary-900 mt-1">
          {content}
        </p>
      </div>
    </Card>
  );
}

export default StatCard;
