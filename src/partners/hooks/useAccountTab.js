import { useSearchParams } from 'react-router-dom';

/**
 * Profile / security tab, linkable as ?tab=security (used by the account menu).
 * The tab lives in the URL, so the account-menu links, back/forward and refresh all agree.
 */
export function useAccountTab() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'security' ? 'security' : 'profile';

  const setTab = (t) => {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      if (t === 'security') next.set('tab', 'security');
      else next.delete('tab');
      return next;
    }, { replace: true });
  };
  return [tab, setTab];
}
