import s from './ui.module.css';

export default function CompanyMark({ company }) {
  const mariox = company === 'mariox';
  return (
    <span aria-hidden="true" className={`${s.mark} ${mariox ? s.markMariox : s.markPartners}`}>
      {mariox ? 'M' : 'P'}
    </span>
  );
}
