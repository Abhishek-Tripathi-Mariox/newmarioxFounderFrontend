/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function VenturePanel({ vm }) {
  return (<>
    <div onClick={vm.cx?.V?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.3)', zIndex: '47' }} />
    <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        maxHeight: 'calc(100vh - 48px)',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: '14px',
        zIndex: '48',
        boxShadow: '0 24px 60px oklch(0.2 0.02 265 / 0.25)',
        width: 'min(900px,calc(100% - 32px))',
      }}>
      {' '}
      <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid oklch(0.94 0.005 85)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
        <span style={{
            fontSize: '10.5px',
            fontWeight: '700',
            padding: '3px 8px',
            borderRadius: '5px',
            background: 'oklch(0.95 0.03 265)',
            color: 'var(--acc, oklch(0.5 0.17 265))',
            whiteSpace: 'nowrap',
          }}>
          {show(vm.cx?.V?.typeLbl)}
        </span>
        <input value={inputValue(vm.cx?.V?.name)} onChange={vm.cx?.V?.onName} placeholder={vm.cx?.V?.namePh} style={{
            flex: '1',
            minWidth: '0',
            border: '0',
            outline: 'none',
            fontSize: '19px',
            fontWeight: '600',
            fontFamily: 'inherit',
            background: 'none',
          }} />
        <button onClick={vm.cx?.V?.close} style={{
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
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          padding: '14px 22px',
          borderBottom: '1px solid oklch(0.94 0.005 85)',
        }}>
        {asList(vm.cx?.V?.steps).map((step, index) => (<Fragment key={index}>
          <button onClick={step?.go} title={step?.q} style={{
              flex: '1 0 auto',
              minWidth: '84px',
              border: '0',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              alignItems: 'flex-start',
              padding: '0',
            }}>
            <span style={inlineStyle(`height:4px;width:100%;border-radius:2px;background:${attr(step?.bar)}`)} />
            <span style={inlineStyle(`font-size:11.5px;font-weight:${attr(step?.fw)};color:${attr(step?.fg)};white-space:nowrap`)}>
              {show(step?.n)}{'. '}{show(step?.name)}
            </span>
          </button>
        </Fragment>))}
      </div>
      {' '}
      <div style={{
          padding: '18px 22px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: '22px',
          alignItems: 'start',
        }}>
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '0' }}>
          <span style={{
              fontSize: '11.5px',
              fontWeight: '700',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'oklch(0.5 0.012 265)',
            }}>
            {show(vm.cx?.V?.formTitle)}{' · '}{show(vm.cx?.V?.pct)}{' complete'}
          </span>
          {asList(vm.cx?.V?.fields).map((field, index) => (<Fragment key={index}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '600', display: 'flex', gap: '6px', alignItems: 'center' }}>
                {show(field?.label)}
                {field?.empty ? (<>
                  <span title="Required" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'oklch(0.65 0.16 25)' }} />
                </>) : null}
              </span>
              <textarea value={inputValue(field?.v)} onChange={field?.on} placeholder={field?.hint} style={{
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
                  minHeight: '38px',
                  boxSizing: 'border-box',
                }} />
            </label>
          </Fragment>))}
        </div>
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: '0' }}>
          {' '}
          <div style={{ borderRadius: '10px', background: 'oklch(0.97 0.015 265)', padding: '14px' }}>
            <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--acc, oklch(0.5 0.17 265))',
                letterSpacing: '0.05em',
              }}>
              {'STAGE '}{show(vm.cx?.V?.stageN)}{' OF '}{show(vm.cx?.V?.stageT)}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '2px' }}>
              {show(vm.cx?.V?.stageName)}
            </div>
            <div style={{ fontSize: '13px', color: 'oklch(0.4 0.012 265)', marginTop: '4px', lineHeight: '1.5' }}>
              {show(vm.cx?.V?.stageQ)}
            </div>
          </div>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: '76px minmax(0,1fr)', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              {'Owner'}
            </span>
            <select value={inputValue(vm.cx?.V?.owner?.value)} onChange={vm.cx?.V?.owner?.onChange} style={{
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
              {asList(vm.cx?.V?.owner?.opts).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
            {vm.cx?.V?.isProd ? (<>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>
                {'Company'}
              </span>
              <select value={inputValue(vm.cx?.V?.co?.value)} onChange={vm.cx?.V?.co?.onChange} style={{
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
                {asList(vm.cx?.V?.co?.opts).map((option, index) => (<Fragment key={index}>
                  <option value={inputValue(option?.v)}>
                    {show(option?.l)}
                  </option>
                </Fragment>))}
              </select>
            </>) : null}
          </div>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              {'Founders\' approval'}
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {asList(vm.cx?.V?.signs).map((signature, index) => (<Fragment key={index}>
                <button onClick={signature?.go} disabled={signature?.dis} style={inlineStyle(`height:30px;border:1px solid ${attr(signature?.bd)};background:${attr(signature?.bg)};color:${attr(signature?.fg)};border-radius:15px;padding:0 12px;font-size:12.5px;font-weight:600;cursor:${attr(signature?.cur)}`)}>
                  {show(signature?.label)}
                </button>
              </Fragment>))}
            </div>
          </div>
          {' '}
          {vm.cx?.V?.hasGate ? (<>
            <div style={{
                fontSize: '12.5px',
                color: 'oklch(0.42 0.1 65)',
                lineHeight: '1.45',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'oklch(0.97 0.03 80)',
              }}>
              {show(vm.cx?.V?.gate)}
            </div>
          </>) : null}
          {' '}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {vm.cx?.V?.canBack ? (<>
              <button onClick={vm.cx?.V?.back} style={{
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
                {'← Back'}
              </button>
            </>) : null}
            {vm.cx?.V?.canNext ? (<>
              <button onClick={vm.cx?.V?.next} style={inlineStyle(`height:32px;border:0;background:var(--acc, oklch(0.5 0.17 265));color:#fff;border-radius:8px;padding:0 14px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;opacity:${attr(vm.cx?.V?.nextOp)}`)}>
                {show(vm.cx?.V?.nextLbl)}
              </button>
            </>) : null}
          </div>
          {' '}
          {vm.cx?.V?.isReview ? (<>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>
                {'30 / 60 / 90-day review'}
              </span>
              {asList(vm.cx?.V?.checks).map((check, index) => (<Fragment key={index}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.45 0.012 265)' }}>
                    {show(check?.l)}
                  </span>
                  <textarea value={inputValue(check?.v)} onChange={check?.on} placeholder="What happened against the plan?" style={{
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
                      minHeight: '38px',
                      boxSizing: 'border-box',
                    }} />
                </label>
              </Fragment>))}
              <span style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                {'Decision'}
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {asList(vm.cx?.V?.verdicts).map((option, index) => (<Fragment key={index}>
                  <button onClick={option?.go} style={inlineStyle(`height:30px;border:1px solid ${attr(option?.bd)};background:${attr(option?.bg)};color:${attr(option?.fg)};border-radius:8px;padding:0 12px;font-size:12.5px;font-weight:600;cursor:pointer`)}>
                    {show(option?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
          </>) : null}
          {' '}
          {vm.cx?.V?.canCreate ? (<>
            <button onClick={vm.cx?.V?.create} style={{
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
              {show(vm.cx?.V?.createLbl)}
            </button>
          </>) : null}
          {' '}
          {vm.cx?.V?.hasCreated ? (<>
            <button onClick={vm.cx?.V?.openCo} style={{
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
              {'Open '}{show(vm.cx?.V?.coName)}{' in Companies →'}
            </button>
          </>) : null}
          {' '}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{
          padding: '12px 22px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
        <span style={{ flex: '1', fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
          {show(vm.cx?.V?.meta)}
        </span>
        <button onClick={vm.cx?.V?.remove} style={{
            border: '0',
            background: 'none',
            color: 'oklch(0.5 0.18 25)',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
          {'Delete proposal'}
        </button>
      </div>
      {' '}
    </div>
  </>);
}
