import { useMyApplications } from '../../hooks/useApplications';
import ApplicationPipeline from '../../components/shared/ApplicationPipeline';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/formatDate';
import { Link } from 'react-router-dom';

export default function MyApplications() {
  const { data, isLoading } = useMyApplications();

  if (isLoading) return <LoadingSkeleton type="cards" rows={4} />;

  const applications = data?.applications || [];

  if (applications.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-headline-md font-semibold">My Applications</h1>
        <EmptyState
          icon="assignment"
          title="No applications yet"
          subtitle="Start applying to jobs to see your applications here."
          actionLabel="Browse Jobs"
          onAction={() => window.location.href = '/dashboard/student/jobs'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md font-semibold">My Applications</h1>
        <span className="text-body-sm text-on-surface-variant">{applications.length} application(s)</span>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.08)] hover:border-[#CBD5E1] transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-lg font-bold text-on-primary-fixed-variant flex-shrink-0">
                  {(app.jobId?.companyId?.name || 'C')[0]}
                </div>
                <div>
                  <h3 className="text-title-md font-semibold text-on-surface">{app.jobId?.title || 'Unknown Job'}</h3>
                  <p className="text-body-sm text-on-surface-variant">{app.jobId?.companyId?.name || 'Unknown Company'}</p>
                  <div className="flex items-center gap-3 mt-1 text-body-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      Applied {formatDate(app.createdAt)}
                    </span>
                    {app.jobId?.salary && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">payments</span>
                        {app.jobId.salary}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:text-right">
                <ApplicationPipeline currentStatus={app.status} />
              </div>
            </div>

            {/* Status detail bar */}
            <div className={`mt-4 pt-4 border-t border-[#E2E8F0] flex items-center gap-2 ${
              app.status === 'Selected' ? 'text-green-700' : app.status === 'Rejected' ? 'text-red-600' : 'text-on-surface-variant'
            }`}>
              <span className="material-symbols-outlined text-[16px]">
                {app.status === 'Selected' ? 'celebration' : app.status === 'Rejected' ? 'cancel' : 'info'}
              </span>
              <span className="text-body-sm font-medium">
                {app.status === 'Selected' ? '🎉 Congratulations! You have been selected.' :
                 app.status === 'Rejected' ? 'Unfortunately, your application was not selected.' :
                 `Current Stage: ${app.status}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
