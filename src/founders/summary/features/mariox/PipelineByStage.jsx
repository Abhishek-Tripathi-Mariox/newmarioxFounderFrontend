import Card from '@/founders/summary/components/ui/Card';
import BarList from '@/founders/summary/components/ui/BarList';
import { pipelineTotals } from '@/founders/summary/domain/mariox';
import { lakh, plural } from '@/founders/summary/lib/format';
import p from '@/founders/summary/styles/page.module.css';

export default function PipelineByStage({ sales, quotes }) {
  const open = pipelineTotals(sales.stages);
  const won = sales.won.month;
  const lost = sales.lost.month;

  return (
    <Card title="Open pipeline by stage" subtitle={`${plural(open.count, 'deal')} · ${lakh(open.value)}`}>
      <BarList
        color="var(--mariox)"
        height={12}
        labelWidth={110}
        rows={sales.stages.map((s) => ({ key: s.key, label: s.name, value: s.value, right: `${s.count} · ${lakh(s.value)}` }))}
      />
      <div className={p.inlineStats}>
        <span>
          Won this month <strong style={{ color: 'var(--good-fg)' }}>{won.deals} · {lakh(won.value)}</strong>
        </span>
        <span>
          Lost this month <strong style={{ color: 'var(--bad-fg)' }}>{lost.deals} · {lakh(lost.value)}</strong>
        </span>
        {quotes && (
          <span>
            Quotes waiting on clients <strong>{quotes.waiting.count} · {lakh(quotes.waiting.value)}</strong>
          </span>
        )}
        {quotes && (
          <span>
            Quotes accepted this month <strong>{quotes.acceptedMonth.count} · {lakh(quotes.acceptedMonth.value)}</strong>
          </span>
        )}
        {sales.lost.topReason && (
          <span>
            Top lost reason <strong>{sales.lost.topReason}</strong>
          </span>
        )}
      </div>
    </Card>
  );
}
