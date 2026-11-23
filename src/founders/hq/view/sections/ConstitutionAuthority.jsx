/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function ConstitutionAuthority({ vm }) {
  return (<>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {' '}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '12px' }}>
        {asList(vm.cx?.authLv).map((level, index) => (<Fragment key={index}>
          <div style={inlineStyle(`background:#fff;border:1px solid oklch(0.915 0.006 85);border-radius:12px;padding:18px;display:flex;flex-direction:column;gap:8px;border-top:4px solid ${attr(level?.col)}`)}>
            <span style={inlineStyle(`font-size:11px;font-weight:700;letter-spacing:0.08em;color:${attr(level?.col)}`)}>
              {'LEVEL '}{show(level?.n)}
            </span>
            <span style={{ fontSize: '17px', fontWeight: '600' }}>
              {show(level?.name)}
            </span>
            <span style={{ fontSize: '13.5px', lineHeight: '1.5', color: 'oklch(0.38 0.012 265)', textWrap: 'pretty' }}>
              {show(level?.text)}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '4px' }}>
              {asList(level?.ex).map((example, index) => (<Fragment key={index}>
                <span style={{
                    fontSize: '11.5px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'oklch(0.965 0.004 85)',
                    color: 'oklch(0.4 0.012 265)',
                  }}>
                  {show(example?.t)}
                </span>
              </Fragment>))}
            </div>
          </div>
        </Fragment>))}
      </div>
      {' '}
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
          gap: '12px',
          alignItems: 'start',
        }}>
        {' '}
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>
              {'Can I decide this alone?'}
            </div>
            <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'Pick the matter and amount. The answer follows the three levels and your spending limit.'}
            </div>
          </div>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              {'Who'}
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
              {asList(vm.cx?.chk?.who).map((option, index) => (<Fragment key={index}>
                <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                  {show(option?.label)}
                </button>
              </Fragment>))}
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              {'Matter'}
            </span>
            <select value={inputValue(vm.cx?.chk?.matter?.value)} onChange={vm.cx?.chk?.matter?.onChange} style={{
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
              {asList(vm.cx?.chk?.matter?.opts).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              {'Amount (₹)'}
            </span>
            <input type="number" value={inputValue(vm.cx?.chk?.amt)} onChange={vm.cx?.chk?.onAmt} placeholder="0" style={{
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
              }} />
          </div>
          {' '}
          <div style={inlineStyle(`border-radius:10px;padding:14px 16px;background:${attr(vm.cx?.chk?.bg)};display:flex;flex-direction:column;gap:4px`)}>
            <span style={inlineStyle(`font-size:11.5px;font-weight:700;color:${attr(vm.cx?.chk?.fg)};letter-spacing:0.05em`)}>
              {show(vm.cx?.chk?.lvl)}
            </span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: 'oklch(0.25 0.015 265)' }}>
              {show(vm.cx?.chk?.head)}
            </span>
            <span style={{ fontSize: '13px', lineHeight: '1.5', color: 'oklch(0.35 0.012 265)' }}>
              {show(vm.cx?.chk?.text)}
            </span>
          </div>
          {' '}
          {vm.cx?.chk?.needLog ? (<>
            <button onClick={vm.cx?.chk?.log} style={{
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
                alignSelf: 'flex-start',
              }}>
              {'Open Decisions to log it'}
            </button>
          </>) : null}
          {' '}
        </div>
        {' '}
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            {'Limits and special cases'}
          </div>
          {' '}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '600' }}>
              {'Level 1 spending limit, per spend or commitment (₹)'}
            </span>
            <input type="number" value={inputValue(vm.cx?.auth?.limit)} onChange={vm.cx?.auth?.onLimit} style={{
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
              }} />
            <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
              {show(vm.cx?.auth?.limitTxt)}
            </span>
          </label>
          {' '}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '600' }}>
              {'Emergency authority'}
            </span>
            <textarea value={inputValue(vm.cx?.auth?.emergency)} onChange={vm.cx?.auth?.onEmergency} style={{
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
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '600' }}>
              {'Founder absence'}
            </span>
            <textarea value={inputValue(vm.cx?.auth?.absence)} onChange={vm.cx?.auth?.onAbsence} style={{
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
          <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
            {'Suggested starting wording. Edit it to match what you both agree.'}
          </span>
          {' '}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
        <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid oklch(0.94 0.005 85)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <span style={{ fontSize: '15px', fontWeight: '600' }}>
            {'Founder responsibility matrix'}
          </span>
          <button onClick={vm.cx?.auth?.addRow} style={{
              height: '28px',
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
            {'+ Add area'}
          </button>
        </div>
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) 150px 30px',
            gap: '10px',
            padding: '8px 18px',
            background: 'oklch(0.975 0.004 85)',
            fontSize: '12px',
            fontWeight: '600',
            color: 'oklch(0.5 0.012 265)',
          }}>
          <span>
            {'Area'}
          </span>
          <span>
            {'Primary responsibility'}
          </span>
          <span>
            {'Authority'}
          </span>
          <span />
        </div>
        {' '}
        {asList(vm.cx?.auth?.rows).map((row, index) => (<Fragment key={index}>
          <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) 150px 30px',
              gap: '10px',
              padding: '6px 18px',
              borderBottom: '1px solid oklch(0.95 0.004 85)',
              alignItems: 'center',
            }}>
            <input value={inputValue(row?.area)} onChange={row?.onArea} style={{
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
                borderColor: 'transparent',
                fontWeight: '600',
              }} className="scp9" />
            <input value={inputValue(row?.who)} onChange={row?.onWho} style={{
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
                borderColor: 'transparent',
              }} className="scp9" />
            <select value={inputValue(row?.lvl?.value)} onChange={row?.lvl?.onChange} style={{
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
              {asList(row?.lvl?.opts).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
            <button onClick={row?.remove} title="Remove" style={{
                border: '0',
                background: 'none',
                color: 'oklch(0.65 0.01 265)',
                fontSize: '16px',
                cursor: 'pointer',
              }}>
              {'×'}
            </button>
          </div>
        </Fragment>))}
        {' '}
      </div>
      {' '}
    </div>
  </>);
}
