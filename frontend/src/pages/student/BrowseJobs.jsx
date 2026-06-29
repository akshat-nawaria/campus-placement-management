import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getJobs } from '../../api/jobs';
import { getMyProfile } from '../../api/students';
import { getMyApplications, applyToJob } from '../../api/applications';
import EligibilityChips from '../../components/shared/EligibilityChips';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { formatRelativeDeadline, daysUntil, formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

export default function BrowseJobs() {
  const { data: jobsData, isLoading } = useQuery({ queryKey: ['jobs'], queryFn: () => getJobs().then((r) => r.data) });
  const { data: profileData } = useQuery({ queryKey: ['my-profile'], queryFn: () => getMyProfile().then((r) => r.data).catch(() => null) });
  const { data: appsData } = useQuery({ queryKey: ['my-applications'], queryFn: () => getMyApplications().then((r) => r.data).catch(() => ({ applications: [] })) });
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [applyModal, setApplyModal] = useState(null);
  const [applying, setApplying] = useState(false);

  if (isLoading) return <LoadingSkeleton type="cards" rows={6} />;

  const student = profileData?.student;
  const isVerified = student?.isVerifiedByTPO;
  const hasOffer = student?.hasAcceptedOffer;
  const appliedJobIds = (appsData?.applications || []).map((a) => a.jobId?._id || a.jobId);

  const jobs = (jobsData?.jobs || []).filter((j) => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.companyId?.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter && j.jobType !== typeFilter) return false;
    return true;
  });

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToJob(applyModal._id);
      toast.success('Applied successfully!');
      qc.invalidateQueries({ queryKey: ['my-applications'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
    setApplying(false);
    setApplyModal(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md font-semibold">Browse Jobs</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input type="text" placeholder="Search by title or company..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-body-sm focus:outline-none focus:border-primary">
          <option value="">All Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      {jobs.length === 0 ? (
        <EmptyState icon="work" title="No jobs found" subtitle="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((j) => {
            const hasApplied = appliedJobIds.includes(j._id);
            const days = daysUntil(j.applicationDeadline);
            const expired = days !== null && days < 0;

            return (
              <div key={j._id} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.08)] hover:border-[#CBD5E1] transition-all flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-sm font-bold text-on-primary-fixed-variant">
                      {(j.companyId?.name || 'C')[0]}
                    </div>
                    <div>
                      <h3 className="text-title-md font-semibold text-on-surface">{j.title}</h3>
                      <p className="text-body-sm text-on-surface-variant">{j.companyId?.name || '—'}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${j.jobType === 'Full-Time' ? 'bg-blue-50 text-blue-700' : 'bg-teal-50 text-teal-700'}`}>
                    {j.jobType}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">payments</span> {j.salary || '—'}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span className={days !== null && days <= 2 ? 'text-red-600 font-medium' : ''}>{formatRelativeDeadline(j.applicationDeadline)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <EligibilityChips criteria={j.eligibilityCriteria} />
                </div>

                <div className="mt-auto">
                  {hasApplied ? (
                    <button disabled className="w-full py-2.5 bg-green-50 text-green-700 text-sm font-semibold rounded-lg flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span> Applied
                    </button>
                  ) : hasOffer ? (
                    <button disabled className="w-full py-2.5 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg">Offer Already Accepted</button>
                  ) : !isVerified ? (
                    <button disabled className="w-full py-2.5 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg">Profile Not Verified</button>
                  ) : expired ? (
                    <button disabled className="w-full py-2.5 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg">Deadline Expired</button>
                  ) : (
                    <button onClick={() => setApplyModal(j)} className="w-full py-2.5 bg-primary-container text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all">
                      Apply Now →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Confirmation */}
      <ConfirmModal
        isOpen={!!applyModal}
        onClose={() => setApplyModal(null)}
        onConfirm={handleApply}
        title={`Apply to ${applyModal?.title}`}
        message={`Are you sure you want to apply to ${applyModal?.title} at ${applyModal?.companyId?.name}?`}
        confirmLabel={applying ? 'Applying...' : 'Confirm Application'}
      />
    </div>
  );
}
