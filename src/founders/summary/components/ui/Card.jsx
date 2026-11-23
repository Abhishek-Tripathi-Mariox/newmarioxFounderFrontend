import { useId } from 'react';
import s from './ui.module.css';

/** A titled panel. `lead` sits before the title (e.g. a company mark), `actions` on the right. */
export default function Card({ title, subtitle, lead, actions, className = '', children }) {
  const id = useId();
  return (
    <section aria-labelledby={title ? id : undefined} className={`${s.card} ${className}`}>
      {(title || actions) && (
        <div className={s.cardHead}>
          <div className={s.cardLead}>
            {lead}
            <div className={s.cardTitles}>
              {title && (
                <h2 id={id} className={s.cardTitle}>
                  {title}
                </h2>
              )}
              {subtitle && <span className={s.cardSub}>{subtitle}</span>}
            </div>
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
