import { ICONS } from './icons';

export function Icon({ name, size }) {
  return (
    <svg className={`i ${size ?? ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

