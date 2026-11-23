import { createContext, useContext } from 'react';
import { useApi } from '@/partners/hooks/useApi';
import { DEFAULT_PIPELINE } from '@/partners/lib/pipeline';

const FALLBACK = { contacts: [], announcement: '', pipeline: DEFAULT_PIPELINE };

const SettingsCtx = createContext({ settings: FALLBACK, loaded: false, reload: async () => {} });

// Loads portal settings once per session so every screen uses the admin's pipeline config.
export function SettingsProvider({ children }) {
  const { data, reload } = useApi('/settings');
  return <SettingsCtx.Provider value={{ settings: data?.settings ?? FALLBACK, loaded: !!data, reload }}>{children}</SettingsCtx.Provider>;
}

export const useSettings = () => useContext(SettingsCtx);
export const usePipeline = () => useContext(SettingsCtx).settings.pipeline;
