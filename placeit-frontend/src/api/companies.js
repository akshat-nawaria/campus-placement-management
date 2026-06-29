import api from './axios';
export const getCompanies = () => api.get('/api/company/list');
export const addCompany = (data) => api.post('/api/company/add', data);
