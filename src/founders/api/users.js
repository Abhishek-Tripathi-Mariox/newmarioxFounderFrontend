import { api } from './client';

export const listUsers = () => api.get('/users');
/** New HQ account (Super Admin): `role` 'founder' | 'cofounder' — any number of each. */
export const createUser = ({ name, email, password, role }) => api.post('/users', { name, email, password, role });
export const updateUser = (id, { name, email, role }) => api.patch(`/users/${id}`, { name, email, ...(role ? { role } : {}) });
export const setUserPassword = (id, password) => api.post(`/users/${id}/password`, { password });
export const removeUser = (id) => api.del(`/users/${id}`);
