/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function NewCompanyDialog({ vm }) {
  return (<>
    {' '}
    <div onClick={vm.cm?.nw?.cancel} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.3)', zIndex: '45' }} />
    {' '}
    <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 'min(640px,calc(100% - 32px))',
        maxHeight: 'calc(100vh - 48px)',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: '14px',
        zIndex: '46',
        boxShadow: '0 24px 64px oklch(0.2 0.02 265 / 0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}>
      {' '}
      <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid oklch(0.94 0.005 85)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
        <span style={inlineStyle(`width:38px;height:38px;border-radius:10px;background:${attr(vm.cm?.nw?.bg)};color:#fff;font-size:16px;font-weight:700;display:grid;place-items:center`)}>
          {show(vm.cm?.nw?.ini)}
        </span>
        <div>
          <div style={{ fontSize: '17px', fontWeight: '600' }}>
            {'New company'}
          </div>
          <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
            {'The Constitution\'s playbooks become its setup checklist.'}
          </div>
        </div>
      </div>
      {' '}
      <div style={{
          padding: '18px 22px',
          display: 'grid',
          gridTemplateColumns: '130px minmax(0,1fr)',
          gap: '12px 14px',
          alignItems: 'center',
        }}>
        {' '}
        <span style={{ fontSize: '13px', fontWeight: '600' }}>
          {'Name'}
        </span>
        <input value={inputValue(vm.cm?.nw?.name)} onChange={vm.cm?.nw?.onName} placeholder="e.g. Mariox Labs" style={{
            height: '34px',
            padding: '0 10px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '8px',
            fontSize: '13.5px',
            outline: 'none',
            minWidth: '0',
            background: '#fff',
            width: '100%',
          }} />
        {' '}
        <span style={{ fontSize: '13px', fontWeight: '600' }}>
          {'Country'}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select value={inputValue(vm.cm?.nw?.country)} onChange={vm.cm?.nw?.onCountry} style={{
              height: '34px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '7px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              flex: '1',
            }}>
            {asList(vm.cm?.nw?.countryOpts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          <select value={inputValue(vm.cm?.nw?.entity)} onChange={vm.cm?.nw?.onEntity} style={{
              height: '34px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '7px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              flex: '1',
            }}>
            {asList(vm.cm?.nw?.entityOpts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
        </div>
        {' '}
        <span style={{ fontSize: '13px', fontWeight: '600' }}>
          {'Industry'}
        </span>
        <input value={inputValue(vm.cm?.nw?.industry)} onChange={vm.cm?.nw?.onInd} placeholder="e.g. Fintech, SaaS, Agency" style={{
            height: '34px',
            padding: '0 10px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '8px',
            fontSize: '13.5px',
            outline: 'none',
            minWidth: '0',
            background: '#fff',
            width: '100%',
          }} />
        {' '}
        <span style={{ fontSize: '13px', fontWeight: '600' }}>
          {'Owner'}
        </span>
        <div style={{
            display: 'flex',
            gap: '2px',
            padding: '3px',
            background: 'oklch(0.94 0.005 85)',
            borderRadius: '9px',
            flexWrap: 'wrap',
            width: 'fit-content',
          }}>
          {asList(vm.cm?.nw?.ownerSeg).map((option, index) => (<Fragment key={index}>
            <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
              {show(option?.label)}
            </button>
          </Fragment>))}
        </div>
        {' '}
        <span style={{ fontSize: '13px', fontWeight: '600' }}>
          {'Stage'}
        </span>
        <div style={{
            display: 'flex',
            gap: '2px',
            padding: '3px',
            background: 'oklch(0.94 0.005 85)',
            borderRadius: '9px',
            flexWrap: 'wrap',
            width: 'fit-content',
          }}>
          {asList(vm.cm?.nw?.statusSeg).map((option, index) => (<Fragment key={index}>
            <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
              {show(option?.label)}
            </button>
          </Fragment>))}
        </div>
        {' '}
        <span style={{ fontSize: '13px', fontWeight: '600' }}>
          {'Colour'}
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {asList(vm.cm?.nw?.hues).map((swatch, index) => (<Fragment key={index}>
            <button onClick={swatch?.go} style={inlineStyle(`width:24px;height:24px;border-radius:50%;border:0;background:${attr(swatch?.sw)};box-shadow:${attr(swatch?.ring)};cursor:pointer`)} />
          </Fragment>))}
        </div>
        {' '}
        <span style={{ fontSize: '13px', fontWeight: '600', alignSelf: 'start', paddingTop: '6px' }}>
          {'Playbooks'}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
            {'Picked for you based on the country. Untick any you don\'t need.'}
          </span>
          {asList(vm.cm?.nw?.pbs).map((playbook, index) => (<Fragment key={index}>
            <button onClick={playbook?.go} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '0',
                background: 'none',
                padding: '5px 0',
                cursor: 'pointer',
                textAlign: 'left',
              }}>
              <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;border:1.5px solid ${attr(playbook?.bd)};background:${attr(playbook?.bg)};color:#fff;font-size:11px;line-height:15px;text-align:center;flex-shrink:0`)}>
                {show(playbook?.mark)}
              </span>
              <span style={{ flex: '1', fontSize: '13.5px' }}>
                {show(playbook?.name)}
              </span>
              <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
                {show(playbook?.meta)}
              </span>
            </button>
          </Fragment>))}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{
          padding: '14px 22px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
        }}>
        <button onClick={vm.cm?.nw?.cancel} style={{
            height: '36px',
            border: '1px solid oklch(0.9 0.006 85)',
            background: '#fff',
            borderRadius: '7px',
            padding: '0 11px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.35 0.012 265)',
          }}>
          {'Cancel'}
        </button>
        <button onClick={vm.cm?.nw?.create} style={inlineStyle(`height:34px;border:0;background:var(--acc, oklch(0.5 0.17 265));color:#fff;border-radius:8px;padding:0 14px;font-size:13px;font-weight:600;cursor:pointer;height:36px;opacity:${attr(vm.cm?.nw?.op)}`)}>
          {'Create company'}
        </button>
      </div>
      {' '}
    </div>
    {' '}
  </>);
}
