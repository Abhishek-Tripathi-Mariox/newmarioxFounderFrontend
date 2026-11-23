import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Returns `replaceUrl(url)`: swaps the current history entry for `url` (path + query + hash) through
 * the router, so the address bar mirrors on-screen state without adding back-button steps.
 */
export function useReplaceUrl() {
  const navigate = useNavigate();
  return useCallback((url) => navigate(url, { replace: true }), [navigate]);
}
