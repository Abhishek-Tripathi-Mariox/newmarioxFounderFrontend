import s from './ui.module.css';

/** Small number tile: big value, label, optional note. */
export default function Tile({ value, label, note, alert = false, outline = false, background }) {
  return (
    <div className={`${s.tile} ${outline ? s.tileOutline : ''}`} style={background ? { background } : undefined}>
      <span className={`${s.tileNum} num`} style={alert ? { color: 'var(--red)' } : undefined}>
        {value}
      </span>
      <span className={s.tileLabel}>{label}</span>
      {note && <span className={s.tileNote}>{note}</span>}
    </div>
  );
}
