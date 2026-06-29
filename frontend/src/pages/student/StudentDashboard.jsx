import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../../api/students';
import { getJobs } from '../../api/jobs';
import { getMyApplications } from '../../api/applications';
import { getMyOffer } from '../../api/offers';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { formatRelativeDeadline, daysUntil } from '../../utils/formatDate';
import { applyToJob } from '../../api/applications';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function StudentDashboard() {
  const { data: profileData, isLoading: profileLoading } = useQuery({ queryKey: ['my-profile'], queryFn: () => getMyProfile().then((r) => r.data) });
  const { data: jobsData } = useQuery({ queryKey: ['jobs'], queryFn: () => getJobs().then((r) => r.data) });
  const { data: appsData } = useQuery({ queryKey: ['my-applications'], queryFn: () => getMyApplications().then((r) => r.data).catch(() => ({ applications: [] })) });
  const { data: offerData } = useQuery({ queryKey: ['my-offer'], queryFn: () => getMyOffer().then((r) => r.data).catch(() => null) });
  const qc = useQueryClient();

  if (profileLoading) return <LoadingSkeleton type="stats" />;

  const student = profileData?.student;
  const isVerified = student?.isVerifiedByTPO;
  const hasOffer = student?.hasAcceptedOffer;
  const jobs = jobsData?.jobs || [];
  const applications = appsData?.applications || [];
  const appliedJobIds = applications.map((a) => a.jobId?._id || a.jobId);

  const handleApply = async (jobId) => {
    try {
      await applyToJob(jobId);
      toast.success('Applied successfully!');
      qc.invalidateQueries({ queryKey: ['my-applications'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Banner */}
      {student && !isVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-600 mt-0.5">warning</span>
          <div className="flex-1">
            <p className="text-body-md font-semibold text-amber-900">Profile verification required</p>
            <p className="text-body-sm text-amber-700">Your profile is pending TPO verification. You cannot apply to jobs until verified.</p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.08)]">
          <p className="text-label-md font-medium text-on-surface-variant uppercase tracking-wider">Profile Status</p>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isVerified ? 'bg-green-500' : 'bg-amber-500'}`} />
            <p className="text-title-lg font-semibold">{isVerified ? 'Verified' : 'Pending'}</p>
          </div>
        </div>
        <StatCard label="My Applications" value={applications.length} icon="assignment" />
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.08)]">
          <p className="text-label-md font-medium text-on-surface-variant uppercase tracking-wider">Offer Status</p>
          <p className="text-title-lg font-semibold mt-2">{hasOffer ? '✅ Offer Accepted' : offerData?.offer ? '🎉 Offer Received' : 'No offer yet'}</p>
        </div>
      </div>

      {/* Eligible Jobs */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(15,23,42,0.08)]">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-title-md font-semibold">Available Jobs</h3>
          <Link to="/dashboard/student/jobs" className="text-primary text-body-sm font-medium hover:underline">View All Jobs →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                {['Company', 'Role', 'Salary', 'Deadline', 'Action'].map((h) => (
                  <th key={h} className="text-left text-label-md font-medium text-on-surface-variant uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, 5).map((j) => {
                const days = daysUntil(j.applicationDeadline);
                const hasApplied = appliedJobIds.includes(j._id);
                return (
                  <tr key={j._id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-xs font-bold text-on-primary-fixed-variant">
                          {(j.companyId?.name || 'C')[0]}
                        </div>
                        <span className="text-body-md font-medium">{j.companyId?.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-body-md text-on-surface">{j.title}</td>
                    <td className="px-6 py-3 text-body-sm text-on-surface-variant">{j.salary || '—'}</td>
                    <td className="px-6 py-3">
                      <span className={`text-body-sm font-medium ${days !== null && days <= 2 ? 'text-red-600' : 'text-on-surface-variant'}`}>
                        {formatRelativeDeadline(j.applicationDeadline)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {hasApplied ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">✓ Applied</span>
                      ) : hasOffer ? (
                        <span className="text-body-sm text-on-surface-variant">Offer accepted</span>
                      ) : !isVerified ? (
                        <span className="text-body-sm text-on-surface-variant">Not verified</span>
                      ) : (
                        <button onClick={() => handleApply(j._id)} className="px-4 py-1.5 bg-primary-container text-white text-xs font-semibold rounded-lg hover:opacity-90">
                          Apply →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {jobs.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant text-body-md">No jobs available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
