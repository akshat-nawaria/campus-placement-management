export default function StatCard({ label, value, icon, iconColor = 'text-primary-container' }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label-md font-medium text-on-surface-variant uppercase tracking-wider">{label}</p>
          <p className="text-headline-md font-semibold text-on-surface mt-2">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center`}>
          <span className={`material-symbols-outlined ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}
