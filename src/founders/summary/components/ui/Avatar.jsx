import { initials } from '@/founders/summary/lib/format';
import s from './ui.module.css';

export default function Avatar({ name, hue = 265, size = 28 }) {
  return (
    <span
      aria-hidden="true"
      className={s.avatar}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.37), background: `oklch(0.52 0.13 ${hue})` }}
    >
      {initials(name)}
    </span>
  );
}
