/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function Finance({ vm }) {
  return (<>
    {' '}
    <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
      {' '}
      <div>
        <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '600', letterSpacing: '-0.015em' }}>
          {'Finance'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {'Cash, runway and where the money comes from and goes. Runway = cash ÷ monthly burn.'}
        </div>
      </div>
      {' '}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={vm.fn?.copy} title="Copy a short summary to share" style={{
            height: '34px',
            border: '1px solid oklch(0.88 0.008 85)',
            background: '#fff',
            borderRadius: '8px',
            padding: '0 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.35 0.012 265)',
          }}>
          {'Copy summary'}
        </button>
        <button onClick={vm.fn?.csv} title="Download the projection for Excel or Sheets" style={{
            height: '34px',
            border: '1px solid oklch(0.88 0.008 85)',
            background: '#fff',
            borderRadius: '8px',
            padding: '0 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.35 0.012 265)',
          }}>
          {'Download CSV'}
        </button>
      </div>
      {' '}
    </div>
    {' '}
    <div style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid oklch(0.915 0.006 85)',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}>
      {' '}
      {asList(vm.fn?.coTabs).map((coTab, index) => (<Fragment key={index}>
        <button onClick={coTab?.go} style={inlineStyle(`display:flex;align-items:center;gap:8px;border:0;background:none;padding:10px 12px;margin-bottom:-1px;border-bottom:2px solid ${attr(coTab?.bd)};font-size:13.5px;font-weight:600;color:${attr(coTab?.fg)};cursor:pointer;white-space:nowrap`)}>
          {coTab?.hasTile ? (<>
            <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(coTab?.tile)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center`)}>
              {show(coTab?.ini)}
            </span>
          </>) : null}
          {show(coTab?.label)}
        </button>
      </Fragment>))}
      {vm.fn?.coMore?.has ? (<>
        <input list={vm.fn?.coMore?.id} onChange={vm.fn?.coMore?.on} placeholder={vm.fn?.coMore?.ph} style={{
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
        <datalist id={vm.fn?.coMore?.id}>
          {asList(vm.fn?.coMore?.opts).map((option, index) => (<Fragment key={index}>
            <option value={inputValue(option?.l)} />
          </Fragment>))}
        </datalist>
      </>) : null}
      {' '}
    </div>
    {' '}
    {vm.fn?.hasAlerts ? (<>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {asList(vm.fn?.alerts).map((alertItem, index) => (<Fragment key={index}>
          <div style={inlineStyle(`display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:10px;background:${attr(alertItem?.bg)};border:1px solid ${attr(alertItem?.bd)};color:${attr(alertItem?.fg)};font-size:13.5px;font-weight:500`)}>
            <span style={{ fontWeight: '700' }}>
              {'!'}
            </span>
            {show(alertItem?.text)}
          </div>
        </Fragment>))}
      </div>
    </>) : null}
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(165px,1fr))', gap: '10px' }}>
      {' '}
      {asList(vm.fn?.kpis).map((kpi, index) => (<Fragment key={index}>
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}>
          <span style={{ fontSize: '12.5px', color: 'oklch(0.48 0.012 265)' }}>
            {show(kpi?.label)}
          </span>
          <span style={inlineStyle(`font-size:22px;font-weight:600;letter-spacing:-0.01em;color:${attr(kpi?.color)}`)}>
            {show(kpi?.value)}
          </span>
          <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
            {show(kpi?.sub)}
          </span>
        </div>
      </Fragment>))}
      {' '}
    </div>
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '12px' }}>
      {' '}
      {asList(vm.fn?.cos).map((company, index) => (<Fragment key={index}>
        {' '}
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
          {' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={inlineStyle(`width:26px;height:26px;border-radius:7px;background:${attr(company?.bg)};display:grid;place-items:center;font-size:12px;font-weight:700;color:#fff`)}>
              {show(company?.ini)}
            </span>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ fontSize: '15px', fontWeight: '600' }}>
                {show(company?.name)}
              </div>
              <div style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
                {show(company?.updated)}
              </div>
            </div>
            <button onClick={company?.snapshot} title="Save today's numbers as this month's actuals" style={{
                height: '28px',
                border: '1px solid oklch(0.88 0.008 85)',
                background: '#fff',
                borderRadius: '7px',
                padding: '0 10px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'oklch(0.35 0.012 265)',
              }}>
              {'Save as this month'}
            </button>
          </div>
          {' '}
          {asList(company?.fields).map((field, index) => (<Fragment key={index}>
            <label style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) 150px',
                alignItems: 'center',
                gap: '10px',
              }}>
              <span>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: '600' }}>
                  {show(field?.label)}
                </span>
                <span style={{ display: 'block', fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
                  {show(field?.help)}
                </span>
              </span>
              {field?.open ? (<>
                <input type="number" value={inputValue(field?.value)} onChange={field?.onChange} placeholder="0" style={{
                    height: '36px',
                    padding: '0 10px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '7px',
                    fontSize: '13.5px',
                    outline: 'none',
                    minWidth: '0',
                    background: '#fff',
                    textAlign: 'right',
                  }} />
              </>) : null}
              {field?.locked ? (<>
                <span title={field?.lockTxt} style={{
                    height: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    fontSize: '13.5px',
                    fontWeight: '600',
                  }}>
                  {show(field?.shown)}
                  <span style={{ fontSize: '10.5px', fontWeight: '500', color: 'oklch(0.55 0.012 265)' }}>
                    {show(field?.lockTxt)}
                  </span>
                </span>
              </>) : null}
            </label>
          </Fragment>))}
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '10px' }}>
            {asList(company?.pcts).map((pct, index) => (<Fragment key={index}>
              <label style={{
                  fontSize: '11.5px',
                  fontWeight: '500',
                  color: 'oklch(0.48 0.012 265)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}>
                {show(pct?.label)}
                <input type="number" step="0.5" value={inputValue(pct?.value)} onChange={pct?.onChange} placeholder="0" style={{
                    height: '32px',
                    padding: '0 10px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '7px',
                    fontSize: '13.5px',
                    outline: 'none',
                    minWidth: '0',
                    background: '#fff',
                  }} />
              </label>
            </Fragment>))}
          </div>
          {' '}
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              paddingTop: '12px',
              borderTop: '1px solid oklch(0.94 0.005 85)',
            }}>
            {' '}
            <div>
              <div style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
                {show(company?.netLabel)}
              </div>
              <div style={inlineStyle(`font-size:16px;font-weight:600;color:${attr(company?.netColor)};margin-top:2px`)}>
                {show(company?.net)}
              </div>
            </div>
            {' '}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
                {'Runway'}
              </div>
              <div style={inlineStyle(`font-size:16px;font-weight:600;color:${attr(company?.runColor)};margin-top:2px`)}>
                {show(company?.runway)}
              </div>
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </Fragment>))}
      {' '}
    </div>
    {' '}
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))',
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
        {' '}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            padding: '14px 16px',
            borderBottom: '1px solid oklch(0.94 0.005 85)',
          }}>
          {' '}
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>
              {'Cash projection'}
            </div>
            <div style={inlineStyle(`font-size:13px;font-weight:600;color:${attr(vm.fn?.outColor)};margin-top:3px`)}>
              {show(vm.fn?.outLabel)}
            </div>
          </div>
          {' '}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{
                display: 'flex',
                gap: '2px',
                padding: '3px',
                background: 'oklch(0.94 0.005 85)',
                borderRadius: '9px',
                flexWrap: 'wrap',
                width: 'fit-content',
              }}>
              {asList(vm.fn?.hzSeg).map((segment, index) => (<Fragment key={index}>
                <button onClick={segment?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
                  {show(segment?.label)}
                </button>
              </Fragment>))}
            </div>
            <div style={{
                display: 'flex',
                gap: '2px',
                padding: '3px',
                background: 'oklch(0.94 0.005 85)',
                borderRadius: '9px',
                flexWrap: 'wrap',
                width: 'fit-content',
              }}>
              {asList(vm.fn?.viewSeg).map((segment, index) => (<Fragment key={index}>
                <button onClick={segment?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
                  {show(segment?.label)}
                </button>
              </Fragment>))}
            </div>
          </div>
          {' '}
        </div>
        {' '}
        {vm.fn?.isChart ? (<>
          {' '}
          <div style={{ padding: '16px 16px 10px' }}>
            {' '}
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '4px',
                height: '190px',
                borderBottom: '1px solid oklch(0.88 0.006 85)',
              }}>
              {' '}
              {asList(vm.fn?.bars).map((bar, index) => (<Fragment key={index}>
                <div title={bar?.tip} style={{
                    flex: '1',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: '2px',
                    minWidth: '0',
                  }}>
                  {bar?.showBase ? (<>
                    <span style={inlineStyle(`width:35%;height:${attr(bar?.bh)};min-height:2px;background:oklch(0.88 0.01 265);border-radius:3px 3px 0 0`)} />
                  </>) : null}
                  <span style={inlineStyle(`width:60%;max-width:28px;height:${attr(bar?.h)};min-height:2px;background:${attr(bar?.bg)};border-radius:3px 3px 0 0`)} />
                </div>
              </Fragment>))}
              {' '}
            </div>
            {' '}
            <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
              {asList(vm.fn?.bars).map((bar, index) => (<Fragment key={index}>
                <span style={{
                    flex: '1',
                    minWidth: '0',
                    textAlign: 'center',
                    fontSize: '10.5px',
                    color: 'oklch(0.5 0.012 265)',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  {show(bar?.label)}
                </span>
              </Fragment>))}
            </div>
            {' '}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                flexWrap: 'wrap',
                marginTop: '10px',
                fontSize: '12px',
                color: 'oklch(0.52 0.012 265)',
              }}>
              <span>
                {show(vm.fn?.endCash)}
              </span>
              <span style={{ display: 'flex', gap: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '2px',
                      background: 'var(--acc, oklch(0.5 0.17 265))',
                    }} />
                  {'Cash'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'oklch(0.65 0.18 25)' }} />
                  {'Below zero'}
                </span>
                {vm.fn?.scOn ? (<>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'oklch(0.88 0.01 265)' }} />
                    {'Base plan'}
                  </span>
                </>) : null}
              </span>
            </div>
            {' '}
          </div>
          {' '}
        </>) : null}
        {' '}
        {vm.fn?.isTable ? (<>
          {' '}
          <div style={{ overflowX: 'auto', maxHeight: '420px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '560px' }}>
              <thead>
                <tr style={{
                    background: 'oklch(0.975 0.004 85)',
                    textAlign: 'right',
                    fontSize: '12px',
                    color: 'oklch(0.48 0.012 265)',
                    position: 'sticky',
                    top: '0',
                  }}>
                  <th style={{ padding: '9px 14px', fontWeight: '600', textAlign: 'left' }}>
                    {'Month'}
                  </th>
                  <th style={{ padding: '9px 14px', fontWeight: '600' }}>
                    {'Revenue'}
                  </th>
                  <th style={{ padding: '9px 14px', fontWeight: '600' }}>
                    {'Costs'}
                  </th>
                  <th style={{ padding: '9px 14px', fontWeight: '600' }}>
                    {'Net'}
                  </th>
                  <th style={{ padding: '9px 14px', fontWeight: '600' }}>
                    {'One-off'}
                  </th>
                  <th style={{ padding: '9px 14px', fontWeight: '600' }}>
                    {'Cash at end'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {asList(vm.fn?.rows).map((row, index) => (<Fragment key={index}>
                  <tr style={{ borderTop: '1px solid oklch(0.955 0.004 85)', textAlign: 'right' }}>
                    <td style={{ padding: '8px 14px', textAlign: 'left', fontWeight: '500' }}>
                      {show(row?.month)}
                    </td>
                    <td style={{ padding: '8px 14px' }}>
                      {show(row?.rev)}
                    </td>
                    <td style={{ padding: '8px 14px' }}>
                      {show(row?.cost)}
                    </td>
                    <td style={inlineStyle(`padding:8px 14px;color:${attr(row?.netColor)}`)}>
                      {show(row?.net)}
                    </td>
                    <td style={{ padding: '8px 14px', color: 'oklch(0.5 0.012 265)' }}>
                      {show(row?.once)}
                    </td>
                    <td style={inlineStyle(`padding:8px 14px;font-weight:600;color:${attr(row?.cashColor)}`)}>
                      {show(row?.cash)}
                    </td>
                  </tr>
                </Fragment>))}
              </tbody>
            </table>
          </div>
          {' '}
        </>) : null}
        {' '}
      </div>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
        {' '}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>
              {'What if…'}
            </div>
            <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'Try changes without touching your real numbers.'}
            </div>
          </div>
          {vm.fn?.scOn ? (<>
            <button onClick={vm.fn?.sc?.reset} style={{
                height: '28px',
                border: '1px solid oklch(0.88 0.008 85)',
                background: '#fff',
                borderRadius: '7px',
                padding: '0 10px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'oklch(0.35 0.012 265)',
              }}>
              {'Reset'}
            </button>
          </>) : null}
        </div>
        {' '}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
            {'Revenue growth'}
            <span style={{ fontWeight: '500', color: 'oklch(0.45 0.012 265)' }}>
              {show(vm.fn?.sc?.grow?.txt)}
            </span>
          </span>
          <input type="range" min={vm.fn?.sc?.grow?.min} max={vm.fn?.sc?.grow?.max} step={vm.fn?.sc?.grow?.step} value={inputValue(vm.fn?.sc?.grow?.value)} onChange={vm.fn?.sc?.grow?.onChange} style={{ width: '100%', accentColor: 'var(--acc, oklch(0.5 0.17 265))' }} />
        </label>
        {' '}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
            {'Change all costs'}
            <span style={{ fontWeight: '500', color: 'oklch(0.45 0.012 265)' }}>
              {show(vm.fn?.sc?.cost?.txt)}
            </span>
          </span>
          <input type="range" min={vm.fn?.sc?.cost?.min} max={vm.fn?.sc?.cost?.max} step={vm.fn?.sc?.cost?.step} value={inputValue(vm.fn?.sc?.cost?.value)} onChange={vm.fn?.sc?.cost?.onChange} style={{ width: '100%', accentColor: 'var(--acc, oklch(0.5 0.17 265))' }} />
        </label>
        {' '}
        <button onClick={vm.fn?.sc?.toggleHires} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            border: '0',
            background: 'none',
            padding: '0',
            cursor: 'pointer',
            textAlign: 'left',
          }}>
          <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;border:1.5px solid ${attr(vm.fn?.sc?.hiresBd)};background:${attr(vm.fn?.sc?.hiresBg)};color:#fff;font-size:11px;line-height:15px;text-align:center;flex-shrink:0;margin-top:1px`)}>
            {show(vm.fn?.sc?.hiresMark)}
          </span>
          <span>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: '600' }}>
              {'Include planned hires'}
            </span>
            <span style={{ display: 'block', fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
              {show(vm.fn?.sc?.hiresInfo)}
            </span>
          </span>
        </button>
        {' '}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 150px', gap: '8px', alignItems: 'end' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {'One-off expense (₹)'}
            <input type="number" value={inputValue(vm.fn?.sc?.oneAmt)} onChange={vm.fn?.sc?.onOneAmt} placeholder="e.g. laptops, office deposit" style={{
                height: '32px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                fontSize: '13.5px',
                outline: 'none',
                minWidth: '0',
                background: '#fff',
                fontWeight: '400',
              }} />
          </label>
          <select value={inputValue(vm.fn?.sc?.oneM)} onChange={vm.fn?.sc?.onOneM} style={{
              height: '32px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '7px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}>
            {asList(vm.fn?.sc?.monthOpts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
        </div>
        {' '}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 150px', gap: '8px', alignItems: 'end' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {'Money coming in (₹)'}
            <input type="number" value={inputValue(vm.fn?.sc?.raise)} onChange={vm.fn?.sc?.onRaise} placeholder="e.g. funding, loan, big payment" style={{
                height: '32px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                fontSize: '13.5px',
                outline: 'none',
                minWidth: '0',
                background: '#fff',
                fontWeight: '400',
              }} />
          </label>
          <select value={inputValue(vm.fn?.sc?.raiseM)} onChange={vm.fn?.sc?.onRaiseM} style={{
              height: '32px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '7px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}>
            {asList(vm.fn?.sc?.monthOpts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
        </div>
        {' '}
        <div style={{
            padding: '12px 14px',
            borderRadius: '10px',
            background: 'oklch(0.975 0.004 85)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {show(vm.fn?.sc?.compare)}
          </span>
          <span style={{ fontSize: '12.5px', color: 'oklch(0.48 0.012 265)' }}>
            {show(vm.fn?.sc?.endDiff)}
          </span>
        </div>
        {' '}
      </div>
      {' '}
    </div>
    {' '}
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}>
      <input value={inputValue(vm.fn?.q)} onChange={vm.fn?.onQ} placeholder="Search revenue, costs, invoices, bills" style={{
          flex: '0 1 280px',
          minWidth: '160px',
          height: '32px',
          padding: '0 12px',
          border: '1px solid oklch(0.9 0.006 85)',
          borderRadius: '8px',
          fontSize: '13px',
          outline: 'none',
        }} />
      <select value={inputValue(vm.fn?.catSel?.value)} onChange={vm.fn?.catSel?.onChange} style={{
          height: '32px',
          border: '1px solid oklch(0.9 0.006 85)',
          borderRadius: '7px',
          background: '#fff',
          fontSize: '12.5px',
          padding: '0 6px',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}>
        {asList(vm.fn?.catSel?.opts).map((option, index) => (<Fragment key={index}>
          <option value={inputValue(option?.v)}>
            {show(option?.l)}
          </option>
        </Fragment>))}
      </select>
      <div style={{ flex: '1' }} />
      <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
        {'Invoices & bills'}
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
        {asList(vm.fn?.rfSeg).map((segment, index) => (<Fragment key={index}>
          <button onClick={segment?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
            {show(segment?.label)}
          </button>
        </Fragment>))}
      </div>
    </div>
    {' '}
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(420px,1fr))',
        gap: '14px',
        alignItems: 'start',
      }}>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
        {' '}
        <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid oklch(0.94 0.005 85)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>
              {'Where money comes from '}
              <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)', marginLeft: '4px' }}>
                {show(vm.fn?.rev?.total)}{' / month'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'Clients and products that bring in money each month.'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {vm.fn?.rev?.showAddCo ? (<>
              <select value={inputValue(vm.fn?.rev?.addCo)} onChange={vm.fn?.rev?.onAddCo} title="Company for the new line" style={{
                  height: '30px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '7px',
                  background: '#fff',
                  fontSize: '12.5px',
                  padding: '0 6px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}>
                {asList(vm.fn?.rev?.coOpts).map((option, index) => (<Fragment key={index}>
                  <option value={inputValue(option?.v)}>
                    {show(option?.l)}
                  </option>
                </Fragment>))}
              </select>
            </>) : null}
            <button onClick={vm.fn?.rev?.add} style={{
                height: '30px',
                border: '0',
                background: 'var(--acc, oklch(0.5 0.17 265))',
                color: '#fff',
                borderRadius: '7px',
                padding: '0 12px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'+ Add line'}
            </button>
          </div>
        </div>
        {' '}
        {vm.fn?.rev?.hasCats ? (<>
          <div style={{
              padding: '10px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              borderBottom: '1px solid oklch(0.95 0.004 85)',
            }}>
            {asList(vm.fn?.rev?.cats).map((category, index) => (<Fragment key={index}>
              <div style={{
                  display: 'grid',
                  gridTemplateColumns: '120px minmax(0,1fr) 90px 40px',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '12.5px',
                }}>
                <span style={{ color: 'oklch(0.4 0.012 265)', fontWeight: '600' }}>
                  {show(category?.label)}
                </span>
                <span style={{
                    height: '7px',
                    background: 'oklch(0.95 0.005 85)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                  <span style={inlineStyle(`display:block;height:100%;width:${attr(category?.w)};background:var(--acc, oklch(0.5 0.17 265));border-radius:4px`)} />
                </span>
                <span style={{ textAlign: 'right' }}>
                  {show(category?.amt)}
                </span>
                <span style={{ textAlign: 'right', color: 'oklch(0.52 0.012 265)' }}>
                  {show(category?.pct)}
                </span>
              </div>
            </Fragment>))}
          </div>
        </>) : null}
        {' '}
        {asList(vm.fn?.rev?.rows).map((revenueRow, index) => (<Fragment key={index}>
          <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) 130px 120px 44px 26px',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 12px 5px 16px',
              borderBottom: '1px solid oklch(0.96 0.004 85)',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '0' }}>
              {revenueRow?.showCo ? (<>
                <select value={inputValue(revenueRow?.co)} onChange={revenueRow?.onCo} title="Company" style={inlineStyle(`height:30px;border:1px solid oklch(0.9 0.006 85);border-radius:7px;background:#fff;font-size:12.5px;padding:0 6px;font-family:inherit;cursor:pointer;height:26px;font-size:11.5px;font-weight:600;background:${attr(revenueRow?.coTint)};color:${attr(revenueRow?.coInk)};border-color:transparent`)}>
                  {asList(revenueRow?.coOpts).map((option, index) => (<Fragment key={index}>
                    <option value={inputValue(option?.v)}>
                      {show(option?.l)}
                    </option>
                  </Fragment>))}
                </select>
              </>) : null}
              <input data-fi={revenueRow?.id} value={inputValue(revenueRow?.name)} onChange={revenueRow?.onName} placeholder="Client or product" style={{
                  flex: '1',
                  minWidth: '0',
                  height: '32px',
                  border: '0',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '13.5px',
                }} />
            </div>
            <select value={inputValue(revenueRow?.cat)} onChange={revenueRow?.onCat} style={{
                height: '30px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                background: '#fff',
                fontSize: '12.5px',
                padding: '0 6px',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}>
              {asList(revenueRow?.cats).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
            <input type="number" value={inputValue(revenueRow?.amount)} onChange={revenueRow?.onAmt} placeholder="₹ / month" style={{
                height: '30px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                fontSize: '13.5px',
                outline: 'none',
                minWidth: '0',
                background: '#fff',
                textAlign: 'right',
              }} />
            <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)', textAlign: 'right' }}>
              {show(revenueRow?.pct)}
            </span>
            <button onClick={revenueRow?.remove} title="Remove" style={{
                border: '0',
                background: 'none',
                color: 'oklch(0.72 0.01 265)',
                fontSize: '15px',
                cursor: 'pointer',
                padding: '0',
              }} className="scp1c">
              {'×'}
            </button>
          </div>
        </Fragment>))}
        {' '}
        {vm.fn?.rev?.empty ? (<>
          <div style={{ padding: '16px', fontSize: '13px', color: 'oklch(0.52 0.012 265)', lineHeight: '1.5' }}>
            {'No lines yet. Add them to see where money comes from. Once you add lines, the monthly revenue figure is worked out from them.'}
          </div>
        </>) : null}
        {' '}
      </div>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
        {' '}
        <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid oklch(0.94 0.005 85)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>
              {'Where money goes '}
              <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)', marginLeft: '4px' }}>
                {show(vm.fn?.cost?.total)}{' / month'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'Salaries, rent, tools and other monthly costs.'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {vm.fn?.cost?.showAddCo ? (<>
              <select value={inputValue(vm.fn?.cost?.addCo)} onChange={vm.fn?.cost?.onAddCo} title="Company for the new line" style={{
                  height: '30px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '7px',
                  background: '#fff',
                  fontSize: '12.5px',
                  padding: '0 6px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}>
                {asList(vm.fn?.cost?.coOpts).map((option, index) => (<Fragment key={index}>
                  <option value={inputValue(option?.v)}>
                    {show(option?.l)}
                  </option>
                </Fragment>))}
              </select>
            </>) : null}
            <button onClick={vm.fn?.cost?.add} style={{
                height: '30px',
                border: '0',
                background: 'var(--acc, oklch(0.5 0.17 265))',
                color: '#fff',
                borderRadius: '7px',
                padding: '0 12px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'+ Add line'}
            </button>
          </div>
        </div>
        {' '}
        {vm.fn?.cost?.hasCats ? (<>
          <div style={{
              padding: '10px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              borderBottom: '1px solid oklch(0.95 0.004 85)',
            }}>
            {asList(vm.fn?.cost?.cats).map((category, index) => (<Fragment key={index}>
              <div style={{
                  display: 'grid',
                  gridTemplateColumns: '120px minmax(0,1fr) 90px 40px',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '12.5px',
                }}>
                <span style={{ color: 'oklch(0.4 0.012 265)', fontWeight: '600' }}>
                  {show(category?.label)}
                </span>
                <span style={{
                    height: '7px',
                    background: 'oklch(0.95 0.005 85)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                  <span style={inlineStyle(`display:block;height:100%;width:${attr(category?.w)};background:var(--acc, oklch(0.5 0.17 265));border-radius:4px`)} />
                </span>
                <span style={{ textAlign: 'right' }}>
                  {show(category?.amt)}
                </span>
                <span style={{ textAlign: 'right', color: 'oklch(0.52 0.012 265)' }}>
                  {show(category?.pct)}
                </span>
              </div>
            </Fragment>))}
          </div>
        </>) : null}
        {' '}
        {asList(vm.fn?.cost?.rows).map((costRow, index) => (<Fragment key={index}>
          <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) 130px 120px 44px 26px',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 12px 5px 16px',
              borderBottom: '1px solid oklch(0.96 0.004 85)',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '0' }}>
              {costRow?.showCo ? (<>
                <select value={inputValue(costRow?.co)} onChange={costRow?.onCo} title="Company" style={inlineStyle(`height:30px;border:1px solid oklch(0.9 0.006 85);border-radius:7px;background:#fff;font-size:12.5px;padding:0 6px;font-family:inherit;cursor:pointer;height:26px;font-size:11.5px;font-weight:600;background:${attr(costRow?.coTint)};color:${attr(costRow?.coInk)};border-color:transparent`)}>
                  {asList(costRow?.coOpts).map((option, index) => (<Fragment key={index}>
                    <option value={inputValue(option?.v)}>
                      {show(option?.l)}
                    </option>
                  </Fragment>))}
                </select>
              </>) : null}
              <input data-fi={costRow?.id} value={inputValue(costRow?.name)} onChange={costRow?.onName} placeholder="Cost item" style={{
                  flex: '1',
                  minWidth: '0',
                  height: '32px',
                  border: '0',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '13.5px',
                }} />
            </div>
            <select value={inputValue(costRow?.cat)} onChange={costRow?.onCat} style={{
                height: '30px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                background: '#fff',
                fontSize: '12.5px',
                padding: '0 6px',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}>
              {asList(costRow?.cats).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
            <input type="number" value={inputValue(costRow?.amount)} onChange={costRow?.onAmt} placeholder="₹ / month" style={{
                height: '30px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                fontSize: '13.5px',
                outline: 'none',
                minWidth: '0',
                background: '#fff',
                textAlign: 'right',
              }} />
            <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)', textAlign: 'right' }}>
              {show(costRow?.pct)}
            </span>
            <button onClick={costRow?.remove} title="Remove" style={{
                border: '0',
                background: 'none',
                color: 'oklch(0.72 0.01 265)',
                fontSize: '15px',
                cursor: 'pointer',
                padding: '0',
              }} className="scp1c">
              {'×'}
            </button>
          </div>
        </Fragment>))}
        {' '}
        {vm.fn?.cost?.empty ? (<>
          <div style={{ padding: '16px', fontSize: '13px', color: 'oklch(0.52 0.012 265)', lineHeight: '1.5' }}>
            {'No lines yet. Add them to see where money goes. Once you add lines, the monthly cost figure is worked out from them.'}
          </div>
        </>) : null}
        {' '}
      </div>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
        {' '}
        <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid oklch(0.94 0.005 85)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>
              {'Money owed to us '}
              <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)', marginLeft: '4px' }}>
                {show(vm.fn?.recvOpenTxt)}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'Invoices sent but not yet paid. "Received" adds the amount to cash.'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {vm.fn?.recv?.showAddCo ? (<>
              <select value={inputValue(vm.fn?.recv?.addCo)} onChange={vm.fn?.recv?.onAddCo} style={{
                  height: '30px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '7px',
                  background: '#fff',
                  fontSize: '12.5px',
                  padding: '0 6px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}>
                {asList(vm.fn?.recv?.coOpts).map((option, index) => (<Fragment key={index}>
                  <option value={inputValue(option?.v)}>
                    {show(option?.l)}
                  </option>
                </Fragment>))}
              </select>
            </>) : null}
            <button onClick={vm.fn?.recv?.add} style={{
                height: '30px',
                border: '0',
                background: 'var(--acc, oklch(0.5 0.17 265))',
                color: '#fff',
                borderRadius: '7px',
                padding: '0 12px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'+ Add'}
            </button>
          </div>
        </div>
        {' '}
        {asList(vm.fn?.recv?.rows).map((receivable, index) => (<Fragment key={index}>
          <div style={inlineStyle(`display:grid;grid-template-columns:minmax(0,1fr) 120px 132px 92px 26px;align-items:center;gap:8px;padding:5px 12px 5px 16px;border-bottom:1px solid oklch(0.96 0.004 85);opacity:${attr(receivable?.rowOp)}`)}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '0' }}>
                {receivable?.showCo ? (<>
                  <select value={inputValue(receivable?.co)} onChange={receivable?.onCo} style={inlineStyle(`height:30px;border:1px solid oklch(0.9 0.006 85);border-radius:7px;background:#fff;font-size:12.5px;padding:0 6px;font-family:inherit;cursor:pointer;height:26px;font-size:11.5px;font-weight:600;background:${attr(receivable?.coTint)};color:${attr(receivable?.coInk)};border-color:transparent`)}>
                    {asList(receivable?.coOpts).map((option, index) => (<Fragment key={index}>
                      <option value={inputValue(option?.v)}>
                        {show(option?.l)}
                      </option>
                    </Fragment>))}
                  </select>
                </>) : null}
                <input data-fi={receivable?.id} value={inputValue(receivable?.name)} onChange={receivable?.onName} placeholder="Client / invoice" style={{
                    flex: '1',
                    minWidth: '0',
                    height: '30px',
                    border: '0',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '13.5px',
                  }} />
              </div>
              <span style={inlineStyle(`font-size:11.5px;font-weight:600;color:${attr(receivable?.dueColor)};padding-left:2px`)}>
                {show(receivable?.dueTxt)}
              </span>
            </div>
            <input type="number" value={inputValue(receivable?.amount)} onChange={receivable?.onAmt} placeholder="₹ amount" style={{
                height: '30px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                fontSize: '13.5px',
                outline: 'none',
                minWidth: '0',
                background: '#fff',
                textAlign: 'right',
              }} />
            <input type="date" value={inputValue(receivable?.due)} onChange={receivable?.onDue} style={{
                height: '30px',
                padding: '0 6px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                fontSize: '12.5px',
                outline: 'none',
                minWidth: '0',
                background: '#fff',
                fontFamily: 'inherit',
              }} />
            {receivable?.notPaid ? (<>
              <button onClick={receivable?.markPaid} title="Marks it paid and updates cash in bank" style={{
                  height: '28px',
                  border: '1px solid oklch(0.85 0.06 150)',
                  background: 'oklch(0.97 0.02 150)',
                  color: 'oklch(0.38 0.1 150)',
                  borderRadius: '7px',
                  padding: '0 8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}>
                {'Received'}
              </button>
            </>) : null}
            {receivable?.paid ? (<>
              <button onClick={receivable?.unpay} title="Mark as unpaid (cash is not changed)" style={{
                  height: '28px',
                  border: '0',
                  background: 'none',
                  color: 'oklch(0.45 0.12 150)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'✓ Paid'}
              </button>
            </>) : null}
            <button onClick={receivable?.remove} title="Remove" style={{
                border: '0',
                background: 'none',
                color: 'oklch(0.72 0.01 265)',
                fontSize: '15px',
                cursor: 'pointer',
                padding: '0',
              }}>
              {'×'}
            </button>
          </div>
        </Fragment>))}
        {' '}
        {vm.fn?.recv?.empty ? (<>
          <div style={{ padding: '16px', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
            {'Nothing here for this filter.'}
          </div>
        </>) : null}
        {' '}
      </div>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
        {' '}
        <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid oklch(0.94 0.005 85)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>
              {'Bills to pay '}
              <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)', marginLeft: '4px' }}>
                {show(vm.fn?.payOpenTxt)}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'Upcoming payments. "Paid" takes the amount out of cash.'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {vm.fn?.pay?.showAddCo ? (<>
              <select value={inputValue(vm.fn?.pay?.addCo)} onChange={vm.fn?.pay?.onAddCo} style={{
                  height: '30px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '7px',
                  background: '#fff',
                  fontSize: '12.5px',
                  padding: '0 6px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}>
                {asList(vm.fn?.pay?.coOpts).map((option, index) => (<Fragment key={index}>
                  <option value={inputValue(option?.v)}>
                    {show(option?.l)}
                  </option>
                </Fragment>))}
              </select>
            </>) : null}
            <button onClick={vm.fn?.pay?.add} style={{
                height: '30px',
                border: '0',
                background: 'var(--acc, oklch(0.5 0.17 265))',
                color: '#fff',
                borderRadius: '7px',
                padding: '0 12px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'+ Add'}
            </button>
          </div>
        </div>
        {' '}
        {asList(vm.fn?.pay?.rows).map((payable, index) => (<Fragment key={index}>
          <div style={inlineStyle(`display:grid;grid-template-columns:minmax(0,1fr) 120px 132px 92px 26px;align-items:center;gap:8px;padding:5px 12px 5px 16px;border-bottom:1px solid oklch(0.96 0.004 85);opacity:${attr(payable?.rowOp)}`)}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '0' }}>
                {payable?.showCo ? (<>
                  <select value={inputValue(payable?.co)} onChange={payable?.onCo} style={inlineStyle(`height:30px;border:1px solid oklch(0.9 0.006 85);border-radius:7px;background:#fff;font-size:12.5px;padding:0 6px;font-family:inherit;cursor:pointer;height:26px;font-size:11.5px;font-weight:600;background:${attr(payable?.coTint)};color:${attr(payable?.coInk)};border-color:transparent`)}>
                    {asList(payable?.coOpts).map((option, index) => (<Fragment key={index}>
                      <option value={inputValue(option?.v)}>
                        {show(option?.l)}
                      </option>
                    </Fragment>))}
                  </select>
                </>) : null}
                <input data-fi={payable?.id} value={inputValue(payable?.name)} onChange={payable?.onName} placeholder="Vendor / bill" style={{
                    flex: '1',
                    minWidth: '0',
                    height: '30px',
                    border: '0',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '13.5px',
                  }} />
              </div>
              <span style={inlineStyle(`font-size:11.5px;font-weight:600;color:${attr(payable?.dueColor)};padding-left:2px`)}>
                {show(payable?.dueTxt)}
              </span>
            </div>
            <input type="number" value={inputValue(payable?.amount)} onChange={payable?.onAmt} placeholder="₹ amount" style={{
                height: '30px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                fontSize: '13.5px',
                outline: 'none',
                minWidth: '0',
                background: '#fff',
                textAlign: 'right',
              }} />
            <input type="date" value={inputValue(payable?.due)} onChange={payable?.onDue} style={{
                height: '30px',
                padding: '0 6px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                fontSize: '12.5px',
                outline: 'none',
                minWidth: '0',
                background: '#fff',
                fontFamily: 'inherit',
              }} />
            {payable?.notPaid ? (<>
              <button onClick={payable?.markPaid} title="Marks it paid and updates cash in bank" style={{
                  height: '28px',
                  border: '1px solid oklch(0.85 0.06 150)',
                  background: 'oklch(0.97 0.02 150)',
                  color: 'oklch(0.38 0.1 150)',
                  borderRadius: '7px',
                  padding: '0 8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}>
                {'Paid'}
              </button>
            </>) : null}
            {payable?.paid ? (<>
              <button onClick={payable?.unpay} title="Mark as unpaid (cash is not changed)" style={{
                  height: '28px',
                  border: '0',
                  background: 'none',
                  color: 'oklch(0.45 0.12 150)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'✓ Paid'}
              </button>
            </>) : null}
            <button onClick={payable?.remove} title="Remove" style={{
                border: '0',
                background: 'none',
                color: 'oklch(0.72 0.01 265)',
                fontSize: '15px',
                cursor: 'pointer',
                padding: '0',
              }}>
              {'×'}
            </button>
          </div>
        </Fragment>))}
        {' '}
        {vm.fn?.pay?.empty ? (<>
          <div style={{ padding: '16px', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
            {'Nothing here for this filter.'}
          </div>
        </>) : null}
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
      {' '}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid oklch(0.94 0.005 85)' }}>
        <div style={{ fontSize: '15px', fontWeight: '600' }}>
          {'Monthly actuals · last 6 months'}
        </div>
        <div style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
          {vm.fn?.isSingle ? (<>
            {'Type what really happened each month, or use "Save as this month" above.'}
          </>) : null}
          {vm.fn?.isCombined ? (<>
            {'Totals across companies. Pick a company tab to edit.'}
          </>) : null}
        </div>
      </div>
      {' '}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}>
        {' '}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {' '}
          <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '10px',
              height: '150px',
              borderBottom: '1px solid oklch(0.88 0.006 85)',
            }}>
            {asList(vm.fn?.act).map((activity, index) => (<Fragment key={index}>
              <div title={activity?.tip} style={{
                  flex: '1',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  gap: '3px',
                }}>
                <span style={inlineStyle(`width:38%;max-width:22px;height:${attr(activity?.rh)};min-height:2px;background:oklch(0.62 0.13 150);border-radius:3px 3px 0 0`)} />
                <span style={inlineStyle(`width:38%;max-width:22px;height:${attr(activity?.ch)};min-height:2px;background:oklch(0.7 0.12 50);border-radius:3px 3px 0 0`)} />
              </div>
            </Fragment>))}
          </div>
          {' '}
          <div style={{ display: 'flex', gap: '10px' }}>
            {asList(vm.fn?.act).map((activity, index) => (<Fragment key={index}>
              <span style={{ flex: '1', textAlign: 'center', fontSize: '11px', color: 'oklch(0.5 0.012 265)' }}>
                {show(activity?.short)}
              </span>
            </Fragment>))}
          </div>
          {' '}
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'oklch(0.48 0.012 265)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'oklch(0.62 0.13 150)' }} />
              {'Revenue'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'oklch(0.7 0.12 50)' }} />
              {'Costs'}
            </span>
          </div>
          {' '}
        </div>
        {' '}
        <div style={{ overflowX: 'auto', borderLeft: '1px solid oklch(0.95 0.004 85)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '460px' }}>
            <thead>
              <tr style={{
                  background: 'oklch(0.975 0.004 85)',
                  textAlign: 'right',
                  fontSize: '12px',
                  color: 'oklch(0.48 0.012 265)',
                }}>
                <th style={{ padding: '9px 12px', fontWeight: '600', textAlign: 'left' }}>
                  {'Month'}
                </th>
                <th style={{ padding: '9px 12px', fontWeight: '600' }}>
                  {'Revenue'}
                </th>
                <th style={{ padding: '9px 12px', fontWeight: '600' }}>
                  {'Costs'}
                </th>
                <th style={{ padding: '9px 12px', fontWeight: '600' }}>
                  {'Net'}
                </th>
                <th style={{ padding: '9px 12px', fontWeight: '600' }}>
                  {'Cash at end'}
                </th>
              </tr>
            </thead>
            <tbody>
              {asList(vm.fn?.act).map((activity, index) => (<Fragment key={index}>
                <tr style={{ borderTop: '1px solid oklch(0.955 0.004 85)', textAlign: 'right' }}>
                  <td style={{ padding: '6px 12px', textAlign: 'left', fontWeight: '500', whiteSpace: 'nowrap' }}>
                    {show(activity?.label)}
                  </td>
                  {vm.fn?.isSingle ? (<>
                    <td style={{ padding: '4px 6px' }}>
                      <input type="number" value={inputValue(activity?.rev)} onChange={activity?.onRev} placeholder="—" style={{
                          height: '30px',
                          padding: '0 10px',
                          border: '1px solid oklch(0.9 0.006 85)',
                          borderRadius: '7px',
                          fontSize: '13.5px',
                          outline: 'none',
                          minWidth: '0',
                          background: '#fff',
                          width: '100%',
                          textAlign: 'right',
                        }} />
                    </td>
                    <td style={{ padding: '4px 6px' }}>
                      <input type="number" value={inputValue(activity?.cost)} onChange={activity?.onCost} placeholder="—" style={{
                          height: '30px',
                          padding: '0 10px',
                          border: '1px solid oklch(0.9 0.006 85)',
                          borderRadius: '7px',
                          fontSize: '13.5px',
                          outline: 'none',
                          minWidth: '0',
                          background: '#fff',
                          width: '100%',
                          textAlign: 'right',
                        }} />
                    </td>
                    <td style={inlineStyle(`padding:6px 12px;color:${attr(activity?.netC)}`)}>
                      {show(activity?.netT)}
                    </td>
                    <td style={{ padding: '4px 6px' }}>
                      <input type="number" value={inputValue(activity?.cash)} onChange={activity?.onCash} placeholder="—" style={{
                          height: '30px',
                          padding: '0 10px',
                          border: '1px solid oklch(0.9 0.006 85)',
                          borderRadius: '7px',
                          fontSize: '13.5px',
                          outline: 'none',
                          minWidth: '0',
                          background: '#fff',
                          width: '100%',
                          textAlign: 'right',
                        }} />
                    </td>
                  </>) : null}
                  {vm.fn?.isCombined ? (<>
                    <td style={{ padding: '8px 12px' }}>
                      {show(activity?.revT)}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      {show(activity?.costT)}
                    </td>
                    <td style={inlineStyle(`padding:8px 12px;color:${attr(activity?.netC)}`)}>
                      {show(activity?.netT)}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      {show(activity?.cashT)}
                    </td>
                  </>) : null}
                </tr>
              </Fragment>))}
            </tbody>
          </table>
        </div>
        {' '}
      </div>
      {' '}
    </div>
    {' '}
  </>);
}
