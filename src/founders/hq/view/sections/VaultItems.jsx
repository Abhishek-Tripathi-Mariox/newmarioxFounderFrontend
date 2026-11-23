/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function VaultItems({ vm }) {
  return (<>
    {' '}
    {vm.vt?.adding ? (<>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.85 0.05 265)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
        {' '}
        <div style={{ fontSize: '14px', fontWeight: '600' }}>
          {show(vm.vt?.formTitle)}
        </div>
        {' '}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '10px' }}>
          {' '}
          <label style={{
              fontSize: '11.5px',
              fontWeight: '500',
              color: 'oklch(0.48 0.012 265)',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}>
            {'Name'}
            <input value={inputValue(vm.vt?.f?.name)} onChange={vm.vt?.onF?.name} placeholder="e.g. HDFC net banking" style={{
                height: '36px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '13.5px',
                outline: 'none',
              }} />
          </label>
          {' '}
          <label style={{
              fontSize: '11.5px',
              fontWeight: '500',
              color: 'oklch(0.48 0.012 265)',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}>
            {'Website'}
            <input value={inputValue(vm.vt?.f?.url)} onChange={vm.vt?.onF?.url} placeholder="https://" style={{
                height: '36px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '13.5px',
                outline: 'none',
              }} />
          </label>
          {' '}
          <label style={{
              fontSize: '11.5px',
              fontWeight: '500',
              color: 'oklch(0.48 0.012 265)',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}>
            {'Username / email'}
            <input value={inputValue(vm.vt?.f?.user)} onChange={vm.vt?.onF?.user} style={{
                height: '36px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '13.5px',
                outline: 'none',
              }} />
          </label>
          {' '}
          <label style={{
              fontSize: '11.5px',
              fontWeight: '500',
              color: 'oklch(0.48 0.012 265)',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}>
            {'Password'}
            <span style={{ display: 'flex', gap: '6px' }}>
              <input value={inputValue(vm.vt?.f?.pass)} onChange={vm.vt?.onF?.pass} style={{
                  flex: '1',
                  minWidth: '0',
                  height: '36px',
                  padding: '0 10px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: '\'JetBrains Mono\',monospace',
                  outline: 'none',
                }} />
              <button onClick={vm.vt?.gen} style={{
                  height: '36px',
                  border: '1px solid oklch(0.88 0.008 85)',
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '0 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'Generate'}
              </button>
            </span>
          </label>
          {' '}
        </div>
        {' '}
        <label style={{
            fontSize: '11.5px',
            fontWeight: '500',
            color: 'oklch(0.48 0.012 265)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}>
          {'Notes'}
          <textarea value={inputValue(vm.vt?.f?.notes)} onChange={vm.vt?.onF?.notes} rows="2" placeholder="2FA phone, security answers, account number" style={{
              padding: '8px 10px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              fontSize: '13px',
              resize: 'vertical',
              outline: 'none',
            }} />
        </label>
        {' '}
        <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {' '}
          <div style={{
              display: 'flex',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              flexWrap: 'wrap',
            }}>
            {asList(vm.vt?.coSeg).map((segment, index) => (<Fragment key={index}>
              <button onClick={segment?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
                {show(segment?.label)}
              </button>
            </Fragment>))}
          </div>
          {' '}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={vm.vt?.cancel} style={{
                height: '36px',
                border: '1px solid oklch(0.88 0.008 85)',
                background: '#fff',
                borderRadius: '8px',
                padding: '0 14px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'Cancel'}
            </button>
            <button onClick={vm.vt?.save} style={{
                height: '36px',
                border: '0',
                background: 'var(--acc, oklch(0.5 0.17 265))',
                color: '#fff',
                borderRadius: '8px',
                padding: '0 16px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'Save'}
            </button>
          </div>
          {' '}
        </div>
        {' '}
      </div>
      {' '}
    </>) : null}
    {' '}
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      {' '}
      <input value={inputValue(vm.vt?.q)} onChange={vm.vt?.onQ} placeholder="Search vault" style={{
          flex: '0 1 260px',
          minWidth: '0',
          height: '34px',
          padding: '0 12px',
          border: '1px solid oklch(0.9 0.006 85)',
          borderRadius: '8px',
          background: '#fff',
          fontSize: '13px',
          outline: 'none',
        }} />
      {' '}
      <div style={{
          display: 'flex',
          gap: '2px',
          padding: '3px',
          background: 'oklch(0.94 0.005 85)',
          borderRadius: '9px',
          flexWrap: 'wrap',
        }}>
        {asList(vm.vt?.filterSeg).map((segment, index) => (<Fragment key={index}>
          <button onClick={segment?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
            {show(segment?.label)}
          </button>
        </Fragment>))}
      </div>
      {' '}
      {vm.vt?.hasCopied ? (<>
        <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'oklch(0.5 0.13 150)' }}>
          {show(vm.vt?.copied)}
        </span>
      </>) : null}
      {' '}
    </div>
    {' '}
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        overflowX: 'auto',
      }}>
      {' '}
      {asList(vm.vt?.items).map((item, index) => (<Fragment key={index}>
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(180px,1.3fr) minmax(160px,1fr) minmax(200px,1fr) auto',
            gap: '12px',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid oklch(0.955 0.004 85)',
          }}>
          {' '}
          <div style={{ minWidth: '0' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                {show(item?.name)}
              </span>
              <span style={inlineStyle(`font-size:11px;font-weight:600;padding:1px 7px;border-radius:5px;background:${attr(item?.coTint)};color:${attr(item?.coInk)}`)}>
                {show(item?.coName)}
              </span>
            </div>
            {item?.hasUrl ? (<>
              <a href={item?.url} target="_blank" rel="noopener" style={{
                  fontSize: '12px',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginTop: '2px',
                }}>
                {show(item?.url)}
              </a>
            </>) : null}
          </div>
          {' '}
          <button onClick={item?.copyUser} title="Copy username" style={{
              border: '0',
              background: 'none',
              padding: '0',
              textAlign: 'left',
              fontSize: '13px',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: '0',
            }}>
            {show(item?.user)}
          </button>
          {' '}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', minWidth: '0' }}>
            <span style={{
                fontFamily: '\'JetBrains Mono\',monospace',
                fontSize: '12.5px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: '0',
                flex: '1',
              }}>
              {show(item?.passShown)}
            </span>
            <button onClick={item?.toggle} style={{
                height: '26px',
                border: '1px solid oklch(0.9 0.006 85)',
                background: '#fff',
                borderRadius: '6px',
                padding: '0 8px',
                fontSize: '11.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {show(item?.toggleLabel)}
            </button>
            <button onClick={item?.copyPass} style={{
                height: '26px',
                border: '1px solid oklch(0.9 0.006 85)',
                background: '#fff',
                borderRadius: '6px',
                padding: '0 8px',
                fontSize: '11.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'Copy'}
            </button>
          </div>
          {' '}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={item?.edit} style={{
                border: '0',
                background: 'none',
                color: 'var(--acc, oklch(0.5 0.17 265))',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'Edit'}
            </button>
            <button onClick={item?.remove} title="Delete" style={{
                border: '0',
                background: 'none',
                color: 'oklch(0.65 0.01 265)',
                fontSize: '15px',
                cursor: 'pointer',
              }} className="scp1c">
              {'×'}
            </button>
          </div>
          {' '}
          {item?.hasNotes ? (<>
            <div style={{
                gridColumn: '1 / -1',
                fontSize: '12.5px',
                color: 'oklch(0.48 0.012 265)',
                whiteSpace: 'pre-wrap',
                marginTop: '-4px',
              }}>
              {show(item?.notes)}
            </div>
          </>) : null}
          {' '}
        </div>
        {' '}
      </Fragment>))}
      {' '}
      {vm.vt?.empty ? (<>
        <div style={{ padding: '40px 16px', textAlign: 'center', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
          {'No credentials saved yet.'}
        </div>
      </>) : null}
      {' '}
    </div>
    {' '}
    <div style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)', lineHeight: '1.5' }}>
      {'Encrypted with AES-256 on this device. The vault locks when you close or reload the page.'}
    </div>
    {' '}
  </>);
}
