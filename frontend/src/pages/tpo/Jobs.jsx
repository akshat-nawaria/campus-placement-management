import { useState } from 'react';
import { useJobs, useAddJob } from '../../hooks/useJobs';
import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '../../api/companies';
import { getEligibleStudents } from '../../api/jobs';
import SlideOver from '../../components/ui/SlideOver';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { BRANCHES } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

export default function Jobs() {
  const { data, isLoading } = useJobs();
  const { data: companiesData } = useQuery({ queryKey: ['companies'], queryFn: () => getCompanies().then((r) => r.data) });
  const addJobMutation = useAddJob();
  const [showForm, setShowForm] = useState(false);
  const [eligibleJob, setEligibleJob] = useState(null);
  const [eligibleData, setEligibleData] = useState(null);
  const [form, setForm] = useState({
    title: '', companyId: '', jobType: 'Full-Time', salary: '', applicationDeadline: '', description: '',
    eligibilityCriteria: { minCgpa: 0, allowedBranches: [], allowBacklogs: false, targetBatchYear: 2026 },
  });

  const handleSubmit = (e) => { e.preventDefault(); addJobMutation.mutate(form, { onSuccess: () => { setShowForm(false); resetForm(); } }); };
  const resetForm = () => setForm({ title: '', companyId: '', jobType: 'Full-Time', salary: '', applicationDeadline: '', description: '', eligibilityCriteria: { minCgpa: 0, allowedBranches: [], allowBacklogs: false, targetBatchYear: 2026 } });

  const toggleBranch = (b) => {
    const branches = form.eligibilityCriteria.allowedBranches.includes(b)
      ? form.eligibilityCriteria.allowedBranches.filter((x) => x !== b)
      : [...form.eligibilityCriteria.allowedBranches, b];
    setForm({ ...form, eligibilityCriteria: { ...form.eligibilityCriteria, allowedBranches: branches } });
  };

  const viewEligible = async (job) => {
    setEligibleJob(job);
    try {
      const res = await getEligibleStudents(job._id);
      setEligibleData(res.data);
    } catch { toast.error('Failed to fetch eligible students'); }
  };

  if (isLoading) return <LoadingSkeleton rows={8} />;
  const jobs = data?.jobs || [];
  const companies = companiesData?.companies || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md font-semibold">Jobs</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white text-sm font-semibold rounded-lg hover:opacity-90">
          <span className="material-symbols-outlined text-[18px]">add</span> Post New Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <EmptyState icon="work" title="No jobs posted" subtitle="Post your first job to start receiving applications." actionLabel="Post New Job" onAction={() => setShowForm(true)} />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(15,23,42,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  {['Title', 'Company', 'Type', 'Salary', 'Deadline', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-label-md font-medium text-on-surface-variant uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j._id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 text-body-md font-medium text-on-surface">{j.title}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{j.companyId?.name || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={j.jobType === 'Full-Time' ? 'Open' : 'Accepted'} /></td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{j.salary || '—'}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{formatDate(j.applicationDeadline)}</td>
                    <td className="px-4 py-3"><StatusBadge status={j.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => viewEligible(j)} className="text-primary text-body-sm font-medium hover:underline">View Eligible</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Post New Job SlideOver */}
      <SlideOver isOpen={showForm} onClose={() => { setShowForm(false); resetForm(); }} title="Post New Job" width="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-label-md text-on-surface-variant mb-1">Job Title *</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" /></div>
          <div><label className="block text-label-md text-on-surface-variant mb-1">Company *</label>
            <select required value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary">
              <option value="">Select company</option>
              {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-label-md text-on-surface-variant mb-1">Job Type *</label>
              <select value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary">
                <option value="Full-Time">Full-Time</option><option value="Internship">Internship</option>
              </select></div>
            <div><label className="block text-label-md text-on-surface-variant mb-1">Salary *</label>
              <input required value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" /></div>
          </div>
          <div><label className="block text-label-md text-on-surface-variant mb-1">Deadline *</label>
            <input type="date" required value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary" /></div>

          <div className="pt-4 border-t border-[#E2E8F0]">
            <h4 className="text-title-md font-semibold mb-4">Eligibility Criteria</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="block text-label-md text-on-surface-variant mb-1">Min CGPA</label>
                <input type="number" step="0.1" min="0" max="10" value={form.eligibilityCriteria.minCgpa} onChange={(e) => setForm({ ...form, eligibilityCriteria: { ...form.eligibilityCriteria, minCgpa: parseFloat(e.target.value) || 0 } })}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary" /></div>
              <div><label className="block text-label-md text-on-surface-variant mb-1">Target Batch Year</label>
                <input type="number" value={form.eligibilityCriteria.targetBatchYear} onChange={(e) => setForm({ ...form, eligibilityCriteria: { ...form.eligibilityCriteria, targetBatchYear: parseInt(e.target.value) || 2026 } })}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary" /></div>
            </div>
            <div className="mb-4">
              <label className="block text-label-md text-on-surface-variant mb-2">Allowed Branches</label>
              <div className="flex flex-wrap gap-2">
                {BRANCHES.map((b) => (
                  <button key={b} type="button" onClick={() => toggleBranch(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.eligibilityCriteria.allowedBranches.includes(b) ? 'bg-primary-container text-white border-primary-container' : 'bg-white text-on-surface-variant border-[#E2E8F0] hover:border-primary'}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.eligibilityCriteria.allowBacklogs} onChange={(e) => setForm({ ...form, eligibilityCriteria: { ...form.eligibilityCriteria, allowBacklogs: e.target.checked } })}
                className="w-4 h-4 text-primary-container rounded border-[#E2E8F0] focus:ring-primary" />
              <span className="text-body-md text-on-surface">Allow Backlogs</span>
            </label>
          </div>

          <button type="submit" disabled={addJobMutation.isPending} className="w-full py-3 bg-primary-container text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all mt-4">
            Post Job &amp; Notify Eligible Students
          </button>
        </form>
      </SlideOver>

      {/* Eligible Students SlideOver */}
      <SlideOver isOpen={!!eligibleJob} onClose={() => { setEligibleJob(null); setEligibleData(null); }} title={`Eligible Students — ${eligibleJob?.title || ''}`}>
        {eligibleData ? (
          <div>
            <p className="text-body-md text-on-surface-variant mb-4">Total Eligible: <strong>{eligibleData.totalEligible}</strong></p>
            {eligibleData.students?.length === 0 ? <EmptyState icon="person_off" title="No eligible students" /> : (
              <div className="space-y-3">
                {eligibleData.students?.map((s) => (
                  <div key={s._id} className="p-3 bg-[#F8FAFC] rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-body-md font-medium">{s.userId?.name || 'Unknown'}</p>
                      <p className="text-body-sm text-on-surface-variant">{s.rollNo} • {s.branch} • CGPA: {s.cgpa}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : <LoadingSkeleton rows={5} />}
      </SlideOver>
    </div>
  );
}
