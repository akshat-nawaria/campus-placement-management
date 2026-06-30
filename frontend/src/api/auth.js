import api from './axios';
export const googleLogin = (tokenId) => api.post('/api/auth/google', { tokenId });
export const emailLogin = (credentials) => api.post('/api/auth/login', credentials);
export const registerUser = (userData) => api.post('/api/auth/register', userData);
