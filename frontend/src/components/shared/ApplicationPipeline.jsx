import { APPLICATION_STATUSES } from '../../utils/constants';

const stepOrder = ['Applied', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Selected'];

export default function ApplicationPipeline({ currentStatus }) {
  const isRejected = currentStatus === 'Rejected';
  const currentIdx = isRejected
    ? stepOrder.length
    : stepOrder.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1">
      {stepOrder.map((step, idx) => {
        const isCompleted = !isRejected && idx < currentIdx;
        const isCurrent = !isRejected && idx === currentIdx;

        let bgColor = 'bg-gray-200';
        let textColor = 'text-gray-400';

        if (isRejected) {
          bgColor = idx <= currentIdx ? 'bg-red-400' : 'bg-gray-200';
          textColor = 'text-red-600';
        } else if (isCompleted) {
          bgColor = 'bg-teal-400';
          textColor = 'text-teal-700';
        } else if (isCurrent) {
          bgColor = 'bg-primary-container';
          textColor = 'text-primary';
        }

        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center`}>
                {isCompleted && !isRejected ? (
                  <span className="material-symbols-outlined text-white text-sm">check</span>
                ) : isRejected && idx === 0 ? (
                  <span className="material-symbols-outlined text-white text-sm">close</span>
                ) : (
                  <span className="text-[10px] font-bold text-white">{idx + 1}</span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isCurrent ? textColor : 'text-gray-400'} whitespace-nowrap hidden md:block`}>
                {step.replace('Technical Interview', 'Tech').replace('Online Assessment', 'OA').replace('HR Interview', 'HR')}
              </span>
            </div>
            {idx < stepOrder.length - 1 && (
              <div className={`w-6 h-0.5 ${isCompleted || (isRejected && idx < currentIdx) ? bgColor : 'bg-gray-200'} mb-4 hidden md:block`} />
            )}
          </div>
        );
      })}
      {isRejected && (
        <div className="flex flex-col items-center ml-1">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">close</span>
          </div>
          <span className="text-[10px] mt-1 font-medium text-red-600 hidden md:block">Rejected</span>
        </div>
      )}
    </div>
  );
}
