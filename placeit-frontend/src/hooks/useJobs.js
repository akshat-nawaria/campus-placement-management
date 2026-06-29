import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, addJob } from '../api/jobs';
import toast from 'react-hot-toast';

export function useJobs() {
  return useQuery({ queryKey: ['jobs'], queryFn: () => getJobs().then((r) => r.data) });
}

export function useAddJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addJob,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['jobs'] }); toast.success('Job posted successfully!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to post job'),
  });
}
