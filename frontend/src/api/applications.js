import api from './axios';
export const applyToJob = (jobId, coverLetter) => api.post(`/api/applications/${jobId}/apply`, { coverLetter });
export const getJobApplications = (jobId) => api.get(`/api/applications/job/${jobId}`);
export const getMyApplications = () => api.get('/api/applications/student');
export const updateApplicationStatus = (applicationId, status) =>
  api.put(`/api/applications/${applicationId}/status`, { status });
export const bulkUpdateStatus = (jobId, rollNumbers, status) =>
  api.put(`/api/applications/job/${jobId}/bulk-status`, { rollNumbers, status });
