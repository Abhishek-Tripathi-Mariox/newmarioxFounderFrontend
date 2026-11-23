import Card from '@/founders/summary/components/ui/Card';
import BarList from '@/founders/summary/components/ui/BarList';
import { lakh, plural } from '@/founders/summary/lib/format';

/** Open partner leads per stage of the partner portal's pipeline. */
export default function PartnerPipeline({ pipeline }) {
  const stages = pipeline?.stages;
  if (!stages?.length) return null;
  return (
    <Card title="Partner pipeline by stage" subtitle={`${plural(pipeline.open, 'open deal')} · ${lakh(pipeline.value)}`}>
      <BarList
        color="var(--partners)"
        height={12}
        labelWidth={110}
        rows={stages.map((s) => ({ key: s.key, label: s.name, value: s.value, right: `${s.count} · ${lakh(s.value)}` }))}
      />
    </Card>
  );
}
