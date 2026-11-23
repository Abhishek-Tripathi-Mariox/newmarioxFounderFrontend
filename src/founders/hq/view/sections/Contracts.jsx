/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';
import ContractPanel from './ContractPanel';

export default function Contracts({ vm }) {
  return (<>
    {' '}
    <div style={{
        display: 'flex',
        gap: '2px',
        padding: '3px',
        background: 'oklch(0.94 0.005 85)',
        borderRadius: '10px',
        width: 'fit-content',
        maxWidth: '100%',
        overflowX: 'auto',
      }}>
      {asList(vm.hub?.sales).map((hubTab, index) => (<Fragment key={index}>
        <button onClick={hubTab?.go} style={inlineStyle(`display:flex;align-items:center;gap:7px;border:0;padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;background:${attr(hubTab?.bg)};color:${attr(hubTab?.fg)};box-shadow:${attr(hubTab?.sh)}`)}>
          {show(hubTab?.label)}
          {hubTab?.hasN ? (<>
            <span style={inlineStyle(`font-size:11px;font-weight:700;padding:1px 6px;border-radius:8px;background:${attr(hubTab?.nBg)};color:${attr(hubTab?.nFg)}`)}>
              {show(hubTab?.n)}
            </span>
          </>) : null}
        </button>
      </Fragment>))}
    </div>
    {' '}
    <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
      <div>
        <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '600', letterSpacing: '-0.015em' }}>
          {'Contracts'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {show(vm.ct?.sub)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={vm.ct?.copy} style={{
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
          }}>
          {'Copy list'}
        </button>
        {vm.ct?.hasFromLead ? (
          <select aria-label="Create a contract from a won lead" value={inputValue(vm.ct?.fromLead?.value)} onChange={vm.ct?.fromLead?.onChange} style={{
              height: '32px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              maxWidth: '220px',
            }}>
            {asList(vm.ct?.fromLead?.opts).map((option, index) => (<option key={index} value={option?.v}>{show(option?.l)}</option>))}
          </select>
        ) : null}
        <button onClick={vm.ct?.add} style={{
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
          {'+ Add contract'}
        </button>
      </div>
    </div>
    {' '}
    <div style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid oklch(0.915 0.006 85)',
        overflowX: 'auto',
        overflowY: 'hidden',
        alignItems: 'center',
      }}>
      {asList(vm.ct?.coTabs).map((coTab, index) => (<Fragment key={index}>
        <button onClick={coTab?.go} style={inlineStyle(`display:flex;align-items:center;gap:8px;border:0;background:none;padding:10px 12px;margin-bottom:-1px;border-bottom:2px solid ${attr(coTab?.bd)};font-size:13.5px;font-weight:600;color:${attr(coTab?.fg)};cursor:pointer;white-space:nowrap`)}>
          {coTab?.hasTile ? (<>
            <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(coTab?.tile)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center;flex-shrink:0`)}>
              {show(coTab?.ini)}
            </span>
          </>) : null}
          {show(coTab?.label)}
          <span style={{
              fontSize: '11.5px',
              fontWeight: '600',
              padding: '1px 7px',
              borderRadius: '9px',
              background: 'oklch(0.95 0.005 85)',
              color: 'oklch(0.45 0.012 265)',
            }}>
            {show(coTab?.n)}
          </span>
        </button>
      </Fragment>))}
      {vm.ct?.coMore?.has ? (<>
        <input list={vm.ct?.coMore?.id} onChange={vm.ct?.coMore?.on} placeholder={vm.ct?.coMore?.ph} style={{
            marginLeft: 'auto',
            flex: '0 0 210px',
            height: '30px',
            padding: '0 10px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '8px',
            fontSize: '12.5px',
            outline: 'none',
            background: '#fff',
            alignSelf: 'center',
            fontFamily: 'inherit',
          }} />
        <datalist id={vm.ct?.coMore?.id}>
          {asList(vm.ct?.coMore?.opts).map((option, index) => (<Fragment key={index}>
            <option value={inputValue(option?.l)} />
          </Fragment>))}
        </datalist>
      </>) : null}
    </div>
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(118px,1fr))', gap: '10px' }}>
      {asList(vm.ct?.tiles).map((tile, index) => (<Fragment key={index}>
        <button onClick={tile?.go} style={inlineStyle(`text-align:left;background:${attr(tile?.bg)};border:1.5px solid ${attr(tile?.bd)};border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:3px;cursor:pointer`)}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.5 0.012 265)' }}>
            {show(tile?.l)}
          </span>
          <span style={inlineStyle(`font-size:22px;font-weight:700;letter-spacing:-0.02em;color:${attr(tile?.c)}`)}>
            {show(tile?.v)}
          </span>
          <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
            {show(tile?.h)}
          </span>
        </button>
      </Fragment>))}
    </div>
    {' '}
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <input value={inputValue(vm.ct?.q)} onChange={vm.ct?.onQ} placeholder="Search name, counterparty, terms" style={{
          height: '32px',
          padding: '0 10px',
          border: '1px solid oklch(0.9 0.006 85)',
          borderRadius: '8px',
          fontSize: '13.5px',
          outline: 'none',
          background: '#fff',
          minWidth: '0',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          width: 'auto',
          flex: '0 1 260px',
        }} />
      <select value={inputValue(vm.ct?.fType?.value)} onChange={vm.ct?.fType?.onChange} style={{
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
        {asList(vm.ct?.fType?.opts).map((option, index) => (<Fragment key={index}>
          <option value={inputValue(option?.v)}>
            {show(option?.l)}
          </option>
        </Fragment>))}
      </select>
      <select value={inputValue(vm.ct?.fStatus?.value)} onChange={vm.ct?.fStatus?.onChange} style={{
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
        {asList(vm.ct?.fStatus?.opts).map((option, index) => (<Fragment key={index}>
          <option value={inputValue(option?.v)}>
            {show(option?.l)}
          </option>
        </Fragment>))}
      </select>
      <select value={inputValue(vm.ct?.fSort?.value)} onChange={vm.ct?.fSort?.onChange} style={{
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
        {asList(vm.ct?.fSort?.opts).map((option, index) => (<Fragment key={index}>
          <option value={inputValue(option?.v)}>
            {show(option?.l)}
          </option>
        </Fragment>))}
      </select>
      {vm.ct?.anyF ? (<>
        <button onClick={vm.ct?.clear} style={{
            border: '0',
            background: 'none',
            fontSize: '12.5px',
            fontWeight: '600',
            color: 'var(--acc, oklch(0.5 0.17 265))',
            cursor: 'pointer',
          }}>
          {'Clear'}
        </button>
      </>) : null}
      <span style={{ flex: '1' }} />
      <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
        {show(vm.ct?.shown)}
      </span>
    </div>
    {' '}
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        overflow: 'auto',
      }}>
      <div style={{ minWidth: '900px' }}>
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,2fr) 120px 120px 120px 150px 110px 110px',
            gap: '12px',
            padding: '9px 16px',
            background: 'oklch(0.975 0.004 85)',
            fontSize: '12px',
            fontWeight: '600',
            color: 'oklch(0.5 0.012 265)',
          }}>
          <span>
            {'Contract'}
          </span>
          <span>
            {'Type'}
          </span>
          <span>
            {'Company'}
          </span>
          <span>
            {'Value'}
          </span>
          <span>
            {'Ends'}
          </span>
          <span>
            {'Owner'}
          </span>
          <span>
            {'Status'}
          </span>
        </div>
        {' '}
        {asList(vm.ct?.rows).map((contract, index) => (<Fragment key={index}>
          <button onClick={contract?.open} style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'minmax(0,2fr) 120px 120px 120px 150px 110px 110px',
              gap: '12px',
              padding: '11px 16px',
              border: '0',
              borderBottom: '1px solid oklch(0.95 0.004 85)',
              background: '#fff',
              textAlign: 'left',
              cursor: 'pointer',
              alignItems: 'center',
              fontSize: '13px',
            }} className="scp7">
            {' '}
            <span style={{ minWidth: '0' }}>
              <span style={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {show(contract?.name)}
              </span>
              <span style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'oklch(0.52 0.012 265)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {show(contract?.party)}
              </span>
            </span>
            {' '}
            <span>
              <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '5px',
                  background: 'oklch(0.95 0.008 265)',
                  color: 'oklch(0.4 0.03 265)',
                }}>
                {show(contract?.type)}
              </span>
            </span>
            {' '}
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '0' }}>
              <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(contract?.coBg)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center;flex-shrink:0`)}>
                {show(contract?.coIni)}
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {show(contract?.co)}
              </span>
            </span>
            {' '}
            <span style={{ fontWeight: '600' }}>
              {show(contract?.value)}
            </span>
            {' '}
            <span>
              <span style={{ display: 'block' }}>
                {show(contract?.end)}
              </span>
              <span style={inlineStyle(`font-size:11.5px;font-weight:600;color:${attr(contract?.leftC)}`)}>
                {show(contract?.left)}
              </span>
            </span>
            {' '}
            <span style={{ color: 'oklch(0.42 0.012 265)' }}>
              {show(contract?.owner)}
            </span>
            {' '}
            <span>
              <span style={inlineStyle(`font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;background:${attr(contract?.sBg)};color:${attr(contract?.sFg)};white-space:nowrap`)}>
                {show(contract?.st)}
              </span>
            </span>
            {' '}
          </button>
        </Fragment>))}
        {' '}
        {vm.ct?.empty ? (<>
          <div style={{
              padding: '28px 16px',
              position: 'sticky',
              left: '0',
              width: 'fit-content',
              maxWidth: '560px',
              fontSize: '13.5px',
              color: 'oklch(0.5 0.012 265)',
            }}>
            {show(vm.ct?.emptyTxt)}
          </div>
        </>) : null}
        {' '}
      </div>
    </div>
    {' '}
    {vm.ct?.hasOpen ? <ContractPanel vm={vm} /> : null}
    {' '}
  </>);
}
