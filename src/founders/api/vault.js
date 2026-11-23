import { api } from './client';

/** The sealed vault `{ salt, iv, ct }` (base64), or null when none was created yet. */
export const fetchVault = () => api.get('/vault');
export const saveVault = (sealed) => api.put('/vault', sealed);
