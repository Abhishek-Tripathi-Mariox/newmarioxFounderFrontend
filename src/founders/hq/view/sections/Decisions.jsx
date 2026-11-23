/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';
import DecisionPanel from './DecisionPanel';

export default function Decisions({ vm }) {
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
          {'Decisions'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {show(vm.dl?.sub)}
        </div>
      </div>
      {' '}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={vm.dl?.copyList} title="Copy the decisions shown below as text" style={{
            height: '36px',
            border: '1px solid oklch(0.88 0.008 85)',
            background: '#fff',
            borderRadius: '8px',
            padding: '0 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.35 0.012 265)',
          }} className="scp10">
          {'Copy list'}
        </button>
        <button onClick={vm.dl?.add} style={{
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
          {'+ Log a decision'}
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
      {asList(vm.dl?.coTabs).map((companyTab, index) => (<Fragment key={index}>
        <button onClick={companyTab?.go} style={inlineStyle(`display:flex;align-items:center;gap:8px;border:0;background:none;padding:10px 12px;margin-bottom:-1px;border-bottom:2px solid ${attr(companyTab?.bd)};font-size:13.5px;font-weight:600;color:${attr(companyTab?.fg)};cursor:pointer;white-space:nowrap`)}>
          {companyTab?.hasTile ? (<>
            <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(companyTab?.tile)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center`)}>
              {show(companyTab?.ini)}
            </span>
          </>) : null}
          {show(companyTab?.label)}
          <span title="Waiting for a decision" style={{
              fontSize: '11.5px',
              fontWeight: '600',
              padding: '1px 7px',
              borderRadius: '9px',
              background: 'oklch(0.95 0.005 85)',
              color: 'oklch(0.45 0.012 265)',
            }}>
            {show(companyTab?.n)}
          </span>
        </button>
      </Fragment>))}
      {vm.dl?.coMore?.has ? (<>
        <input list={vm.dl?.coMore?.id} onChange={vm.dl?.coMore?.on} placeholder={vm.dl?.coMore?.ph} style={{
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
        <datalist id={vm.dl?.coMore?.id}>
          {asList(vm.dl?.coMore?.opts).map((option, index) => (<Fragment key={index}>
            <option value={inputValue(option?.l)} />
          </Fragment>))}
        </datalist>
      </>) : null}
      {' '}
    </div>
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(118px,1fr))', gap: '10px' }}>
      {' '}
      {asList(vm.dl?.tiles).map((tile, index) => (<Fragment key={index}>
        {' '}
        <button onClick={tile?.go} title={tile?.tip} style={inlineStyle(`text-align:left;background:${attr(tile?.bg)};border:1.5px solid ${attr(tile?.bd)};border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:3px;cursor:pointer`)} className="scp1b">
          {' '}
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
          {' '}
          <span style={inlineStyle(`font-size:22px;font-weight:600;letter-spacing:-0.01em;color:${attr(tile?.color)}`)}>
            {show(tile?.n)}
          </span>
          {' '}
        </button>
        {' '}
      </Fragment>))}
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
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          padding: '10px 12px',
          borderBottom: '1px solid oklch(0.94 0.005 85)',
        }}>
        {' '}
        <input value={inputValue(vm.dl?.q)} onChange={vm.dl?.onQ} placeholder="Search title, notes, options, comments" style={{
            flex: '0 1 260px',
            minWidth: '160px',
            height: '32px',
            padding: '0 12px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '8px',
            fontSize: '13px',
            outline: 'none',
          }} />
        {' '}
        {asList(vm.dl?.filters).map((filter, index) => (<Fragment key={index}>
          <select value={inputValue(filter?.value)} onChange={filter?.onChange} style={inlineStyle(`height:32px;border:1px solid ${attr(filter?.bd)};background:${attr(filter?.bg)};color:${attr(filter?.fg)};border-radius:8px;padding:0 8px;font-size:13px;font-weight:500;cursor:pointer;outline:none;font-family:inherit`)}>
            {asList(filter?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
        </Fragment>))}
        {' '}
        {vm.dl?.anyFilter ? (<>
          <button onClick={vm.dl?.clear} style={{
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
        {' '}
        {asList(vm.dl?.viewSel).map((viewSelect, index) => (<Fragment key={index}>
          <select value={inputValue(viewSelect?.value)} onChange={viewSelect?.onChange} style={inlineStyle(`height:32px;border:1px solid ${attr(viewSelect?.bd)};background:${attr(viewSelect?.bg)};color:${attr(viewSelect?.fg)};border-radius:8px;padding:0 8px;font-size:13px;font-weight:500;cursor:pointer;outline:none;font-family:inherit`)}>
            {asList(viewSelect?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
        </Fragment>))}
        {' '}
      </div>
      {' '}
      <div style={{
          padding: '8px 16px',
          fontSize: '12.5px',
          color: 'oklch(0.52 0.012 265)',
          borderBottom: '1px solid oklch(0.95 0.004 85)',
        }}>
        {show(vm.dl?.shown)}
      </div>
      {' '}
      {asList(vm.dl?.groups).map((group, index) => (<Fragment key={index}>
        {' '}
        {group?.showHead ? (<>
          <button onClick={group?.toggle} title="Show or hide" style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '0',
              background: 'oklch(0.975 0.004 85)',
              borderBottom: '1px solid oklch(0.95 0.004 85)',
              cursor: 'pointer',
              padding: '9px 16px',
              fontSize: '13.5px',
              fontWeight: '600',
              textAlign: 'left',
            }}>
            <span style={{ fontSize: '10px', color: 'oklch(0.52 0.012 265)', width: '12px' }}>
              {show(group?.caret)}
            </span>
            <span style={inlineStyle(`width:9px;height:9px;border-radius:50%;background:${attr(group?.dot)}`)} />
            {show(group?.label)}
            <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)' }}>
              {show(group?.count)}
            </span>
          </button>
        </>) : null}
        {' '}
        {group?.open ? (<>
          {asList(group?.rows).map((decision, index) => (<Fragment key={index}>
            {' '}
            <button onClick={decision?.go} style={inlineStyle(`width:100%;border:0;border-bottom:1px solid oklch(0.95 0.004 85);background:${attr(decision?.selBg)};padding:12px 16px;display:flex;flex-direction:column;gap:6px;cursor:pointer;text-align:left`)} className="scp4">
              {' '}
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', width: '100%' }}>
                {' '}
                <span style={inlineStyle(`display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:3px 9px;border-radius:7px;white-space:nowrap;background:${attr(decision?.stTint)};color:${attr(decision?.stInk)}`)}>
                  <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(decision?.stDot)}`)} />
                  {show(decision?.stLabel)}
                </span>
                {' '}
                <span style={inlineStyle(`flex:1 1 240px;min-width:0;font-size:14.5px;font-weight:600;color:${attr(decision?.titleColor)}`)}>
                  {show(decision?.titleOr)}
                </span>
                {' '}
                <span style={inlineStyle(`font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(decision?.impTint)};color:${attr(decision?.impInk)}`)}>
                  {show(decision?.impLabel)}
                </span>
                {' '}
                <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(decision?.coTint)};color:${attr(decision?.coInk)}`)}>
                  {show(decision?.coName)}
                </span>
                {' '}
                <span title={decision?.byName} style={inlineStyle(`width:22px;height:22px;border-radius:50%;background:${attr(decision?.byBg)};color:#fff;font-size:8.5px;font-weight:600;display:grid;place-items:center;flex-shrink:0`)}>
                  {show(decision?.byIni)}
                </span>
                {' '}
                <span style={inlineStyle(`font-size:12.5px;white-space:nowrap;min-width:110px;text-align:right;color:${attr(decision?.dateColor)};font-weight:${attr(decision?.dateWeight)}`)}>
                  {show(decision?.dateText)}
                </span>
                {' '}
              </span>
              {' '}
              {decision?.hasSummary ? (<>
                <span style={{
                    fontSize: '13px',
                    color: 'oklch(0.42 0.012 265)',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                  {show(decision?.summary)}
                </span>
              </>) : null}
              {' '}
              <span style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                {decision?.hasFol ? (<>
                  <span>
                    {show(decision?.folText)}
                  </span>
                </>) : null}
                {decision?.hasCm ? (<>
                  <span>
                    {show(decision?.cmText)}
                  </span>
                </>) : null}
              </span>
              {' '}
            </button>
            {' '}
          </Fragment>))}
        </>) : null}
        {' '}
      </Fragment>))}
      {' '}
      {vm.dl?.empty ? (<>
        <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
          }}>
          <span style={{ fontSize: '15px', fontWeight: '600' }}>
            {show(vm.dl?.emptyTitle)}
          </span>
          <span style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', maxWidth: '440px', lineHeight: '1.5' }}>
            {'Log open questions as Needs decision. Once all founders agree, mark them Decided with the reason, so nobody has to remember why.'}
          </span>
          {vm.dl?.emptyFilter ? (<>
            <button onClick={vm.dl?.clear} style={{
                height: '30px',
                border: '1px solid oklch(0.9 0.006 85)',
                background: '#fff',
                borderRadius: '7px',
                padding: '0 11px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'oklch(0.35 0.012 265)',
              }}>
              {'Clear filters'}
            </button>
          </>) : null}
        </div>
      </>) : null}
      {' '}
    </div>
    {' '}
    {vm.dl?.hasDP ? <DecisionPanel vm={vm} /> : null}
    {' '}
  </>);
}
