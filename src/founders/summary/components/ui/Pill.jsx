import s from './ui.module.css';

/** Tones: good | bad | warn | info | flat | violet | sample | mariox | partners */
export default function Pill({ tone = 'flat', square = false, className = '', children }) {
  return <span className={`${s.pill} ${s[tone] || s.flat} ${square ? s.square : ''} ${className}`}>{children}</span>;
}
