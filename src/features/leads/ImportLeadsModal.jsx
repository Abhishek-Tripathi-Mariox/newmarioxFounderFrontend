import { useMemo, useRef, useState } from 'react';
import { useStore } from '@/store';
import { Button, Checkbox, ErrorText, Modal } from '@/components/ui';
import { api } from '@/api/client';
import { downloadCsv } from '@/lib/download';
import { getServices, getSources, useLeadStatusNames } from '@/store/masters';
import { getActiveOwners } from '@/store/owners';
import { companyOf } from '@/features/team-tasks/companies';
import { mapHeaders, parseCsv, sampleRows, toRows } from './csvImport';
import { useLeadCompanies } from './leadCompanies';
import { inFoundersHQ } from '@/lib/sso';
import s from './ImportLeadsModal.module.css';

const MAX_ROWS = 2000;
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Leads → "Import CSV" (ModalHost kind 'leadImport'): sample file, preview, import, per-row results.
 * `company`: our company for rows without an "Our company" cell (Founders HQ's company tab; default Mariox).
 */
export default function ImportLeadsModal({ company = '', onClose }) {
  const companies = useLeadCompanies();
  const stages = useLeadStatusNames();
  const resync = useStore((st) => st.resync);
  const flash = useStore((st) => st.flash);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null); // { name, rows, ignored: [header names not used] }
  const [skipDup, setSkipDup] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const sample = () => downloadCsv(sampleRows({
    services: getServices(), sources: getSources(), owners: getActiveOwners().map((o) => o.name), stages, companies: companies.map((c) => c.id),
  }), 'leads-import-sample.csv');

  const pick = async (f) => {
    setErr(''); setResult(null); setFile(null);
    if (!f) return;
    if (!/\.csv$/i.test(f.name)) { setErr('Pick a .csv file (in Excel / Google Sheets: File → Download / Save as → CSV).'); return; }
    if (f.size > MAX_BYTES) { setErr('The file is larger than 5 MB.'); return; }
    const all = parseCsv(await f.text());
    if (all.length < 2) { setErr('The file has no rows under the header line.'); return; }
    const { map, missing } = mapHeaders(all[0]);
    if (missing.length) { setErr('The file needs a Company or a Contact column. Download the sample to see the format.'); return; }
    const rows = toRows(all.slice(1), map);
    if (rows.length > MAX_ROWS) { setErr(`The file has ${rows.length} rows — import at most ${MAX_ROWS} at a time.`); return; }
    setFile({ name: f.name, rows, ignored: all[0].filter((_, i) => !map[i]).filter(Boolean) });
  };

  const run = async () => {
    if (!file || busy) return;
    setBusy(true); setErr('');
    try {
      // Team portal: every imported lead is a Mariox lead. Founders HQ: the file's "Our company", else its tab.
      const rows = !inFoundersHQ() ? file.rows.map((row) => ({ ...row, companyId: 'mariox' }))
        : company ? file.rows.map((row) => (row.companyId ? row : { ...row, companyId: company })) : file.rows;
      const r = await api.post('/leads/import', { rows, skipDuplicates: skipDup });
      setResult(r);
      if (r.created) {
        await resync(['sales']).catch(() => {});
        flash(`${r.created} lead${r.created === 1 ? '' : 's'} imported`);
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const downloadProblems = () => downloadCsv([
    ['Row', 'Company', 'Problem'],
    ...result.errors.map((e) => [e.row, e.company || '', e.error]),
    ...result.skipped.map((x) => [x.row, x.company || '', `Skipped: already a lead (${x.duplicateOf})`]),
    ...(result.warnings || []).map((w) => [w.row, w.company || '', `Imported with a note: ${w.warning}`]),
  ], 'leads-import-problems.csv');

  const preview = useMemo(() => (file ? file.rows.slice(0, 5) : []), [file]);

  const footer = (
    <div className={s.footer}>
      <span className={s.spacer} />
      <Button onClick={onClose}>{result ? 'Close' : 'Cancel'}</Button>
      {!result && (
        <Button variant="primary" onClick={run} disabled={!file || busy} aria-busy={busy}>
          {busy ? 'Importing…' : file ? `Import ${file.rows.length} lead${file.rows.length === 1 ? '' : 's'}` : 'Import'}
        </Button>
      )}
    </div>
  );

  return (
    <Modal open onClose={onClose} title="Import leads from CSV" width={720} footer={footer}>
      <div className={s.body}>
        <div className={s.step}>
          <div className={s.stepNum}>1</div>
          <div className={s.stepBody}>
            <div className={s.stepTitle}>Use the sample format</div>
            <div className={s.muted}>
              Columns: <b>Company</b> and / or <b>Contact</b> (one is required), Email, Phone, Services (separate several with <code>;</code>), Source,
              Owner (sales person’s name or email), Status (pipeline stage, default New), Value, Notes
              {inFoundersHQ() ? (
                <>, Our company (which of our companies the lead is for: {companies.map((c) => c.id).join(', ')}; default {companyOf(companies, company).name}). Blank or unknown Source / Owner / Status / Our company use the defaults</>
              ) : (
                <>. Every lead imported here is a Mariox lead. Blank or unknown Source / Owner / Status use the defaults</>
              )}
              {' '}— the original value is kept in the lead’s notes.
            </div>
            <Button size="sm" onClick={sample}>⬇ Download sample CSV</Button>
          </div>
        </div>

        <div className={s.step}>
          <div className={s.stepNum}>2</div>
          <div className={s.stepBody}>
            <div className={s.stepTitle}>Upload your file</div>
            <button
              type="button"
              className={s.drop}
              onClick={() => fileRef.current && fileRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files && e.dataTransfer.files[0]); }}
            >
              {file ? <><b>{file.name}</b> · {file.rows.length} row{file.rows.length === 1 ? '' : 's'} found · click to choose another</> : <><b>Click to choose a .csv file</b> or drag it here · up to {MAX_ROWS} rows</>}
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={(e) => { pick(e.target.files && e.target.files[0]); e.target.value = ''; }} />
            {file && file.ignored.length > 0 && <div className={s.muted}>Columns not used: {file.ignored.join(', ')}</div>}
            {preview.length > 0 && (
              <div className={s.previewWrap}>
                <table className={s.preview}>
                  <thead><tr><th>Company</th><th>Contact</th><th>Email</th><th>Phone</th><th>Services</th><th>Owner</th><th>Status</th></tr></thead>
                  <tbody>
                    {preview.map((r, i) => (
                      <tr key={i}><td>{r.company}</td><td>{r.contact}</td><td>{r.email}</td><td>{r.phone}</td><td>{r.services}</td><td>{r.owner}</td><td>{r.status}</td></tr>
                    ))}
                  </tbody>
                </table>
                {file.rows.length > preview.length && <div className={s.muted}>…and {file.rows.length - preview.length} more</div>}
              </div>
            )}
            {file && !result && (
              <Checkbox checked={skipDup} onChange={() => setSkipDup((x) => !x)} label="Skip rows whose email or phone already belongs to a lead" />
            )}
          </div>
        </div>

        {result && (
          <div className={s.result}>
            <div className={s.resultLine}>
              <span className={s.ok}>✓ {result.created} imported</span>
              {result.skipped.length > 0 && <span className={s.skip}>{result.skipped.length} skipped (already leads)</span>}
              {(result.warnings || []).length > 0 && <span className={s.skip}>{result.warnings.length} imported with notes</span>}
              {result.errors.length > 0 && <span className={s.bad}>{result.errors.length} not imported</span>}
              {(result.errors.length > 0 || result.skipped.length > 0 || (result.warnings || []).length > 0) && (
                <Button size="sm" variant="ghost" onClick={downloadProblems}>Download list</Button>
              )}
            </div>
            {result.errors.slice(0, 50).map((e) => (
              <div key={`e${e.row}`} className={s.problem}><b>Row {e.row}</b>{e.company ? ` · ${e.company}` : ''} — {e.error}</div>
            ))}
            {(result.warnings || []).slice(0, 50).map((w) => (
              <div key={`w${w.row}${w.warning}`} className={s.problemSkip}><b>Row {w.row}</b>{w.company ? ` · ${w.company}` : ''} — imported; {w.warning}</div>
            ))}
            {result.skipped.slice(0, 20).map((x) => (
              <div key={`s${x.row}`} className={s.problemSkip}><b>Row {x.row}</b> · {x.company} — already a lead ({x.duplicateOf})</div>
            ))}
          </div>
        )}
        {err && <ErrorText>{err}</ErrorText>}
      </div>
    </Modal>
  );
}
