export default function EmptyState({ icon = 'inbox', title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">{icon}</span>
      <h3 className="text-title-md font-semibold text-on-surface mb-1">{title}</h3>
      {subtitle && <p className="text-body-md text-on-surface-variant text-center max-w-sm">{subtitle}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-6 py-2.5 bg-primary-container text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
