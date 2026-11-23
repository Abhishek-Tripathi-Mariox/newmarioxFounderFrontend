/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList } from '../rt';
import PlaybookPanel from './PlaybookPanel';

export default function Playbooks({ vm }) {
  return (<>
    {' '}
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(240px,300px) minmax(0,1fr)',
        gap: '14px',
        alignItems: 'start',
      }}>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
        {asList(vm.cn?.pbList).map((playbook, index) => (<Fragment key={index}>
          <button onClick={playbook?.go} style={inlineStyle(`width:100%;border:0;border-bottom:1px solid oklch(0.95 0.004 85);background:${attr(playbook?.bg)};box-shadow:${attr(playbook?.sh)};padding:11px 14px;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:3px`)}>
            <span style={{ fontSize: '13.5px', fontWeight: '600', lineHeight: '1.35' }}>
              {show(playbook?.name)}
            </span>
            <span style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
              {show(playbook?.meta)}
            </span>
            <span style={{ fontSize: '11.5px', color: 'oklch(0.45 0.12 150)', fontWeight: '600' }}>
              {show(playbook?.usage)}
            </span>
          </button>
        </Fragment>))}
        {vm.cn?.noPbs ? (<>
          <div style={{ padding: '16px', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
            {'No playbooks match.'}
          </div>
        </>) : null}
        <button onClick={vm.cn?.addPb} style={{
            width: '100%',
            border: '0',
            background: 'none',
            padding: '12px 14px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--acc, oklch(0.5 0.17 265))',
            cursor: 'pointer',
            textAlign: 'left',
          }}>
          {'+ New playbook'}
        </button>
      </div>
      {' '}
      {vm.cn?.hasPB ? <PlaybookPanel vm={vm} /> : null}
      {' '}
    </div>
    {' '}
  </>);
}
