import { api } from './client';

/** `{ data, version, updatedAt, updatedBy }`; data is null before the first save. */
export const fetchWorkspace = () => api.get('/workspace');
/** Rejects with a 409 ApiError (details = the newer copy) when someone saved since `baseVersion`. */
export const saveWorkspace = (data, baseVersion) => api.put('/workspace', { data, baseVersion });

export const fetchPrefs = () => api.get('/workspace/prefs');
export const savePrefs = (prefs) => api.put('/workspace/prefs', { prefs });
