import { Button, Chips, FormError, Input, PhoneInput, Select, Textarea, Toggle } from '@/partners/components/ui';
import { useForm } from '@/partners/hooks/useForm';
import { R, all, istToday } from '@/partners/lib/validate';
import { inr } from '@/partners/lib/format';

// The rule a field is checked with: required + its type's rule + its own rule.
const dayOf = (d) => (d === 'today' ? istToday() : d);
function ruleOf(f) {
  const min = dayOf(f.min);
  const byType =
    f.type === 'email' ? R.email
    : f.type === 'tel' ? R.phone
    : f.type === 'date' ? (v => R.date(v) ?? (min && v && v < min ? (f.min === 'today' ? "Date can't be in the past" : `Pick ${min.split('-').reverse().join('-')} or later`) : null) ?? (f.max && v && v > f.max ? 'That date is too far ahead' : null))
    : f.type === 'number' ? (v => (v && !(Number(v) >= 0) ? 'Enter a number of 0 or more' : null))
    : undefined;
  const label = f.label.replace(/\s*\*$/, '');
  if (!f.required && !byType && !f.rule) return undefined;
  return all(f.required && f.type !== 'checkbox' && f.type !== 'lines' ? R.required(label) : undefined, byType, f.rule);
}

// Scope line items: each filled line needs a module name in words and an amount.
function linesError(lines) {
  for (const [i, l] of lines.entries()) {
    if (!l.name.trim() && !l.amount) continue;
    if (R.words(2, 120)(l.name.trim()) || !l.name.trim()) return `Line ${i + 1}: name the module in words`;
    if (!(l.amount > 0) || l.amount > 1e10) return `Line ${i + 1}: enter an amount above ₹0`;
  }
  return null;
}

export function initialValues(fields, overrides = {}) {
  const v = {};
  for (const f of fields) {
    v[f.name] =
      f.type === 'number' ? 0
      : f.type === 'checkbox' ? false
      : f.type === 'lines' ? [{ name: '', amount: 0 }]
      : f.type === 'select' || f.type === 'chips' ? f.options?.[0] ?? ''
      : '';
  }
  for (const [k, val] of Object.entries(overrides)) if (val !== undefined && val !== null) v[k] = val;
  return v;
}

// Line items with a running total, used by scope submissions.
function LinesInput({ value, onChange }) {
  const update = (i, patch) => onChange(value.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const total = value.reduce((a, l) => a + (Number(l.amount) || 0), 0);
  return (
    <div className="lines">
      {value.map((l, i) => (
        <div key={i} className="row">
          <input className="inp sm" placeholder="Module, e.g. Admin panel" value={l.name} onChange={e => update(i, { name: e.target.value })} />
          <input className="inp sm r num" type="number" min={0} style={{ maxWidth: 160 }} placeholder="Amount" value={l.amount || ''} onChange={e => update(i, { amount: Number(e.target.value) })} />
          <Button type="button" size="sm" variant="ghost" icon="x" onClick={() => onChange(value.filter((_, j) => j !== i))} disabled={value.length === 1} aria-label="Remove line" />
        </div>
      ))}
      <div className="between">
        <Button type="button" size="sm" icon="plus" onClick={() => onChange([...value, { name: '', amount: 0 }])}>Add line</Button>
        <span className="row"><span className="sub">Total</span><b className="num earn">{inr(total)}</b></span>
      </div>
    </div>
  );
}

// Renders any form from a field list. Used for leads, requests, kit files, partners and profile.
export function DynamicForm({ fields, initial, submitLabel = 'Save', onSubmit, onCancel, resetOnSubmit, optionLabel, submitIcon = 'send', columns }) {
  const rules = Object.fromEntries(fields.map(f => [f.name, ruleOf(f)]).filter(([, r]) => r));
  const form = useForm(initialValues(fields, initial), rules);
  const opts = (f) => ((f.optionsWhen?.(form.values) ?? f.options) || []).map(o => ({ value: o, label: optionLabel?.[f.name]?.(o) ?? o }));
  const full = (f) => f.full || ['textarea', 'lines', 'chips', 'checkbox'].includes(f.type ?? '');

  return (
    // noValidate: our rules (lib/validate.ts) show every problem under its field at once,
    // instead of the browser stopping at the first one with a tooltip.
    <form
      className="stack"
      style={{ gap: 18 }}
      noValidate
      onSubmit={form.submit(async v => {
        for (const f of fields) if (f.type === 'lines') { const e = linesError(v[f.name]); if (e) throw new Error(e); }
        const cross = fields.flatMap(f => { const e = f.check?.(v); return e ? [[f.name, e]] : []; });
        if (cross.length) { form.setErrors(Object.fromEntries(cross)); throw new Error(cross[0][1]); }
        await onSubmit(v);
        if (resetOnSubmit) form.reset();
      })}
    >
      <div className="grid-f" style={columns ? { gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`, gap: 12 } : undefined}>
        {fields.map(f => {
          const common = { label: f.label, required: f.required, placeholder: f.placeholder, hint: f.hint, error: form.errors[f.name] ?? null };
          const value = form.values[f.name];
          const set = (v) => form.set(f.name, v);
          let el;
          switch (f.type) {
            case 'select':
              el = <Select {...common} options={opts(f)} value={String(value ?? '')} onChange={e => set(e.target.value)} />;
              break;
            case 'chips':
              el = (
                <div className="field">
                  <span>{f.label}</span>
                  <Chips tabs={opts(f)} value={String(value ?? '')} onChange={set} />
                </div>
              );
              break;
            case 'textarea':
              el = <Textarea {...common} rows={3} value={String(value ?? '')} onChange={e => set(e.target.value)} />;
              break;
            case 'checkbox':
              el = <Toggle on={Boolean(value)} onChange={set} title={f.label} sub={f.hint} />;
              break;
            case 'lines':
              el = (
                <div className="field">
                  <span>{f.label}</span>
                  <LinesInput value={value} onChange={set} />
                </div>
              );
              break;
            case 'number':
              el = <Input {...common} type="number" min={0} className="num" value={Number(value) || ''} onChange={e => set(Number(e.target.value))} />;
              break;
            case 'tel':
              el = <PhoneInput {...common} country={f.country} value={String(value ?? '')} onChange={e => set(e.target.value)} />;
              break;
            case 'date':
              el = <Input {...common} type="date" min={dayOf(f.min) ?? '2000-01-01'} max={f.max ?? '2100-12-31'} value={String(value ?? '')} onChange={e => set(e.target.value)} />;
              break;
            default:
              el = <Input {...common} type={f.type || 'text'} value={String(value ?? '')} onChange={e => set(e.target.value)} />;
          }
          return (
            <div key={f.name} style={full(f) ? { gridColumn: '1 / -1' } : undefined}>
              {el}
            </div>
          );
        })}
      </div>
      <FormError error={form.error} />
      <div className="form-foot">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button variant="fire" icon={submitIcon} loading={form.busy}>{submitLabel}</Button>
      </div>
    </form>
  );
}
