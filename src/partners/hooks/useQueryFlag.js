import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReplaceUrl } from './useReplaceUrl';

// Runs `fn` once if the URL has ?name=1 (used by "Add lead" etc. links from other pages), then cleans the URL.
export function useQueryFlag(name, fn) {
  const replaceUrl = useReplaceUrl();
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get(name) !== '1') return;
    fn();
    params.delete(name);
    const rest = params.toString();
    replaceUrl(pathname + (rest ? `?${rest}` : '') + hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
