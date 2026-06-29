import { useAnalytics } from '../../hooks/useAnalytics';
import StatCard from '../../components/ui/StatCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const { data, isLoading } = useAnalytics();

  if (isLoading) return <LoadingSkeleton type="stats" />;

  const overall = data?.overall || {};
  const branchWise = data?.branchWise || [];
  const barData = branchWise.map((b) => ({ name: b.branch, Total: b.totalStudents, Placed: b.placedStudents }));

  return (
    <div className="space-y-8">
      <h1 className="text-headline-md font-semibold">Analytics</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Total Students" value={overall.totalStudents ?? '—'} icon="groups" />
        <StatCard label="Placed Students" value={overall.placedStudents ?? '—'} icon="emoji_events" />
        <StatCard label="Placement %" value={overall.placementPercentage ?? '—'} icon="percent" />
        <StatCard label="Total Jobs" value={overall.totalJobs ?? '—'} icon="work" />
        <StatCard label="Total Companies" value={overall.totalCompanies ?? '—'} icon="corporate_fare" />
      </div>

      {/* Branch-wise Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(15,23,42,0.08)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-title-md font-semibold">Branch-wise Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                {['Branch', 'Total Students', 'Placed Students', 'Placement %', 'Progress'].map((h) => (
                  <th key={h} className="text-left text-label-md font-medium text-on-surface-variant uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {branchWise.map((b) => (
                <tr key={b.branch} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                  <td className="px-6 py-4 text-body-md font-medium text-on-surface">{b.branch}</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">{b.totalStudents}</td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">{b.placedStudents}</td>
                  <td className="px-6 py-4 text-body-md font-semibold text-primary">{b.percentage}%</td>
                  <td className="px-6 py-4">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary-container rounded-full transition-all duration-500" style={{ width: `${b.percentage}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full-width Bar Chart */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.08)]">
        <h3 className="text-title-md font-semibold mb-6">Branch-wise Placement Chart</h3>
        <ResponsiveContainer width="100%" height={350}>
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
    </div>
  );
}
