import { TabLink } from '@/founders/summary/lib/TabLink';
import { useSummaries } from '@/founders/summary/state/summaryContext';
import CompanyMark from '@/founders/summary/components/ui/CompanyMark';
import Pill from '@/founders/summary/components/ui/Pill';
import p from '@/founders/summary/styles/page.module.css';

/** Page title block. `backTo` turns the eyebrow into a link; `mark` shows a company tile. */
export default function PageHeader({ eyebrow, backTo, mark, title, lede, actions }) {
  const { sample } = useSummaries();
  return (
    <header className={p.header}>
      <div className={p.headText}>
        {backTo ? (
          <TabLink to={backTo} className={p.backLink}>
            {eyebrow}
          </TabLink>
        ) : (
          eyebrow && <span className={p.eyebrow}>{eyebrow}</span>
        )}
        <div className={p.titleRow}>
          {mark && <CompanyMark company={mark} />}
          <h1 className={p.title}>{title}</h1>
        </div>
        <div className={p.lede}>
          {lede && <span>{lede}</span>}
          {sample && (
            <Pill tone="sample" square>
              Sample data
            </Pill>
          )}
        </div>
      </div>
      {actions && <div className={p.controls}>{actions}</div>}
    </header>
  );
}
