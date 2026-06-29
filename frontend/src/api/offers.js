import api from './axios';
export const issueOffer = (data) => api.post('/api/offers/issue', data);
export const acceptOffer = (offerId) => api.put(`/api/offers/${offerId}/accept`);
export const getMyOffer = () => api.get('/api/offers/my');
export const getAllOffers = () => api.get('/api/offers');
