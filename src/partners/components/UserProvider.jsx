import { createContext, useContext } from 'react';
import { useApi } from '@/partners/hooks/useApi';

const UserCtx = createContext({ user: null, reload: async () => {} });

export function UserProvider({ children }) {
  const { data, reload } = useApi('/me');
  return <UserCtx.Provider value={{ user: data?.user ?? null, reload }}>{children}</UserCtx.Provider>;
}

export const useUser = () => useContext(UserCtx);

