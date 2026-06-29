import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobApplications, getMyApplications, updateApplicationStatus, bulkUpdateStatus } from '../api/applications';
import toast from 'react-hot-toast';

export function useJobApplications(jobId) {
  return useQuery({
    queryKey: ['applications', jobId],
    queryFn: () => getJobApplications(jobId).then((r) => r.data),
    enabled: !!jobId,
  });
}

export function useMyApplications() {
  return useQuery({ queryKey: ['my-applications'], queryFn: () => getMyApplications().then((r) => r.data) });
}

export function useUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status }) => updateApplicationStatus(applicationId, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['applications'] }); toast.success('Status updated'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });
}

export function useBulkUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, rollNumbers, status }) => bulkUpdateStatus(jobId, rollNumbers, status),
    onSuccess: (data) => { qc.invalidateQueries({ queryKey: ['applications'] }); toast.success(data.data.message); },
    onError: (err) => toast.error(err.response?.data?.message || 'Bulk update failed'),
  });
}
