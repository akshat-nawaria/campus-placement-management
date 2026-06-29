import api from './axios';
export const getJobs = () => api.get('/api/jobs/list');
export const addJob = (data) => api.post('/api/jobs/add', data);
export const getEligibleStudents = (jobId) => api.get(`/api/jobs/${jobId}/eligible-students`);
export const overrideStudent = (jobId, studentId) => api.post(`/api/jobs/${jobId}/override`, { studentId });
