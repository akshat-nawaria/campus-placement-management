export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', confirmVariant = 'default' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.1)] p-8 max-w-md w-full mx-4">
        <h3 className="text-title-lg font-semibold text-on-surface mb-2">{title}</h3>
        <p className="text-body-md text-on-surface-variant mb-8">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-[#E2E8F0] text-on-surface text-sm font-semibold rounded-lg hover:bg-[#F1F5F9] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              confirmVariant === 'danger'
                ? 'bg-error text-white hover:bg-red-700'
                : 'bg-primary-container text-white hover:opacity-90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
