import { Icon } from '@/partners/components/ui';
import { setTheme, useTheme } from '@/partners/lib/theme';

const OPTIONS = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'Auto', icon: 'monitor' },
];

// Three-way theme toggle; used in the account menu and on the account pages.
export function ThemeSwitch() {
  const theme = useTheme();

  return (
    <div className="theme-seg" role="radiogroup" aria-label="Theme">
      {OPTIONS.map(o => (
        <button key={o.value} type="button" role="radio" aria-checked={theme === o.value} className={theme === o.value ? 'on' : ''} onClick={() => setTheme(o.value)}>
          <Icon name={o.icon} size="s" />
          {o.label}
        </button>
      ))}
    </div>
  );
}
