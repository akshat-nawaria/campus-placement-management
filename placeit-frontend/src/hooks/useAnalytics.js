import { useQuery } from '@tanstack/react-query';
import { getDashboardAnalytics } from '../api/analytics';

export function useAnalytics() {
  return useQuery({ queryKey: ['analytics'], queryFn: () => getDashboardAnalytics().then((r) => r.data) });
}
