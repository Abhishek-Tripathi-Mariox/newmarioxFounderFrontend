import { Fragment, lazy, Suspense } from 'react';
import { show, attr, inlineStyle, asList } from '../rt';
import { useAttendanceInCount } from '../../teamTasks/portalBridge';

const AttendanceHost = lazy(() => import('../../attendance/AttendanceHost'));

const muted = 'oklch(0.52 0.012 265)';

/**
 * HQ → Attendance: a company switcher, then the internal portal's Attendance page for Mariox (the only
 * connected company; "All companies" shows it too) or a "not connected yet" note for the others.
 */
export default function Attendance({ vm }) {
  const att = vm.att || {};
  const inCount = useAttendanceInCount();
  const count = (tab) => (tab.connected && inCount != null ? inCount + ' in' : tab.n);
  return (<>
    <div role="tablist" aria-label="Company" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', borderBottom: '1px solid oklch(0.92 0.005 85)' }}>
      {asList(att.coTabs).map((tab) => (<Fragment key={tab.id}>
        <button type="button" role="tab" aria-selected={tab.bd !== 'transparent'} onClick={tab.go} style={inlineStyle(`display:flex;align-items:center;gap:8px;border:0;background:none;padding:8px 12px 10px;font-size:14px;font-weight:600;cursor:pointer;color:${attr(tab.fg)};border-bottom:2px solid ${attr(tab.bd)};margin-bottom:-1px`)}>
          {tab.hasTile ? (
            <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(tab.tile)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center`)}>
              {show(tab.ini)}
            </span>
          ) : null}
          <span>{show(tab.label)}</span>
          <span style={{ fontSize: '12px', fontWeight: '500', color: muted }}>{show(count(tab))}</span>
        </button>
      </Fragment>))}
    </div>
    {att.off ? (
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.92 0.005 85)',
          borderRadius: '12px',
          padding: '40px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
        }}>
        <span style={{ fontSize: '15px', fontWeight: '600' }}>{show(att.offTitle)}</span>
        <span style={{ fontSize: '13.5px', color: muted, maxWidth: '460px', textWrap: 'pretty' }}>{show(att.offText)}</span>
      </div>
    ) : null}
    {att.on ? (<>
      {att.note ? <div style={{ fontSize: '12.5px', color: muted, marginBottom: '-8px' }}>{att.note}</div> : null}
      <Suspense fallback={<div role="status" style={{ fontSize: '13.5px', color: muted }}>Loading attendance…</div>}>
        <AttendanceHost />
      </Suspense>
    </>) : null}
  </>);
}
