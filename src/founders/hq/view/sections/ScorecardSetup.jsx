/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, asList, inputValue } from '../rt';
import ScorecardTable from './ScorecardTable';

export default function ScorecardSetup({ vm }) {
  return (<>
    {' '}
    {vm.sc?.noMetrics ? (<>
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '10px',
        }}>
        <div style={{ fontSize: '17px', fontWeight: '600' }}>
          {'No scorecard for '}{show(vm.sc?.coName)}{' yet'}
        </div>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.5 0.012 265)', lineHeight: '1.5', maxWidth: '520px' }}>
          {'Pick 5 to 10 numbers that tell you every week whether the company is healthy. Tasks done, tasks slipped and decisions made fill in automatically.'}
        </div>
        <button onClick={vm.sc?.addSuggested} style={{
            height: '32px',
            border: '0',
            background: 'var(--acc, oklch(0.5 0.17 265))',
            color: '#fff',
            borderRadius: '8px',
            padding: '0 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
          {'Add the 5 suggested metrics'}
        </button>
      </div>
    </>) : null}
    {' '}
    {vm.sc?.hasMetrics ? <ScorecardTable vm={vm} /> : null}
    {' '}
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input value={inputValue(vm.sc?.newName)} onChange={vm.sc?.onNew} onKeyDown={vm.sc?.onNewKey} placeholder="Add a metric, e.g. Demo calls booked" style={{
            height: '34px',
            padding: '0 10px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '8px',
            fontSize: '13.5px',
            outline: 'none',
            background: '#fff',
            minWidth: '0',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            flex: '1 1 260px',
          }} />
        <button onClick={vm.sc?.addNew} style={{
            height: '34px',
            border: '1px solid oklch(0.9 0.006 85)',
            background: '#fff',
            borderRadius: '8px',
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.35 0.012 265)',
            whiteSpace: 'nowrap',
          }}>
          {'Add metric'}
        </button>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {asList(vm.sc?.sugg).map((suggestion, index) => (<Fragment key={index}>
          <button onClick={suggestion?.go} style={{
              border: '1px solid oklch(0.9 0.006 85)',
              background: '#fff',
              borderRadius: '16px',
              padding: '4px 11px',
              fontSize: '12px',
              cursor: 'pointer',
              color: 'oklch(0.4 0.012 265)',
            }} className="scpa">
            {show(suggestion?.label)}
          </button>
        </Fragment>))}
      </div>
      <div style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
        {'Green cells hit the goal, red cells miss it. Type a number in any week; it saves straight away.'}
      </div>
    </div>
    {' '}
  </>);
}
