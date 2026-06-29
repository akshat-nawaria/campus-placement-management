import { useState } from 'react';
import { useJobs } from '../../hooks/useJobs';
import { useJobApplications, useUpdateStatus, useBulkUpdate } from '../../hooks/useApplications';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

export default function Applications() {
  const { data: jobsData, isLoading: jobsLoading } = useJobs();
  const [selectedJobId, setSelectedJobId] = useState('');
  const { data: appsData, isLoading: appsLoading } = useJobApplications(selectedJobId);
  const updateMutation = useUpdateStatus();
  const bulkMutation = useBulkUpdate();
  const [rollNumbers, setRollNumbers] = useState('');
  const [bulkStatus, setBulkStatus] = useState('Online Assessment');

  const jobs = jobsData?.jobs || [];
  const applications = appsData?.applications || [];

  const handleBulkUpdate = () => {
    const rolls = rollNumbers.split(',').map((r) => r.trim()).filter(Boolean);
    if (rolls.length === 0) return;
    bulkMutation.mutate({ jobId: selectedJobId, rollNumbers: rolls, status: bulkStatus });
    setRollNumbers('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md font-semibold">Applications</h1>

      {/* Job Selector */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.08)]">
        <label className="block text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">Select a Job</label>
        {jobsLoading ? <div className="h-10 bg-gray-200 rounded-lg animate-pulse" /> : (
          <select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary">
            <option value="">Choose a job to view applications...</option>
            {jobs.map((j) => <option key={j._id} value={j._id}>{j.title} — {j.companyId?.name || 'Unknown'}</option>)}
          </select>
        )}
      </div>

      {selectedJobId && (
        <>
          {/* Bulk Update Banner */}
          <div className="bg-[#FEF9C3] border border-[#FCD34D] rounded-xl p-5">
            <h4 className="text-title-md font-semibold text-amber-900 mb-3">Bulk Status Update</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <textarea value={rollNumbers} onChange={(e) => setRollNumbers(e.target.value)} placeholder="Enter roll numbers, comma-separated (e.g., 21BCE001, 21BCE002)"
                className="flex-1 border border-amber-300 rounded-lg px-4 py-2 text-body-sm bg-white focus:outline-none focus:border-amber-500" rows={2} />
              <div className="flex gap-2">
                <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}
                  className="border border-amber-300 rounded-lg px-3 py-2 text-body-sm bg-white focus:outline-none">
                  {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={handleBulkUpdate} disabled={bulkMutation.isPending}
                  className="px-5 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-50 whitespace-nowrap">
                  Update All
                </button>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          {appsLoading ? <LoadingSkeleton rows={6} /> : applications.length === 0 ? (
            <EmptyState icon="assignment" title="No applications yet" subtitle="No students have applied to this job." />
          ) : (
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(15,23,42,0.08)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      {['Student', 'Roll No', 'Branch', 'CGPA', 'Status', 'Applied On', 'Action'].map((h) => (
                        <th key={h} className="text-left text-label-md font-medium text-on-surface-variant uppercase tracking-wider px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                        <td className="px-4 py-3 text-body-md font-medium">{app.studentId?.userId?.name || 'Unknown'}</td>
                        <td className="px-4 py-3 text-body-sm text-on-surface-variant">{app.studentId?.rollNo || '—'}</td>
                        <td className="px-4 py-3 text-body-sm text-on-surface-variant">{app.studentId?.branch || '—'}</td>
                        <td className="px-4 py-3 text-body-sm text-on-surface-variant">{app.studentId?.cgpa || '—'}</td>
                        <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                        <td className="px-4 py-3 text-body-sm text-on-surface-variant">{formatDate(app.createdAt)}</td>
                        <td className="px-4 py-3">
                          <select value={app.status}
                            onChange={(e) => updateMutation.mutate({ applicationId: app._id, status: e.target.value })}
                            className="border border-[#E2E8F0] rounded-lg px-2 py-1 text-body-sm focus:outline-none focus:border-primary">
                            {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
