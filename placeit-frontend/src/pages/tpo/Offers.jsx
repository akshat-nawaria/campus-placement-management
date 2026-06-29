import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllOffers, issueOffer } from '../../api/offers';
import { getCompanies } from '../../api/companies';
import { getJobs } from '../../api/jobs';
import { getAllStudents } from '../../api/students';
import StatusBadge from '../../components/ui/StatusBadge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

export default function Offers() {
  const { data, isLoading } = useQuery({ queryKey: ['offers'], queryFn: () => getAllOffers().then((r) => r.data) });
  const { data: studentsData } = useQuery({ queryKey: ['students'], queryFn: () => getAllStudents().then((r) => r.data) });
  const { data: companiesData } = useQuery({ queryKey: ['companies'], queryFn: () => getCompanies().then((r) => r.data) });
  const { data: jobsData } = useQuery({ queryKey: ['jobs'], queryFn: () => getJobs().then((r) => r.data) });
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentId: '', companyId: '', jobId: '', package: '' });

  const issueMutation = useMutation({
    mutationFn: issueOffer,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['offers'] }); toast.success('Offer issued!'); setShowForm(false); setForm({ studentId: '', companyId: '', jobId: '', package: '' }); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to issue offer'),
  });

  if (isLoading) return <LoadingSkeleton rows={6} />;
  const offers = data?.offers || [];
  const students = studentsData?.students || [];
  const companies = companiesData?.companies || [];
  const jobs = jobsData?.jobs || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md font-semibold">Offers</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white text-sm font-semibold rounded-lg hover:opacity-90">
          <span className="material-symbols-outlined text-[18px]">add</span> Issue Offer
        </button>
      </div>

      {offers.length === 0 ? (
        <EmptyState icon="assignment_turned_in" title="No offers issued" subtitle="Issue your first offer to a selected student." actionLabel="Issue Offer" onAction={() => setShowForm(true)} />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(15,23,42,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  {['Student', 'Roll No', 'Company', 'Job Title', 'Package', 'Status', 'Issued On'].map((h) => (
                    <th key={h} className="text-left text-label-md font-medium text-on-surface-variant uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o._id} className={`border-b border-[#E2E8F0] hover:bg-[#F8FAFC] ${o.status === 'Accepted' ? 'bg-green-50' : ''}`}>
                    <td className="px-4 py-3 text-body-md font-medium">{o.studentId?.userId?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{o.studentId?.rollNo || '—'}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{o.companyId?.name || '—'}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{o.jobId?.title || '—'}</td>
                    <td className="px-4 py-3 text-body-md font-semibold text-primary">{o.package}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Issue Offer Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <form onSubmit={(e) => { e.preventDefault(); issueMutation.mutate(form); }} className="relative bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full mx-4">
            <h3 className="text-title-lg font-semibold mb-6">Issue New Offer</h3>
            <div className="space-y-4">
              <div><label className="block text-label-md text-on-surface-variant mb-1">Student *</label>
                <select required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary">
                  <option value="">Select student</option>
                  {students.map((s) => <option key={s._id} value={s._id}>{s.userId?.name || 'Unknown'} — {s.rollNo}</option>)}
                </select></div>
              <div><label className="block text-label-md text-on-surface-variant mb-1">Company *</label>
                <select required value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary">
                  <option value="">Select company</option>
                  {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select></div>
              <div><label className="block text-label-md text-on-surface-variant mb-1">Job *</label>
                <select required value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary">
                  <option value="">Select job</option>
                  {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
                </select></div>
              <div><label className="block text-label-md text-on-surface-variant mb-1">Package *</label>
                <input required placeholder="e.g., 15 LPA" value={form.package} onChange={(e) => setForm({ ...form, package: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-semibold hover:bg-[#F1F5F9]">Cancel</button>
              <button type="submit" disabled={issueMutation.isPending} className="px-5 py-2.5 bg-primary-container text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">Issue Offer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
