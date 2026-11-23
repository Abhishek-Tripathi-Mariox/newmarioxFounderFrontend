/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function ConstitutionAmendments({ vm }) {
  return (<>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          padding: '16px 18px',
        }}>
        <div style={{ fontSize: '14.5px', fontWeight: '600', marginBottom: '12px' }}>
          {'No one silently overwrites a rule'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '10px' }}>
          {asList(vm.cx?.amdSteps).map((step, index) => (<Fragment key={index}>
            <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
              <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'oklch(0.95 0.03 265)',
                  color: 'var(--acc, oklch(0.5 0.17 265))',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: '0',
                }}>
                {show(step?.n)}
              </span>
              <span style={{ fontSize: '12.5px', lineHeight: '1.4', color: 'oklch(0.35 0.012 265)' }}>
                {show(step?.t)}
              </span>
            </div>
          </Fragment>))}
        </div>
      </div>
      {' '}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
            display: 'flex',
            gap: '2px',
            padding: '3px',
            background: 'oklch(0.94 0.005 85)',
            borderRadius: '9px',
            width: 'fit-content',
            flexWrap: 'wrap',
          }}>
          {asList(vm.cx?.amdSeg).map((option, index) => (<Fragment key={index}>
            <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
              {show(option?.label)}
            </button>
          </Fragment>))}
        </div>
        <span style={{ flex: '1' }} />
        <button onClick={vm.cx?.newAmd} style={{
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
          {'+ Propose amendment'}
        </button>
      </div>
      {' '}
      {asList(vm.cx?.amds).map((amendment, index) => (<Fragment key={index}>
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
          {' '}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <span style={inlineStyle(`font-size:10.5px;font-weight:700;padding:3px 8px;border-radius:5px;background:${attr(amendment?.tBg)};color:${attr(amendment?.tFg)}`)}>
              {show(amendment?.type)}
            </span>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ fontSize: '15px', fontWeight: '600' }}>
                <span style={{
                    fontFamily: '\'JetBrains Mono\',monospace',
                    fontSize: '12.5px',
                    color: 'oklch(0.5 0.012 265)',
                    fontWeight: '500',
                  }}>
                  {show(amendment?.code)}
                </span>
                {' '}{show(amendment?.title)}
              </div>
              <div style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
                {show(amendment?.meta)}
              </div>
            </div>
            <span style={inlineStyle(`font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;background:${attr(amendment?.sBg)};color:${attr(amendment?.sFg)}`)}>
              {show(amendment?.st)}
            </span>
          </div>
          {' '}
          <div style={{ fontSize: '13.5px', lineHeight: '1.5' }}>
            <span style={{ fontWeight: '600' }}>
              {'Reason: '}
            </span>
            <span style={{ color: 'oklch(0.35 0.012 265)' }}>
              {show(amendment?.reason)}
            </span>
          </div>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '8px' }}>
            {amendment?.hasOld ? (<>
              <div style={{ borderRadius: '9px', padding: '10px 12px', background: 'oklch(0.97 0.02 25)' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'oklch(0.5 0.15 25)', marginBottom: '4px' }}>
                  {show(amendment?.oldLbl)}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                  {show(amendment?.oldTitle)}
                </div>
                <div style={{ fontSize: '13px', lineHeight: '1.5', color: 'oklch(0.35 0.012 265)' }}>
                  {show(amendment?.oldText)}
                </div>
              </div>
            </>) : null}
            {amendment?.hasNew ? (<>
              <div style={{ borderRadius: '9px', padding: '10px 12px', background: 'oklch(0.97 0.03 150)' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'oklch(0.42 0.12 150)', marginBottom: '4px' }}>
                  {'PROPOSED'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                  {show(amendment?.newTitle)}
                </div>
                <div style={{ fontSize: '13px', lineHeight: '1.5', color: 'oklch(0.35 0.012 265)' }}>
                  {show(amendment?.newText)}
                </div>
              </div>
            </>) : null}
          </div>
          {' '}
          {asList(amendment?.comments).map((comment, index) => (<Fragment key={index}>
            <div style={{
                fontSize: '13px',
                lineHeight: '1.45',
                paddingLeft: '10px',
                borderLeft: '2px solid oklch(0.92 0.005 85)',
              }}>
              <span style={{ fontWeight: '600' }}>
                {show(comment?.who)}
              </span>
              {' '}
              <span style={{ color: 'oklch(0.55 0.012 265)', fontSize: '11.5px' }}>
                {show(comment?.when)}
              </span>
              <div style={{ color: 'oklch(0.35 0.012 265)' }}>
                {show(comment?.text)}
              </div>
            </div>
          </Fragment>))}
          {' '}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {asList(amendment?.signs).map((signature, index) => (<Fragment key={index}>
              <span style={inlineStyle(`height:26px;border-radius:13px;padding:0 10px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;background:${attr(signature?.bg)};color:${attr(signature?.fg)};border:1px solid ${attr(signature?.bd)}`)}>
                {show(signature?.label)}
              </span>
            </Fragment>))}
            <span style={{ flex: '1' }} />
            {amendment?.isOpen ? (<>
              <input value={inputValue(amendment?.draft)} onChange={amendment?.onDraft} onKeyDown={amendment?.onKey} placeholder="Comment, then Enter" style={{
                  height: '30px',
                  padding: '0 10px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  outline: 'none',
                  background: '#fff',
                  minWidth: '0',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  width: '190px',
                }} />
              {amendment?.canApprove ? (<>
                <button onClick={amendment?.approve} style={{
                    height: '32px',
                    border: '0',
                    background: 'oklch(0.52 0.13 150)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}>
                  {'Approve'}
                </button>
                <button onClick={amendment?.reject} style={{
                    height: '32px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: 'oklch(0.5 0.18 25)',
                    whiteSpace: 'nowrap',
                  }}>
                  {'Reject'}
                </button>
              </>) : null}
              {amendment?.canWithdraw ? (<>
                <button onClick={amendment?.withdraw} style={{
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
                  {'Withdraw'}
                </button>
              </>) : null}
            </>) : null}
            {amendment?.hasRule ? (<>
              <button onClick={amendment?.openRule} style={{
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
                {'Open rule'}
              </button>
            </>) : null}
          </div>
          {' '}
        </div>
      </Fragment>))}
      {' '}
      {vm.cx?.noAmds ? (<>
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            padding: '28px',
            textAlign: 'center',
            fontSize: '13.5px',
            color: 'oklch(0.5 0.012 265)',
          }}>
          {show(vm.cx?.noAmdTxt)}
        </div>
      </>) : null}
      {' '}
    </div>
  </>);
}
