import { api } from './client';

/** The signed-in person's Founders HQ account (401 = no Mariox session, 403 = no HQ seat). */
export const fetchCurrentUser = async () => (await api.get('/auth/me')).user;
/** Changes the person's Mariox password (the one they sign in with everywhere). */
export const changeOwnPassword = (currentPassword, newPassword) => api.post('/auth/change-password', { currentPassword, newPassword });
