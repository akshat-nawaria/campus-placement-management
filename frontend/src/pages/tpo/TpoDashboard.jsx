import { useAnalytics } from '../../hooks/useAnalytics';
import { useStudents, useVerifyStudent } from '../../hooks/useStudents';
import StatCard from '../../components/ui/StatCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import StatusBadge from '../../components/ui/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function TpoDashboard() {
  const { data: analytics, isLoading } = useAnalytics();
  const { data: studentsData } = useStudents();
  const verifyMutation = useVerifyStudent();

  if (isLoading) return <LoadingSkeleton type="stats" />;

  const overall = analytics?.overall || {};
  const branchWise = analytics?.branchWise || [];

  const barData = branchWise.map((b) => ({ name: b.branch, Total: b.totalStudents, Placed: b.placedStudents }));

  const placed = overall.placedStudents || 0;
  const remaining = (overall.totalStudents || 0) - placed;
  const pieData = [
    { name: 'Placed', value: placed },
    { name: 'Remaining', value: remaining },
  ];
  const PIE_COLORS = ['#2563EB', '#E2E8F0'];

  const unverified = (studentsData?.students || []).filter((s) => !s.isVerifiedByTPO).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Verified Students" value={overall.totalStudents ?? '—'} icon="verified_user" />
        <StatCard label="Placed Students" value={overall.placedStudents ?? '—'} icon="emoji_events" />
        <StatCard label="Placement %" value={overall.placementPercentage ?? '—'} icon="percent" />
        <StatCard label="Open Jobs" value={overall.totalJobs ?? '—'} icon="work" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.08)]">
          <h3 className="text-title-md font-semibold text-on-surface mb-6">Branch-wise Placement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#737686' }} />
              <YAxis tick={{ fontSize: 12, fill: '#737686' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Total" fill="#BFDBFE" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Placed" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.08)]">
          <h3 className="text-title-md font-semibold text-on-surface mb-6">Overall Statistics</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" stroke="none">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center -mt-4">
            <p className="text-headline-md font-bold text-primary">{overall.placementPercentage || '0%'}</p>
            <p className="text-label-md text-on-surface-variant uppercase tracking-wider">Success Rate</p>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
              <span className="text-body-sm text-on-surface-variant">Placed: {placed}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E2E8F0]" />
              <span className="text-body-sm text-on-surface-variant">Remaining: {remaining}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Verifications */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(15,23,42,0.08)]">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-title-md font-semibold text-on-surface">Pending Student Verifications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left text-label-md font-medium text-on-surface-variant uppercase tracking-wider px-6 py-3">Student</th>
                <th className="text-left text-label-md font-medium text-on-surface-variant uppercase tracking-wider px-6 py-3">Roll No</th>
                <th className="text-left text-label-md font-medium text-on-surface-variant uppercase tracking-wider px-6 py-3">CGPA</th>
                <th className="text-left text-label-md font-medium text-on-surface-variant uppercase tracking-wider px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {unverified.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant text-body-md">No pending verifications</td></tr>
              ) : (
                unverified.map((s) => (
                  <tr key={s._id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-xs font-semibold text-on-primary-fixed-variant">
                          {(s.userId?.name || 'U')[0]}
                        </div>
                        <span className="text-body-md font-medium text-on-surface">{s.userId?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-body-md text-on-surface-variant">{s.rollNo}</td>
                    <td className="px-6 py-3 text-body-md text-on-surface-variant">{s.cgpa}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => verifyMutation.mutate(s._id)}
                        disabled={verifyMutation.isPending}
                        className="px-4 py-1.5 bg-primary-container text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        Verify
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
