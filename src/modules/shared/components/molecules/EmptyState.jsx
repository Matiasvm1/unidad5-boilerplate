import Icon from '../atoms/Icon';

function EmptyState({ icon = 'inbox', title, children }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 px-6 py-12">
      <span className="w-12 h-12 rounded-full bg-med-primary-50 text-med-primary-700 flex items-center justify-center">
        <Icon name={icon} className="w-6 h-6" />
      </span>
      <p className="text-sm font-semibold text-med-text-main">{title}</p>
      {children}
    </div>
  );
}

export default EmptyState;
