import { api } from './client';

export const listUsers = () => api.get('/users');
export const createUser = ({ name, email, password, seat }) => api.post('/users', { name, email, password, seat });
export const updateUser = (id, { name, email }) => api.patch(`/users/${id}`, { name, email });
export const setUserPassword = (id, password) => api.post(`/users/${id}/password`, { password });
export const removeUser = (id) => api.del(`/users/${id}`);
