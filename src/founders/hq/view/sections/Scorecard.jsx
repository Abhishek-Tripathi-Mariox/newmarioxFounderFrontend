/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';
import ScorecardSetup from './ScorecardSetup';

export default function Scorecard({ vm }) {
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
      {asList(vm.hub?.weekly).map((hubTab, index) => (<Fragment key={index}>
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
          {'Scorecard'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {show(vm.sc?.sub)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {vm.sc?.isSingle ? (<>
          <div style={{
              display: 'flex',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              width: 'fit-content',
              flexWrap: 'wrap',
            }}>
            {asList(vm.sc?.editSeg).map((segment, index) => (<Fragment key={index}>
              <button onClick={segment?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
                {show(segment?.label)}
              </button>
            </Fragment>))}
          </div>
        </>) : null}
        <button onClick={vm.sc?.copy} style={{
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
          {'Copy as text'}
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
      {asList(vm.sc?.coTabs).map((coTab, index) => (<Fragment key={index}>
        <button onClick={coTab?.go} style={inlineStyle(`display:flex;align-items:center;gap:8px;border:0;background:none;padding:10px 12px;margin-bottom:-1px;border-bottom:2px solid ${attr(coTab?.bd)};font-size:13.5px;font-weight:600;color:${attr(coTab?.fg)};cursor:pointer;white-space:nowrap`)}>
          {coTab?.hasTile ? (<>
            <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(coTab?.tile)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center;flex-shrink:0`)}>
              {show(coTab?.ini)}
            </span>
          </>) : null}
          {show(coTab?.label)}
          {coTab?.hasN ? (<>
            <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '1px 7px',
                borderRadius: '9px',
                background: 'oklch(0.95 0.035 25)',
                color: 'oklch(0.48 0.17 25)',
              }}>
              {show(coTab?.n)}
            </span>
          </>) : null}
        </button>
      </Fragment>))}
      {vm.sc?.coMore?.has ? (<>
        <input list={vm.sc?.coMore?.id} onChange={vm.sc?.coMore?.on} placeholder={vm.sc?.coMore?.ph} style={{
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
        <datalist id={vm.sc?.coMore?.id}>
          {asList(vm.sc?.coMore?.opts).map((option, index) => (<Fragment key={index}>
            <option value={inputValue(option?.l)} />
          </Fragment>))}
        </datalist>
      </>) : null}
    </div>
    {' '}
    {vm.sc?.isAll ? (<>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '12px' }}>
        {asList(vm.sc?.cards).map((card, index) => (<Fragment key={index}>
          <div style={{
              background: '#fff',
              border: '1px solid oklch(0.915 0.006 85)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
            {' '}
            <button onClick={card?.go} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '0',
                background: 'none',
                padding: '0',
                cursor: 'pointer',
                textAlign: 'left',
              }}>
              <span style={inlineStyle(`width:30px;height:30px;border-radius:8px;background:${attr(card?.bg)};color:#fff;font-size:13px;font-weight:700;display:grid;place-items:center;flex-shrink:0`)}>
                {show(card?.ini)}
              </span>
              <span style={{ flex: '1', fontSize: '15px', fontWeight: '600' }}>
                {show(card?.name)}
              </span>
              <span style={inlineStyle(`font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;background:${attr(card?.tBg)};color:${attr(card?.tFg)};white-space:nowrap`)}>
                {show(card?.track)}
              </span>
            </button>
            {' '}
            {asList(card?.rows).map((metric, index) => (<Fragment key={index}>
              <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,1fr) 70px 84px',
                  gap: '10px',
                  alignItems: 'center',
                }}>
                <span style={{
                    fontSize: '13px',
                    color: 'oklch(0.35 0.012 265)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  {show(metric?.name)}
                </span>
                <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '20px' }}>
                  {asList(metric?.bars).map((bar, index) => (<Fragment key={index}>
                    <span style={inlineStyle(`flex:1;height:${attr(bar?.h)};background:${attr(bar?.c)};border-radius:1px`)} />
                  </Fragment>))}
                </span>
                <span style={inlineStyle(`font-size:13px;font-weight:700;text-align:right;color:${attr(metric?.col)};white-space:nowrap`)}>
                  {show(metric?.v)}
                </span>
              </div>
            </Fragment>))}
            {' '}
            {card?.hasMore ? (<>
              <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
                {show(card?.more)}
              </span>
            </>) : null}
            {' '}
            {card?.empty ? (<>
              <button onClick={card?.go} style={{
                  border: '1px dashed oklch(0.85 0.008 85)',
                  background: 'none',
                  borderRadius: '9px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'oklch(0.45 0.012 265)',
                  cursor: 'pointer',
                }}>
                {'Set up a scorecard'}
              </button>
            </>) : null}
            {' '}
          </div>
        </Fragment>))}
      </div>
    </>) : null}
    {' '}
    {vm.sc?.isSingle ? <ScorecardSetup vm={vm} /> : null}
    {' '}
  </>);
}
