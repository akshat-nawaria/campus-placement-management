import api from './axios';

export const getMyProfile = () => api.get('/api/students/profile');
export const upsertProfile = (formData) =>
  api.post('/api/students/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const verifyStudent = (studentId) => api.put(`/api/students/${studentId}/verify`);
export const getAllStudents = () => api.get('/api/students');
