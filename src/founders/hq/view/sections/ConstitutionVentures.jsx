/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList } from '../rt';

export default function ConstitutionVentures({ vm }) {
  return (<>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {' '}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
            display: 'flex',
            gap: '2px',
            padding: '3px',
            background: 'oklch(0.94 0.005 85)',
            borderRadius: '9px',
            width: 'fit-content',
            flexWrap: 'wrap',
          }}>
          {asList(vm.cx?.vtSeg).map((option, index) => (<Fragment key={index}>
            <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
              {show(option?.label)}
            </button>
          </Fragment>))}
        </div>
        <span style={{ flex: '1' }} />
        <div style={{
            display: 'flex',
            gap: '2px',
            padding: '3px',
            background: 'oklch(0.94 0.005 85)',
            borderRadius: '9px',
            width: 'fit-content',
            flexWrap: 'wrap',
          }}>
          {asList(vm.cx?.vvSeg).map((option, index) => (<Fragment key={index}>
            <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
              {show(option?.label)}
            </button>
          </Fragment>))}
        </div>
        <button onClick={vm.cx?.newVen} style={{
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
          {'+ New '}{show(vm.cx?.vtLbl)}{' proposal'}
        </button>
      </div>
      {' '}
      <button onClick={vm.cx?.vRule?.open} style={{
          border: '0',
          background: 'oklch(0.97 0.015 265)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          textAlign: 'left',
          cursor: 'pointer',
        }}>
        <span style={{
            fontFamily: '\'JetBrains Mono\',monospace',
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--acc, oklch(0.5 0.17 265))',
            paddingTop: '2px',
          }}>
          {show(vm.cx?.vRule?.code)}
        </span>
        <span style={{ flex: '1', minWidth: '220px', fontSize: '14px', lineHeight: '1.5', color: 'oklch(0.3 0.02 265)' }}>
          {show(vm.cx?.vRule?.text)}
        </span>
      </button>
      {' '}
      {vm.cx?.vBoard ? (<>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
          {asList(vm.cx?.vStages).map((stage, index) => (<Fragment key={index}>
            <div style={{
                flex: '0 0 224px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: 'oklch(0.97 0.004 85)',
                borderRadius: '12px',
                padding: '10px',
              }}>
              {' '}
              <div style={inlineStyle(`padding:2px 4px 8px;border-bottom:2px solid ${attr(stage?.col)};display:flex;flex-direction:column;gap:3px`)}>
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'oklch(0.5 0.012 265)' }}>
                    {'STAGE '}{show(stage?.n)}
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'oklch(0.45 0.012 265)' }}>
                    {show(stage?.count)}
                  </span>
                </span>
                <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                  {show(stage?.name)}
                </span>
                <span style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)', lineHeight: '1.4' }}>
                  {show(stage?.q)}
                </span>
              </div>
              {' '}
              {asList(stage?.items).map((venture, index) => (<Fragment key={index}>
                <button onClick={venture?.open} style={{
                    background: '#fff',
                    border: '1px solid oklch(0.915 0.006 85)',
                    borderRadius: '12px',
                    padding: '11px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }} className="scp6">
                  <span style={{ fontSize: '13.5px', fontWeight: '600', lineHeight: '1.3' }}>
                    {show(venture?.name)}
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
                    {show(venture?.meta)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                        flex: '1',
                        height: '4px',
                        borderRadius: '2px',
                        background: 'oklch(0.93 0.005 85)',
                        overflow: 'hidden',
                      }}>
                      <span style={inlineStyle(`display:block;height:100%;width:${attr(venture?.w)};background:${attr(venture?.pc)}`)} />
                    </span>
                    <span style={inlineStyle(`font-size:11px;font-weight:700;color:${attr(venture?.pc)}`)}>
                      {show(venture?.pct)}
                    </span>
                  </span>
                  {venture?.hasFlag ? (<>
                    <span style={inlineStyle(`font-size:11px;font-weight:600;color:${attr(venture?.flagC)}`)}>
                      {show(venture?.flag)}
                    </span>
                  </>) : null}
                </button>
              </Fragment>))}
              {' '}
            </div>
          </Fragment>))}
        </div>
      </>) : null}
      {' '}
      {vm.cx?.vList ? (<>
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
          {asList(vm.cx?.vRows).map((venture, index) => (<Fragment key={index}>
            <button onClick={venture?.open} style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr) 110px minmax(0,1fr)',
                gap: '12px',
                alignItems: 'center',
                border: '0',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
                background: '#fff',
                padding: '12px 16px',
                textAlign: 'left',
                cursor: 'pointer',
              }} className="scp7">
              <span style={{ minWidth: '0' }}>
                <span style={{ display: 'block', fontSize: '13.5px', fontWeight: '600' }}>
                  {show(venture?.name)}
                </span>
                <span style={{ display: 'block', fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
                  {show(venture?.meta)}
                </span>
              </span>
              <span style={{ fontSize: '12.5px', color: 'oklch(0.4 0.012 265)' }}>
                {show(venture?.stage)}
              </span>
              <span style={inlineStyle(`font-size:12px;font-weight:700;color:${attr(venture?.pc)}`)}>
                {show(venture?.pct)}{' complete'}
              </span>
              <span style={inlineStyle(`font-size:12px;color:${attr(venture?.flagC)};font-weight:600`)}>
                {show(venture?.flag)}
              </span>
            </button>
          </Fragment>))}
          {vm.cx?.noVen ? (<>
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.5 0.012 265)' }}>
              {'No proposals yet.'}
            </div>
          </>) : null}
        </div>
      </>) : null}
      {' '}
      {vm.cx?.isProd ? (<>
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            padding: '16px 18px',
          }}>
          <div style={{ fontSize: '14.5px', fontWeight: '600', marginBottom: '8px' }}>
            {'Product rules every proposal is checked against'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '2px 18px' }}>
            {asList(vm.cx?.prodRules).map((rule, index) => (<Fragment key={index}>
              <button onClick={rule?.open} style={{
                  display: 'flex',
                  gap: '10px',
                  border: '0',
                  background: 'none',
                  padding: '5px 0',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '13px',
                  lineHeight: '1.45',
                  color: 'oklch(0.3 0.012 265)',
                }}>
                <span style={{
                    fontFamily: '\'JetBrains Mono\',monospace',
                    fontSize: '11px',
                    color: 'oklch(0.55 0.012 265)',
                    paddingTop: '2px',
                  }}>
                  {show(rule?.code)}
                </span>
                <span>
                  {show(rule?.title)}
                </span>
              </button>
            </Fragment>))}
          </div>
        </div>
      </>) : null}
      {' '}
    </div>
  </>);
}
