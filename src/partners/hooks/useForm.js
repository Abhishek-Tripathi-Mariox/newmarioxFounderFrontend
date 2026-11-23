import { useCallback, useState } from 'react';

// Small form state helper: values, a field binder and a submit wrapper with busy/error state.
// With `rules`, every field is checked before submit and errors show under the fields (bind passes `error`).
export function useForm(initial, rules = {}) {
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const set = useCallback((key, value) => {
    setValues(v => ({ ...v, [key]: value }));
    setErrors(e => (e[key] ? { ...e, [key]: undefined } : e)); // editing a field clears its error
  }, []);

  // Spread onto <Input>/<Select>/<Textarea>/<PhoneInput>: {...bind('email')}
  const bind = (key) => ({
    value: (values[key] ?? ''),
    error: errors[key] ?? null,
    onChange: (e) =>
      set(key, (typeof initial[key] === 'number' ? Number(e.target.value) : e.target.value)),
  });

  // Runs every rule; true when the form is fine.
  const validate = (v = values) => {
    const next = {};
    for (const k of Object.keys(rules)) {
      const msg = rules[k]?.(String(v[k] ?? '').trim());
      if (msg) next[k] = msg;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (fn) => async (e) => {
    e?.preventDefault();
    setError(null);
    if (!validate()) { setError('Please fix the highlighted fields'); return; }
    setBusy(true);
    try {
      await fn(values);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return { values, setValues, set, bind, submit, validate, errors, setErrors, busy, error, reset: () => { setValues(initial); setErrors({}); } };
}
