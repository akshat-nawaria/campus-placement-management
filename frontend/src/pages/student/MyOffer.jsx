import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyOffer, acceptOffer } from '../../api/offers';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

export default function MyOffer() {
  const { data, isLoading } = useQuery({ queryKey: ['my-offer'], queryFn: () => getMyOffer().then((r) => r.data).catch(() => null) });
  const qc = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  const acceptMutation = useMutation({
    mutationFn: () => acceptOffer(data?.offer?._id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-offer'] }); qc.invalidateQueries({ queryKey: ['my-profile'] }); toast.success('Offer accepted! Congratulations!'); setShowConfirm(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to accept offer'),
  });

  if (isLoading) return <LoadingSkeleton type="cards" rows={1} />;

  const offer = data?.offer;

  if (!offer) {
    return (
      <div className="space-y-6">
        <h1 className="text-headline-md font-semibold">My Offer</h1>
        <EmptyState icon="card_giftcard" title="No offers yet" subtitle="Keep applying and performing well in your interviews!" />
      </div>
    );
  }

  const isAccepted = offer.status === 'Accepted';

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md font-semibold">My Offer</h1>

      <div className={`rounded-2xl border-2 p-8 ${isAccepted ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
        {/* Status Icon */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${isAccepted ? 'bg-green-100' : 'bg-amber-100'}`}>
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1", color: isAccepted ? '#16A34A' : '#D97706' }}>
              {isAccepted ? 'celebration' : 'card_giftcard'}
            </span>
          </div>
          <h2 className={`text-headline-lg font-bold ${isAccepted ? 'text-green-800' : 'text-amber-800'}`}>
            {isAccepted ? 'Offer Accepted! 🎉' : 'You have an offer!'}
          </h2>
          <p className={`text-body-md mt-1 ${isAccepted ? 'text-green-700' : 'text-amber-700'}`}>
            {isAccepted ? 'Congratulations on your placement!' : 'Review the details below and accept when ready.'}
          </p>
        </div>

        {/* Offer Details Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0px_1px_3px_rgba(15,23,42,0.08)] p-6 max-w-lg mx-auto">
          <div className="space-y-4">
            {[
              ['Company', offer.companyId?.name, 'corporate_fare'],
              ['Position', offer.jobId?.title, 'work'],
              ['Package', offer.package, 'payments'],
              ['Status', offer.status, 'info'],
              ['Issued On', formatDate(offer.createdAt), 'calendar_today'],
            ].map(([label, val, icon]) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-[#E2E8F0] last:border-0">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  <span className="text-body-sm">{label}</span>
                </div>
                <span className={`text-body-md font-semibold ${label === 'Package' ? 'text-primary' : 'text-on-surface'}`}>{val || '—'}</span>
              </div>
            ))}
          </div>

          {/* Accept Button */}
          {!isAccepted && (
            <div className="mt-6">
              <button onClick={() => setShowConfirm(true)}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">check_circle</span>
                Accept Offer
              </button>
              <p className="text-center text-body-sm text-amber-700 mt-3">
                ⚠️ Accepting this offer is permanent — you won&apos;t be able to apply elsewhere.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Single-Offer Policy Warning Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => acceptMutation.mutate()}
        title="Accept Offer — Single-Offer Policy"
        message={`By accepting this offer from ${offer.companyId?.name}, you acknowledge that this action is irreversible. You will no longer be able to apply to other jobs or receive new offers. Are you sure you want to proceed?`}
        confirmLabel={acceptMutation.isPending ? 'Accepting...' : 'Yes, Accept Offer'}
        confirmVariant="default"
      />
    </div>
  );
}
