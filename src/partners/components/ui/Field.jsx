import { useState,  } from 'react';
import { Icon } from './Icon';
import { Dropdown } from './Dropdown';
import { COUNTRIES, DEFAULT_COUNTRY, countryByIso, formatPhone, parsePhone } from '@/partners/lib/validate';

// error: shown in red under the field (replaces the hint) and outlines the input.

// `custom` renders a div instead of a label, because a <label> wrapping the dropdown button
// would re-open it whenever the label text is clicked.
export function Field({ label, hint, error, children, custom }) {
  if (!label && !hint && !error) return <>{children}</>;
  const Tag = custom ? 'div' : 'label';
  return (
    <Tag className={`field ${error ? 'has-err' : ''}`}>
      {label && <span>{label}</span>}
      {children}
      {error ? <small className="field-err" role="alert">{error}</small> : hint && <small>{hint}</small>}
    </Tag>
  );
}

const inp = (small, extra = '') => ['inp', small && 'sm', extra].filter(Boolean).join(' ');

export function Input({ label, hint, small, error, className = '', ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <input className={inp(small, className)} aria-invalid={error ? true : undefined} {...rest} />
    </Field>
  );
}

// Phone with a country code: pick the country, type the number (digits only, capped at that
// country's length). The value is one string, "+91 9876543210", so forms and the API keep a single field.
export function PhoneInput({ label, hint, small, error, value, onChange, country: prefer, placeholder, required, disabled }) {
  const parsed = parsePhone(String(value ?? ''), prefer);
  const [iso, setIso] = useState((value ? parsed.country : countryByIso(prefer) ?? DEFAULT_COUNTRY).iso);
  const c = countryByIso(iso) ?? parsed.country;
  const digits = parsed.digits;
  const emit = (iso2, d) => onChange?.({ target: { value: formatPhone(countryByIso(iso2) ?? DEFAULT_COUNTRY, d) } });
  return (
    <Field label={label} hint={hint ?? `${c.name}: ${c.len.join(' or ')} digits`} error={error} custom>
      <span className="ph-wrap">
        <Dropdown
          small={small}
          aria-label="Country code"
          value={iso}
          disabled={disabled}
          onChange={v => { setIso(v); emit(v, digits); }}
          options={COUNTRIES.map(x => ({ value: x.iso, label: `${x.flag} +${x.dial}`, hint: x.name }))}
          className="ph-cc"
        />
        <input
          className={inp(small, 'ph-num')}
          inputMode="numeric"
          autoComplete="tel-national"
          aria-label={label ?? 'Phone number'}
          aria-invalid={error ? true : undefined}
          placeholder={placeholder || '9876543210'.slice(0, Math.max(...c.len))}
          maxLength={Math.max(...c.len)}
          required={required}
          disabled={disabled}
          value={digits}
          onChange={e => emit(iso, e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, Math.max(...c.len)))}
        />
      </span>
    </Field>
  );
}

// Password with a show / hide button inside the field.
export function PasswordInput({ label, hint, small, error, className = '', ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} hint={hint} error={error}>
      <span className="pw-wrap">
        <input className={inp(small, className)} type={show ? 'text' : 'password'} {...rest} />
        <button type="button" className="pw-eye" onClick={e => { e.preventDefault(); setShow(s => !s); }} aria-label={show ? 'Hide password' : 'Show password'} title={show ? 'Hide password' : 'Show password'}>
          <Icon name={show ? 'eyeOff' : 'eye'} size="s" />
        </button>
      </span>
    </Field>
  );
}

export function Textarea({ label, hint, small, error, className = '', ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <textarea className={inp(small, className)} aria-invalid={error ? true : undefined} {...rest} />
    </Field>
  );
}

// Custom dropdown (see Dropdown.tsx). Lists longer than 5 options get a search box.
export function Select({ label, hint, small, error, onChange, value, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error} custom>
      <Dropdown small={small} value={value} onChange={v => onChange?.({ target: { value: v } })} {...rest} />
    </Field>
  );
}

// The original portal's animated checkbox.
export function Check({ checked, onChange, label, children }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} aria-label={label} />
      <span className="box">
        <svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" /></svg>
      </span>
      {children}
    </label>
  );
}

// Row-style on/off switch with a title and description.
export function Toggle({ on, onChange, title, sub }) {
  return (
    <button
      type="button"
      className="between"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{ padding: '14px 16px', borderRadius: 14, background: 'var(--panel-2)', boxShadow: '0 0 0 1px var(--line) inset', textAlign: 'left', width: '100%' }}
    >
      <span>
        <b style={{ fontWeight: 600 }}>{title}</b>
        {sub && <span className="sub" style={{ display: 'block' }}>{sub}</span>}
      </span>
      <span className={`toggle ${on ? 'on' : ''}`} />
    </button>
  );
}

export function FormError({ error }) {
  return error ? <div className="form-error">{error}</div> : null;
}
