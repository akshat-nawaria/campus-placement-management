import api from './axios';
export const googleLogin = (tokenId) => api.post('/api/auth/google', { tokenId });
