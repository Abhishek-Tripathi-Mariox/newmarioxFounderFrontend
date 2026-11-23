/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';
import NewCompanyDialog from './NewCompanyDialog';
import CompanyPanel from './CompanyPanel';

export default function Companies({ vm }) {
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
          {'Companies'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {show(vm.cm?.sub)}
        </div>
      </div>
      {' '}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={vm.cm?.copy} style={{
            height: '34px',
            border: '1px solid oklch(0.9 0.006 85)',
            background: '#fff',
            borderRadius: '7px',
            padding: '0 11px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.35 0.012 265)',
          }}>
          {'Copy list'}
        </button>
        <button onClick={vm.cm?.add} style={{
            height: '34px',
            border: '0',
            background: 'var(--acc, oklch(0.5 0.17 265))',
            color: '#fff',
            borderRadius: '8px',
            padding: '0 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
          {'+ New company'}
        </button>
      </div>
      {' '}
    </div>
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(118px,1fr))', gap: '10px' }}>
      {asList(vm.cm?.tiles).map((tile, index) => (<Fragment key={index}>
        <button onClick={tile?.go} style={inlineStyle(`text-align:left;background:${attr(tile?.bg)};border:1.5px solid ${attr(tile?.bd)};border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:3px;cursor:pointer`)}>
          <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '12.5px',
              fontWeight: '500',
              color: 'oklch(0.42 0.012 265)',
            }}>
            <span style={inlineStyle(`width:8px;height:8px;border-radius:50%;background:${attr(tile?.dot)}`)} />
            {show(tile?.label)}
          </span>
          <span style={{ fontSize: '22px', fontWeight: '600' }}>
            {show(tile?.n)}
          </span>
        </button>
      </Fragment>))}
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
      {' '}
      <input value={inputValue(vm.cm?.q)} onChange={vm.cm?.onQ} placeholder="Search name, country, industry" style={{
          flex: '0 1 240px',
          minWidth: '160px',
          height: '32px',
          padding: '0 12px',
          border: '1px solid oklch(0.9 0.006 85)',
          borderRadius: '8px',
          fontSize: '13px',
          outline: 'none',
        }} />
      {' '}
      {asList(vm.cm?.filters).map((filter, index) => (<Fragment key={index}>
        <select value={inputValue(filter?.value)} onChange={filter?.onChange} style={inlineStyle(`height:32px;border:1px solid ${attr(filter?.bd)};background:${attr(filter?.bg)};color:${attr(filter?.fg)};border-radius:8px;padding:0 8px;font-size:13px;font-weight:500;cursor:pointer;outline:none;font-family:inherit`)}>
          {asList(filter?.opts).map((option, index) => (<Fragment key={index}>
            <option value={inputValue(option?.v)}>
              {show(option?.l)}
            </option>
          </Fragment>))}
        </select>
      </Fragment>))}
      {' '}
      {vm.cm?.anyFilter ? (<>
        <button onClick={vm.cm?.clear} style={{
            height: '32px',
            border: '0',
            background: 'none',
            padding: '0 6px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--acc, oklch(0.5 0.17 265))',
            cursor: 'pointer',
          }}>
          {'Clear filters'}
        </button>
      </>) : null}
      {' '}
      <div style={{ flex: '1' }} />
      <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
        {show(vm.cm?.shown)}
      </span>
      {' '}
      <select value={inputValue(vm.cm?.sortSel?.value)} onChange={vm.cm?.sortSel?.onChange} style={{
          height: '32px',
          border: '1px solid oklch(0.9 0.006 85)',
          borderRadius: '7px',
          background: '#fff',
          fontSize: '12.5px',
          padding: '0 6px',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}>
        {asList(vm.cm?.sortSel?.opts).map((option, index) => (<Fragment key={index}>
          <option value={inputValue(option?.v)}>
            {show(option?.l)}
          </option>
        </Fragment>))}
      </select>
      <div style={{
          display: 'flex',
          gap: '2px',
          padding: '3px',
          background: 'oklch(0.94 0.005 85)',
          borderRadius: '9px',
          flexWrap: 'wrap',
          width: 'fit-content',
        }}>
        {asList(vm.cm?.viewSeg).map((option, index) => (<Fragment key={index}>
          <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
            {show(option?.label)}
          </button>
        </Fragment>))}
      </div>
      {' '}
    </div>
    {' '}
    {vm.cm?.isGrid ? (<>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: '12px' }}>
        {' '}
        {asList(vm.cm?.list).map((company, index) => (<Fragment key={index}>
          <div style={inlineStyle(`background:#fff;border:1px solid oklch(0.915 0.006 85);border-radius:12px;background:${attr(company?.selBg)};padding:14px;display:flex;flex-direction:column;gap:10px;position:relative`)} className="scp3">
            {' '}
            <button onClick={company?.togglePin} title="Pin to sidebar" style={inlineStyle(`position:absolute;top:10px;right:10px;border:0;background:none;cursor:pointer;font-size:16px;color:${attr(company?.pinC)}`)}>
              {show(company?.pin)}
            </button>
            {' '}
            <button onClick={company?.open} style={{
                border: '0',
                background: 'none',
                padding: '0',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
              {' '}
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '24px' }}>
                <span style={inlineStyle(`width:34px;height:34px;border-radius:9px;background:${attr(company?.bg)};color:#fff;font-size:14px;font-weight:700;display:grid;place-items:center;flex-shrink:0`)}>
                  {show(company?.ini)}
                </span>
                <span style={{ minWidth: '0' }}>
                  <span style={{
                      display: 'block',
                      fontSize: '15px',
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {show(company?.name)}
                  </span>
                  <span style={{
                      display: 'block',
                      fontSize: '12px',
                      color: 'oklch(0.52 0.012 265)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {show(company?.full)}
                  </span>
                </span>
              </span>
              {' '}
              <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', fontSize: '12px' }}>
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'oklch(0.96 0.004 265)',
                  }}>
                  <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(company?.stDot)}`)} />
                  {show(company?.status)}
                </span>
                <span style={inlineStyle(`font-weight:700;padding:2px 7px;border-radius:5px;background:${attr(company?.tint)};color:${attr(company?.ink)};font-family:'JetBrains Mono',monospace;font-size:11px`)}>
                  {show(company?.cc)}
                </span>
                <span style={{ color: 'oklch(0.45 0.012 265)' }}>
                  {show(company?.entity)}
                </span>
              </span>
              {' '}
              <span style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ fontWeight: '600' }}>
                    {'Setup'}
                  </span>
                  <span style={inlineStyle(`font-weight:700;color:${attr(company?.pcol)}`)}>
                    {show(company?.pct)}
                  </span>
                </span>
                <span style={{
                    display: 'block',
                    height: '6px',
                    background: 'oklch(0.94 0.005 85)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                  <span style={inlineStyle(`display:block;height:100%;width:${attr(company?.w)};background:${attr(company?.pcol)};border-radius:3px`)} />
                </span>
                <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
                  {show(company?.setupTxt)}
                </span>
              </span>
              {' '}
              <span style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'oklch(0.45 0.012 265)',
                  borderTop: '1px solid oklch(0.95 0.004 85)',
                  paddingTop: '8px',
                }}>
                <span>
                  {show(company?.industry)}
                </span>
                <span>
                  {'Cash '}{show(company?.cash)}
                </span>
              </span>
              {' '}
              <span style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'oklch(0.45 0.012 265)',
                }}>
                <span>
                  {show(company?.tasks)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={inlineStyle(`width:18px;height:18px;border-radius:50%;background:${attr(company?.obg)};color:#fff;font-size:7.5px;font-weight:600;display:grid;place-items:center`)}>
                    {show(company?.oini)}
                  </span>
                  {show(company?.owner)}
                </span>
              </span>
              {' '}
            </button>
            {' '}
          </div>
        </Fragment>))}
        {' '}
      </div>
    </>) : null}
    {' '}
    {vm.cm?.isTable ? (<>
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          overflowX: 'auto',
        }}>
        <div style={{ minWidth: '900px' }}>
          {' '}
          <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(200px,1fr) 110px 60px 140px 150px 170px 110px 100px',
              gap: '8px',
              padding: '9px 16px',
              fontSize: '12px',
              fontWeight: '600',
              color: 'oklch(0.48 0.012 265)',
              background: 'oklch(0.975 0.004 85)',
            }}>
            <span>
              {'Company'}
            </span>
            <span>
              {'Status'}
            </span>
            <span>
              {'Country'}
            </span>
            <span>
              {'Entity'}
            </span>
            <span>
              {'Industry'}
            </span>
            <span>
              {'Setup'}
            </span>
            <span>
              {'Cash'}
            </span>
            <span>
              {'Owner'}
            </span>
          </div>
          {' '}
          {asList(vm.cm?.list).map((company, index) => (<Fragment key={index}>
            <button onClick={company?.open} style={inlineStyle(`width:100%;display:grid;grid-template-columns:minmax(200px,1fr) 110px 60px 140px 150px 170px 110px 100px;gap:8px;align-items:center;padding:9px 16px;border:0;border-top:1px solid oklch(0.95 0.004 85);background:${attr(company?.selBg)};cursor:pointer;text-align:left;font-size:13px`)} className="scp4">
              <span style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: '0' }}>
                <span style={inlineStyle(`width:24px;height:24px;border-radius:6px;background:${attr(company?.bg)};color:#fff;font-size:11px;font-weight:700;display:grid;place-items:center;flex-shrink:0`)}>
                  {show(company?.ini)}
                </span>
                <span style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {show(company?.name)}
                </span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(company?.stDot)}`)} />
                {show(company?.status)}
              </span>
              <span style={{ fontFamily: '\'JetBrains Mono\',monospace', fontSize: '12px' }}>
                {show(company?.cc)}
              </span>
              <span>
                {show(company?.entity)}
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {show(company?.industry)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ flex: '1' }}>
                  <span style={{
                      display: 'block',
                      height: '6px',
                      background: 'oklch(0.94 0.005 85)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                    <span style={inlineStyle(`display:block;height:100%;width:${attr(company?.w)};background:${attr(company?.pcol)};border-radius:3px`)} />
                  </span>
                </span>
                <span style={inlineStyle(`font-weight:700;color:${attr(company?.pcol)};font-size:12px;min-width:34px;text-align:right`)}>
                  {show(company?.pct)}
                </span>
              </span>
              <span>
                {show(company?.cash)}
              </span>
              <span>
                {show(company?.owner)}
              </span>
            </button>
          </Fragment>))}
          {' '}
        </div>
      </div>
    </>) : null}
    {' '}
    {vm.cm?.empty ? (<>
      <div style={{ padding: '30px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.52 0.012 265)' }}>
        {'No companies match. '}
        <button onClick={vm.cm?.clear} style={{
            border: '0',
            background: 'none',
            color: 'var(--acc, oklch(0.5 0.17 265))',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '13.5px',
          }}>
          {'Clear filters'}
        </button>
      </div>
    </>) : null}
    {' '}
    {vm.cm?.hasNew ? <NewCompanyDialog vm={vm} /> : null}
    {' '}
    {vm.hasCP ? <CompanyPanel vm={vm} /> : null}
    {' '}
  </>);
}
