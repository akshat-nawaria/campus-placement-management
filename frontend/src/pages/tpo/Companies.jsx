import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompanies, addCompany } from '../../api/companies';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function Companies() {
  const { data, isLoading } = useQuery({ queryKey: ['companies'], queryFn: () => getCompanies().then((r) => r.data) });
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', industry: '', description: '', website: '', hrContacts: [{ name: '', email: '', phone: '' }] });
  const [expandedHR, setExpandedHR] = useState(null);

  const addMutation = useMutation({
    mutationFn: addCompany,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['companies'] }); toast.success('Company added!'); setShowForm(false); setForm({ name: '', industry: '', description: '', website: '', hrContacts: [{ name: '', email: '', phone: '' }] }); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add company'),
  });

  const handleSubmit = (e) => { e.preventDefault(); addMutation.mutate(form); };
  const addHR = () => setForm({ ...form, hrContacts: [...form.hrContacts, { name: '', email: '', phone: '' }] });
  const updateHR = (i, field, val) => { const hrs = [...form.hrContacts]; hrs[i][field] = val; setForm({ ...form, hrContacts: hrs }); };

  if (isLoading) return <LoadingSkeleton type="cards" rows={6} />;

  const companies = data?.companies || [];
  const colors = ['bg-primary-container', 'bg-tertiary-container', 'bg-secondary-container', 'bg-primary', 'bg-tertiary', 'bg-secondary'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md font-semibold">Companies</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-[18px]">add</span> Add Company
        </button>
      </div>

      {companies.length === 0 ? (
        <EmptyState icon="corporate_fare" title="No companies yet" subtitle="Add your first company to get started." actionLabel="Add Company" onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((c, i) => (
            <div key={c._id} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0px_1px_3px_rgba(15,23,42,0.08)] hover:border-[#CBD5E1] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white text-sm font-bold`}>
                  {c.name[0]}
                </div>
                <div>
                  <h3 className="text-title-md font-semibold text-on-surface">{c.name}</h3>
                  {c.industry && <span className="text-label-md text-on-surface-variant">{c.industry}</span>}
                </div>
              </div>
              {c.description && <p className="text-body-sm text-on-surface-variant mb-4 line-clamp-2">{c.description}</p>}
              {c.website && (
                <a href={c.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary text-body-sm hover:underline mb-4">
                  <span className="material-symbols-outlined text-sm">language</span> Website
                </a>
              )}
              <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                <button onClick={() => setExpandedHR(expandedHR === c._id ? null : c._id)} className="flex items-center gap-1 text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">contacts</span>
                  {c.hrContacts?.length || 0} HR Contact(s)
                  <span className="material-symbols-outlined text-sm">{expandedHR === c._id ? 'expand_less' : 'expand_more'}</span>
                </button>
                {expandedHR === c._id && c.hrContacts?.map((hr, j) => (
                  <div key={j} className="mt-3 p-3 bg-[#F8FAFC] rounded-lg">
                    <p className="text-body-sm font-medium">{hr.name}</p>
                    <p className="text-body-sm text-on-surface-variant">{hr.email}</p>
                    {hr.phone && <p className="text-body-sm text-on-surface-variant">{hr.phone}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Company Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <form onSubmit={handleSubmit} className="relative bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-title-lg font-semibold mb-6">Add New Company</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1">Company Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1">Industry *</label>
                <input required value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1">Website</label>
                <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-label-md text-on-surface-variant">HR Contacts</label>
                  <button type="button" onClick={addHR} className="text-primary text-body-sm font-medium hover:underline">+ Add Contact</button>
                </div>
                {form.hrContacts.map((hr, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                    <input placeholder="Name" value={hr.name} onChange={(e) => updateHR(i, 'name', e.target.value)}
                      className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary" />
                    <input placeholder="Email" value={hr.email} onChange={(e) => updateHR(i, 'email', e.target.value)}
                      className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary" />
                    <input placeholder="Phone" value={hr.phone} onChange={(e) => updateHR(i, 'phone', e.target.value)}
                      className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-semibold hover:bg-[#F1F5F9]">Cancel</button>
              <button type="submit" disabled={addMutation.isPending} className="px-5 py-2.5 bg-primary-container text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
