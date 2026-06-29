import { useState } from 'react';
import { useStudents, useVerifyStudent } from '../../hooks/useStudents';
import StatusBadge from '../../components/ui/StatusBadge';
import SlideOver from '../../components/ui/SlideOver';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { BRANCHES } from '../../utils/constants';

export default function Students() {
  const { data, isLoading } = useStudents();
  const verifyMutation = useVerifyStudent();
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [selected, setSelected] = useState(null);

  if (isLoading) return <LoadingSkeleton rows={8} />;

  const students = (data?.students || [])
    .filter((s) => {
      if (search && !s.userId?.name?.toLowerCase().includes(search.toLowerCase()) && !s.rollNo?.toLowerCase().includes(search.toLowerCase())) return false;
      if (branchFilter && s.branch !== branchFilter) return false;
      if (verifiedFilter === 'verified' && !s.isVerifiedByTPO) return false;
      if (verifiedFilter === 'unverified' && s.isVerifiedByTPO) return false;
      return true;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-headline-md font-semibold">Students</h1>
        <div className="flex flex-wrap gap-3">
          <input type="text" placeholder="Search by name or roll no..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 w-56" />
          <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-body-sm focus:outline-none focus:border-primary">
            <option value="">All Branches</option>
            {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-body-sm focus:outline-none focus:border-primary">
            <option value="">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {students.length === 0 ? (
        <EmptyState icon="school" title="No students found" subtitle="Try adjusting your filters." />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(15,23,42,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  {['#', 'Name', 'Roll No', 'Branch', 'CGPA', 'Backlogs', 'Year', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-label-md font-medium text-on-surface-variant uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s._id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-xs font-semibold text-on-primary-fixed-variant">
                          {(s.userId?.name || 'U')[0]}
                        </div>
                        <span className="text-body-md font-medium text-on-surface">{s.userId?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{s.rollNo}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{s.branch}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{s.cgpa}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{s.backlogCount}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{s.passingYear}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.isVerifiedByTPO ? 'Verified' : 'Pending'} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!s.isVerifiedByTPO && (
                          <button onClick={() => verifyMutation.mutate(s._id)} className="px-3 py-1 bg-primary-container text-white text-xs font-semibold rounded-lg hover:opacity-90">Verify</button>
                        )}
                        <button onClick={() => setSelected(s)} className="px-3 py-1 border border-[#E2E8F0] text-on-surface text-xs font-semibold rounded-lg hover:bg-[#F1F5F9]">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Detail SlideOver */}
      <SlideOver isOpen={!!selected} onClose={() => setSelected(null)} title="Student Profile">
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-xl font-bold text-on-primary-fixed-variant">
                {(selected.userId?.name || 'U')[0]}
              </div>
              <div>
                <h3 className="text-title-lg font-semibold">{selected.userId?.name || 'Unknown'}</h3>
                <p className="text-body-sm text-on-surface-variant">{selected.userId?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Roll No', selected.rollNo],
                ['Branch', selected.branch],
                ['CGPA', selected.cgpa],
                ['Backlogs', selected.backlogCount],
                ['Passing Year', selected.passingYear],
                ['Verified', selected.isVerifiedByTPO ? 'Yes' : 'No'],
                ['Offer Accepted', selected.hasAcceptedOffer ? 'Yes' : 'No'],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-label-md text-on-surface-variant uppercase tracking-wider">{label}</p>
                  <p className="text-body-md font-medium text-on-surface mt-1">{val ?? '—'}</p>
                </div>
              ))}
            </div>
            {selected.resumeUrl && (
              <a href={`${import.meta.env.VITE_API_BASE_URL}/${selected.resumeUrl}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed text-on-primary-fixed-variant rounded-lg text-sm font-medium hover:opacity-90">
                <span className="material-symbols-outlined text-sm">description</span> View Resume
              </a>
            )}
          </div>
        )}
      </SlideOver>
    </div>
  );
}
