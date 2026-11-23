/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function ContractPanel({ vm }) {
  return (<>
    <div onClick={vm.ct?.d?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.3)', zIndex: '45' }} />
    <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        width: 'min(560px,100%)',
        background: '#fff',
        zIndex: '46',
        boxShadow: '-12px 0 40px oklch(0.2 0.02 265 / 0.15)',
        display: 'flex',
        flexDirection: 'column',
      }}>
      {' '}
      <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid oklch(0.94 0.005 85)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
        <span style={inlineStyle(`font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;background:${attr(vm.ct?.d?.sBg)};color:${attr(vm.ct?.d?.sFg)}`)}>
          {show(vm.ct?.d?.st)}
        </span>
        <span style={inlineStyle(`flex:1;font-size:12.5px;font-weight:600;color:${attr(vm.ct?.d?.leftC)}`)}>
          {show(vm.ct?.d?.left)}
        </span>
        <button onClick={vm.ct?.d?.close} style={{
            border: '0',
            background: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: 'oklch(0.5 0.012 265)',
          }}>
          {'×'}
        </button>
      </div>
      {' '}
      <div style={{
          flex: '1',
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
        {' '}
        <input data-ctid={vm.ct?.d?.id} value={inputValue(vm.ct?.d?.name)} onChange={vm.ct?.d?.onName} placeholder="Contract name, e.g. Master services agreement" style={{
            height: '42px',
            padding: '0 10px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '8px',
            fontSize: '18px',
            outline: 'none',
            background: '#fff',
            minWidth: '0',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            width: '100%',
            fontWeight: '600',
          }} />
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: '120px minmax(0,1fr)',
            gap: '11px 14px',
            alignItems: 'center',
          }}>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Counterparty'}
          </span>
          <input value={inputValue(vm.ct?.d?.party)} onChange={vm.ct?.d?.onParty} placeholder="Who is it with?" style={{
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
              width: '100%',
            }} />
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Type'}
          </span>
          <select value={inputValue(vm.ct?.d?.type?.value)} onChange={vm.ct?.d?.type?.onChange} style={{
              height: '32px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              minWidth: '0',
              maxWidth: '100%',
            }}>
            {asList(vm.ct?.d?.type?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Company'}
          </span>
          <select value={inputValue(vm.ct?.d?.co?.value)} onChange={vm.ct?.d?.co?.onChange} style={{
              height: '32px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              minWidth: '0',
              maxWidth: '100%',
            }}>
            {asList(vm.ct?.d?.co?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Status'}
          </span>
          <div style={{
              display: 'flex',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              width: 'fit-content',
              flexWrap: 'wrap',
            }}>
            {asList(vm.ct?.d?.statusSeg).map((segment, index) => (<Fragment key={index}>
              <button onClick={segment?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
                {show(segment?.label)}
              </button>
            </Fragment>))}
          </div>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Value'}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input type="number" value={inputValue(vm.ct?.d?.value)} onChange={vm.ct?.d?.onValue} placeholder="0" style={{
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
                width: '100%',
                flex: '1',
              }} />
            <select value={inputValue(vm.ct?.d?.period?.value)} onChange={vm.ct?.d?.period?.onChange} style={{
                height: '32px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                background: '#fff',
                fontSize: '12.5px',
                padding: '0 6px',
                fontFamily: 'inherit',
                cursor: 'pointer',
                minWidth: '0',
                maxWidth: '100%',
              }}>
              {asList(vm.ct?.d?.period?.opts).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
          </div>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Start date'}
          </span>
          <input type="date" value={inputValue(vm.ct?.d?.start)} onChange={vm.ct?.d?.onStart} style={{
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
              width: 'fit-content',
            }} />
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'End date'}
          </span>
          <input type="date" value={inputValue(vm.ct?.d?.endV)} onChange={vm.ct?.d?.onEnd} style={{
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
              width: 'fit-content',
            }} />
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Notice period'}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="number" value={inputValue(vm.ct?.d?.notice)} onChange={vm.ct?.d?.onNotice} placeholder="30" style={{
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
                width: '90px',
              }} />
            <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
              {'days before end'}
            </span>
          </div>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Auto-renews'}
          </span>
          <div style={{
              display: 'flex',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              width: 'fit-content',
              flexWrap: 'wrap',
            }}>
            {asList(vm.ct?.d?.renewSeg).map((segment, index) => (<Fragment key={index}>
              <button onClick={segment?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
                {show(segment?.label)}
              </button>
            </Fragment>))}
          </div>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Signed by'}
          </span>
          <input value={inputValue(vm.ct?.d?.signer)} onChange={vm.ct?.d?.onSigner} placeholder="Our signatory" style={{
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
              width: '100%',
            }} />
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Owner'}
          </span>
          <select value={inputValue(vm.ct?.d?.owner?.value)} onChange={vm.ct?.d?.owner?.onChange} style={{
              height: '32px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              minWidth: '0',
              maxWidth: '100%',
            }}>
            {asList(vm.ct?.d?.owner?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Document link'}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input value={inputValue(vm.ct?.d?.link)} onChange={vm.ct?.d?.onLink} placeholder="Drive, Dropbox or DocuSign link" style={{
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
                width: '100%',
                flex: '1',
              }} />
            {vm.ct?.d?.hasLink ? (<>
              <a href={vm.ct?.d?.link} target="_blank" style={{
                  height: '32px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.35 0.012 265)',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                }}>
                {'Open ↗'}
              </a>
            </>) : null}
          </div>
          {' '}
        </div>
        {' '}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Key terms'}
          </span>
          <textarea value={inputValue(vm.ct?.d?.terms)} onChange={vm.ct?.d?.onTerms} placeholder="Payment terms, SLAs, exclusivity, liability caps, termination rights" style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              fontSize: '13.5px',
              lineHeight: '1.5',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              fieldSizing: 'content',
              minHeight: '60px',
              boxSizing: 'border-box',
            }} />
        </label>
        {' '}
        {vm.ct?.d?.hasLead ? (
          <div style={{
              borderRadius: '10px',
              padding: '10px 14px',
              background: 'oklch(0.97 0.02 190)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            <span style={{ flex: '1', fontSize: '13px', color: 'oklch(0.38 0.07 190)', lineHeight: '1.45', minWidth: '0' }}>
              {'Made from the lead '}<b>{show(vm.ct?.d?.leadTxt)}</b>
            </span>
            <button type="button" onClick={vm.ct?.d?.openLead} style={{
                height: '28px',
                border: '1px solid oklch(0.9 0.006 85)',
                background: '#fff',
                borderRadius: '7px',
                padding: '0 10px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
              {'Open lead'}
            </button>
          </div>
        ) : null}
        {' '}
        {vm.ct?.d?.hasNotice ? (<>
          <div style={{
              borderRadius: '10px',
              padding: '12px 14px',
              background: 'oklch(0.97 0.03 80)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            <span style={{ flex: '1', fontSize: '13px', color: 'oklch(0.4 0.1 65)', lineHeight: '1.45' }}>
              {show(vm.ct?.d?.noticeTxt)}
            </span>
            {vm.ct?.d?.canTask ? (<>
              <button onClick={vm.ct?.d?.makeTask} style={{
                  height: '28px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 9px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.35 0.012 265)',
                  whiteSpace: 'nowrap',
                }}>
                {'Create reminder task'}
              </button>
            </>) : null}
            {vm.ct?.d?.hasTask ? (<>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.45 0.12 150)' }}>
                {'✓ Reminder task created'}
              </span>
            </>) : null}
          </div>
        </>) : null}
        {' '}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={vm.ct?.d?.renew} style={{
              height: '28px',
              border: '1px solid oklch(0.9 0.006 85)',
              background: '#fff',
              borderRadius: '7px',
              padding: '0 9px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.35 0.012 265)',
              whiteSpace: 'nowrap',
            }}>
            {'Renew for another term'}
          </button>
          <button onClick={vm.ct?.d?.dup} style={{
              height: '28px',
              border: '1px solid oklch(0.9 0.006 85)',
              background: '#fff',
              borderRadius: '7px',
              padding: '0 9px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.35 0.012 265)',
              whiteSpace: 'nowrap',
            }}>
            {'Duplicate'}
          </button>
          <span style={{ flex: '1' }} />
          <button onClick={vm.ct?.d?.remove} style={{
              border: '0',
              background: 'none',
              color: 'oklch(0.5 0.18 25)',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            {'Delete'}
          </button>
        </div>
        {' '}
        <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
          {show(vm.ct?.d?.meta)}
        </span>
        {' '}
      </div>
      {' '}
    </div>
  </>);
}
