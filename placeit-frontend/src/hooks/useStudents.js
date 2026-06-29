import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllStudents, verifyStudent } from '../api/students';
import toast from 'react-hot-toast';

export function useStudents() {
  return useQuery({ queryKey: ['students'], queryFn: () => getAllStudents().then((r) => r.data) });
}

export function useVerifyStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: verifyStudent,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['students'] }); toast.success('Student verified!'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Verification failed'),
  });
}
