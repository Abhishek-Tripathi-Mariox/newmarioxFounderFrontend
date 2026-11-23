import { useLocation, useNavigate } from 'react-router-dom';
import { TOOLKIT_TABS } from '@/partners/components/nav';
import { Tabs } from '@/partners/components/ui';

// Segmented switcher between the four toolkit pages.
export function ToolkitNav() {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  return <div><Tabs tabs={TOOLKIT_TABS} value={path} onChange={v => navigate(v)} /></div>;
}
