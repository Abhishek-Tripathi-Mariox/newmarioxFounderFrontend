/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function DecisionPanel({ vm }) {
  return (<>
    {' '}
    <div onClick={vm.dl?.dp?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.25)', zIndex: '38' }} />
    {' '}
    <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        width: 'min(760px,100%)',
        background: '#fff',
        zIndex: '39',
        boxShadow: '-16px 0 48px oklch(0.2 0.02 265 / 0.2)',
        display: 'flex',
        flexDirection: 'column',
      }}>
      {' '}
      <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          borderBottom: '1px solid oklch(0.94 0.005 85)',
          flexShrink: '0',
          flexWrap: 'wrap',
        }}>
        {' '}
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'oklch(0.52 0.012 265)',
          }}>
          <span>
            {'Decisions'}
          </span>
          <span>
            {'/'}
          </span>
          <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(vm.dl?.dp?.coTint)};color:${attr(vm.dl?.dp?.coInk)}`)}>
            {show(vm.dl?.dp?.coName)}
          </span>
        </div>
        {' '}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {' '}
          <div style={{ display: 'flex', gap: '2px', marginRight: '4px' }}>
            <button onClick={vm.dl?.dp?.prev} disabled={vm.dl?.dp?.noPrev} title="Previous decision" style={inlineStyle(`width:30px;height:30px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:7px;cursor:pointer;font-size:12px;opacity:${attr(vm.dl?.dp?.prevOp)}`)}>
              {'↑'}
            </button>
            <button onClick={vm.dl?.dp?.next} disabled={vm.dl?.dp?.noNext} title="Next decision" style={inlineStyle(`width:30px;height:30px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:7px;cursor:pointer;font-size:12px;opacity:${attr(vm.dl?.dp?.nextOp)}`)}>
              {'↓'}
            </button>
          </div>
          {' '}
          {vm.dl?.dp?.notDecided ? (<>
            <button onClick={vm.dl?.dp?.markDecided} style={{
                height: '30px',
                border: '0',
                background: 'oklch(0.55 0.14 150)',
                color: '#fff',
                borderRadius: '7px',
                padding: '0 12px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'✓ Mark decided'}
            </button>
          </>) : null}
          {' '}
          {vm.dl?.dp?.isDecided ? (<>
            <button onClick={vm.dl?.dp?.reopen} title="Move back to Needs decision" style={{
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
              {'↺ Reopen'}
            </button>
          </>) : null}
          {' '}
          <button onClick={vm.dl?.dp?.dup} title="Make a copy" style={{
              height: '30px',
              border: '1px solid oklch(0.9 0.006 85)',
              background: '#fff',
              borderRadius: '7px',
              padding: '0 11px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.35 0.012 265)',
            }} className="scp10">
            {'Duplicate'}
          </button>
          {' '}
          <button onClick={vm.dl?.dp?.copy} title="Copy as text for WhatsApp, email or Slack" style={{
              height: '30px',
              border: '1px solid oklch(0.9 0.006 85)',
              background: '#fff',
              borderRadius: '7px',
              padding: '0 11px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.35 0.012 265)',
            }} className="scp10">
            {'Copy'}
          </button>
          {' '}
          <button onClick={vm.dl?.dp?.remove} title="Delete (you can undo)" style={{
              height: '30px',
              border: '1px solid oklch(0.88 0.05 25)',
              background: 'oklch(0.98 0.012 25)',
              color: 'oklch(0.5 0.18 25)',
              borderRadius: '7px',
              padding: '0 11px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            {'Delete'}
          </button>
          {' '}
          <div style={{ width: '1px', height: '20px', background: 'oklch(0.9 0.006 85)', margin: '0 2px' }} />
          {' '}
          <button onClick={vm.dl?.dp?.close} style={{
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
            {'Close'}
          </button>
          {' '}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{ flex: '1', overflowY: 'auto' }}>
        {' '}
        <div style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: '30px 32px 80px',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
          }}>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {' '}
            <span style={inlineStyle(`display:inline-flex;align-self:flex-start;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:3px 9px;border-radius:7px;background:${attr(vm.dl?.dp?.stTint)};color:${attr(vm.dl?.dp?.stInk)}`)}>
              <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(vm.dl?.dp?.stDot)}`)} />
              {show(vm.dl?.dp?.stLabel)}
            </span>
            {' '}
            <textarea data-did={vm.dl?.dp?.id} rows="1" value={inputValue(vm.dl?.dp?.title)} onChange={vm.dl?.dp?.onTitle} placeholder="What do we need to decide?" style={{
                border: '0',
                outline: 'none',
                resize: 'none',
                overflow: 'hidden',
                fieldSizing: 'content',
                fontSize: '28px',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                lineHeight: '1.25',
                padding: '0',
                width: '100%',
                background: 'transparent',
                fontFamily: 'inherit',
              }} />
            {' '}
          </div>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: '120px minmax(0,1fr)', gap: '4px 10px' }}>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Status'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.dl?.dp?.statusSeg).map((statusOption, index) => (<Fragment key={index}>
                  <button onClick={statusOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(statusOption?.bg)};color:${attr(statusOption?.fg)};box-shadow:${attr(statusOption?.sh)}`)}>
                    {show(statusOption?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Company'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.dl?.dp?.coSeg).map((companyOption, index) => (<Fragment key={index}>
                  <button onClick={companyOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(companyOption?.bg)};color:${attr(companyOption?.fg)};box-shadow:${attr(companyOption?.sh)}`)}>
                    {show(companyOption?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Owner'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.dl?.dp?.bySeg).map((ownerOption, index) => (<Fragment key={index}>
                  <button onClick={ownerOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(ownerOption?.bg)};color:${attr(ownerOption?.fg)};box-shadow:${attr(ownerOption?.sh)}`)}>
                    {show(ownerOption?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Impact'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.dl?.dp?.impSeg).map((impactOption, index) => (<Fragment key={index}>
                  <button onClick={impactOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(impactOption?.bg)};color:${attr(impactOption?.fg)};box-shadow:${attr(impactOption?.sh)}`)}>
                    {show(impactOption?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Decide by'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', minHeight: '36px' }}>
              <input type="date" value={inputValue(vm.dl?.dp?.due)} onChange={vm.dl?.dp?.onDue} style={inlineStyle(`height:32px;border:1px solid oklch(0.9 0.006 85);border-radius:7px;background:#fff;font-size:13px;padding:0 8px;font-family:inherit;cursor:pointer;color:${attr(vm.dl?.dp?.dueColor)}`)} />
              {vm.dl?.dp?.hasDueHint ? (<>
                <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'oklch(0.52 0.19 25)' }}>
                  {show(vm.dl?.dp?.dueHint)}
                </span>
              </>) : null}
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Revisit on'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', minHeight: '36px' }}>
              <input type="date" value={inputValue(vm.dl?.dp?.revisit)} onChange={vm.dl?.dp?.onRevisit} style={{
                  height: '32px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '7px',
                  background: '#fff',
                  fontSize: '13px',
                  padding: '0 8px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  color: 'oklch(0.23 0.015 265)',
                }} />
              <span style={{ fontSize: '12px', color: 'oklch(0.6 0.01 265)' }}>
                {'Shows in "Due for revisit" a week before'}
              </span>
            </div>
            {' '}
          </div>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'oklch(0.52 0.012 265)',
              }}>
              {'1 · Context'}
            </span>
            <textarea value={inputValue(vm.dl?.dp?.context)} onChange={vm.dl?.dp?.onContext} placeholder="What's the situation? What triggered this? What happens if we do nothing?" style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '1.55',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                color: 'oklch(0.23 0.015 265)',
                fieldSizing: 'content',
                minHeight: '64px',
              }} />
          </div>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {' '}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.52 0.012 265)',
                }}>
                {'2 · Options'}
              </span>
              <button onClick={vm.dl?.dp?.addOpt} style={{
                  height: '28px',
                  border: '0',
                  background: 'var(--acc, oklch(0.5 0.17 265))',
                  color: '#fff',
                  borderRadius: '7px',
                  padding: '0 12px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'+ Add option'}
              </button>
            </div>
            {' '}
            {asList(vm.dl?.dp?.opts).map((option, index) => (<Fragment key={index}>
              {' '}
              <div style={inlineStyle(`border:1.5px solid ${attr(option?.bd)};background:${attr(option?.bg)};border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:8px`)}>
                {' '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={inlineStyle(`width:24px;height:24px;border-radius:6px;background:${attr(option?.badgeBg)};color:${attr(option?.badgeFg)};font-size:12px;font-weight:700;display:grid;place-items:center;flex-shrink:0`)}>
                    {show(option?.letter)}
                  </span>
                  <input data-oid={option?.id} value={inputValue(option?.text)} onChange={option?.onText} onKeyDown={option?.onKey} placeholder="Describe this option" style={{
                      flex: '1',
                      minWidth: '0',
                      border: '0',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '14.5px',
                      fontWeight: '600',
                      padding: '4px 2px',
                    }} />
                  <button onClick={option?.remove} title="Remove option" style={{
                      border: '0',
                      background: 'none',
                      color: 'oklch(0.72 0.01 265)',
                      fontSize: '16px',
                      cursor: 'pointer',
                      padding: '0 4px',
                    }} className="scp1c">
                    {'×'}
                  </button>
                </div>
                {' '}
                <textarea value={inputValue(option?.notes)} onChange={option?.onNotes} rows="1" placeholder="Pros, cons, cost, risk" style={{
                    width: '100%',
                    border: '0',
                    outline: 'none',
                    resize: 'none',
                    fieldSizing: 'content',
                    background: 'transparent',
                    fontSize: '13.5px',
                    lineHeight: '1.5',
                    color: 'oklch(0.38 0.012 265)',
                    padding: '0 2px 0 34px',
                    fontFamily: 'inherit',
                  }} />
                {' '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingLeft: '34px' }}>
                  <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)', marginRight: '2px' }}>
                    {'Prefers this:'}
                  </span>
                  {asList(option?.votes).map((vote, index) => (<Fragment key={index}>
                    <button onClick={vote?.toggle} title={vote?.tip} style={inlineStyle(`height:26px;border:1px solid ${attr(vote?.bd)};background:${attr(vote?.bg)};color:${attr(vote?.fg)};border-radius:13px;padding:0 10px;font-size:12px;font-weight:600;cursor:pointer`)}>
                      {show(vote?.mark)}{show(vote?.label)}
                    </button>
                  </Fragment>))}
                  <div style={{ flex: '1' }} />
                  <button onClick={option?.choose} style={inlineStyle(`height:28px;border:1px solid oklch(0.58 0.14 150);background:${attr(option?.badgeBg)};color:${attr(option?.badgeFg)};border-radius:7px;padding:0 12px;font-size:12.5px;font-weight:600;cursor:pointer`)}>
                    {show(option?.chooseLabel)}
                  </button>
                </div>
                {' '}
              </div>
              {' '}
            </Fragment>))}
            {' '}
            {vm.dl?.dp?.noOpts ? (<>
              <button onClick={vm.dl?.dp?.addOpt} style={{
                  border: '1px dashed oklch(0.85 0.008 85)',
                  background: 'none',
                  borderRadius: '10px',
                  padding: '16px',
                  fontSize: '13px',
                  color: 'oklch(0.52 0.012 265)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }} className="scp13">
                {'List the options you\'re weighing. Each of you can mark the one you prefer, then click "Choose this".'}
              </button>
            </>) : null}
            {' '}
            {vm.dl?.dp?.hasLegacy ? (<>
              <textarea value={inputValue(vm.dl?.dp?.options)} onChange={vm.dl?.dp?.onOptions} placeholder="Other notes on options" style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  lineHeight: '1.55',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  color: 'oklch(0.23 0.015 265)',
                  fieldSizing: 'content',
                  minHeight: '64px',
                }} />
            </>) : null}
            {' '}
          </div>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'oklch(0.52 0.012 265)',
              }}>
              {'3 · What we decided and why'}
            </span>
            <textarea data-dout="1" value={inputValue(vm.dl?.dp?.outcome)} onChange={vm.dl?.dp?.onOutcome} placeholder="The decision, the reason, and what happens next" style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '1.55',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                color: 'oklch(0.23 0.015 265)',
                fieldSizing: 'content',
                minHeight: '64px',
                borderColor: 'oklch(0.85 0.04 150)',
              }} />
            {vm.dl?.dp?.hasOutcomeHint ? (<>
              <span style={{ fontSize: '12.5px', color: 'oklch(0.5 0.12 65)' }}>
                {show(vm.dl?.dp?.outcomeHint)}
              </span>
            </>) : null}
          </div>
          {' '}
          <div style={{ border: '1px solid oklch(0.92 0.005 85)', borderRadius: '10px' }}>
            {' '}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '8px 12px',
                borderBottom: '1px solid oklch(0.94 0.005 85)',
              }}>
              <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                {'4 · Follow-up tasks '}
                <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)', marginLeft: '4px' }}>
                  {show(vm.dl?.dp?.folInfo)}
                </span>
              </span>
              <button onClick={vm.dl?.dp?.addFol} style={{
                  height: '28px',
                  border: '1px solid oklch(0.88 0.008 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 12px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'+ Add follow-up task'}
              </button>
            </div>
            {' '}
            {asList(vm.dl?.dp?.fols).map((followUp, index) => (<Fragment key={index}>
              <div style={{
                  display: 'grid',
                  gridTemplateColumns: '26px minmax(0,1fr) auto 24px auto',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 12px',
                  borderBottom: '1px solid oklch(0.96 0.004 85)',
                }}>
                <button onClick={followUp?.toggle} style={inlineStyle(`width:17px;height:17px;border-radius:5px;border:1.5px solid ${attr(followUp?.checkBorder)};background:${attr(followUp?.checkBg)};color:#fff;font-size:10px;line-height:1;cursor:pointer;padding:0`)}>
                  {show(followUp?.mark)}
                </button>
                <span style={inlineStyle(`font-size:14px;text-decoration:${attr(followUp?.deco)};color:${attr(followUp?.color)};min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`)}>
                  {show(followUp?.title)}
                </span>
                <span style={inlineStyle(`font-size:12.5px;color:${attr(followUp?.dueColor)};white-space:nowrap`)}>
                  {show(followUp?.due)}
                </span>
                <span style={inlineStyle(`width:22px;height:22px;border-radius:50%;background:${attr(followUp?.bg)};color:#fff;font-size:8.5px;font-weight:600;display:grid;place-items:center`)}>
                  {show(followUp?.ini)}
                </span>
                <button onClick={followUp?.open} style={{
                    height: '24px',
                    border: '1px solid oklch(0.88 0.008 85)',
                    background: '#fff',
                    borderRadius: '6px',
                    padding: '0 8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    color: 'oklch(0.4 0.012 265)',
                  }}>
                  {'OPEN'}
                </button>
              </div>
            </Fragment>))}
            {' '}
            {vm.dl?.dp?.noFols ? (<>
              <div style={{ padding: '14px 12px', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
                {'Turn the decision into action. Follow-up tasks show up in Tasks and are linked back here.'}
              </div>
            </>) : null}
            {' '}
          </div>
          {' '}
          <div style={{
              borderTop: '1px solid oklch(0.93 0.005 85)',
              paddingTop: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
            {' '}
            <div style={{ fontSize: '13.5px', fontWeight: '600' }}>
              {'Discussion'}
            </div>
            {' '}
            {asList(vm.dl?.dp?.comments).map((comment, index) => (<Fragment key={index}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={inlineStyle(`width:26px;height:26px;border-radius:50%;background:${attr(comment?.bg)};color:#fff;font-size:9.5px;font-weight:600;display:grid;place-items:center;flex-shrink:0`)}>
                  {show(comment?.ini)}
                </span>
                <div style={{ minWidth: '0', flex: '1' }}>
                  <div style={{ fontSize: '12.5px' }}>
                    <span style={{ fontWeight: '600' }}>
                      {show(comment?.name)}
                    </span>
                    <span style={{ color: 'oklch(0.52 0.012 265)', marginLeft: '6px' }}>
                      {show(comment?.when)}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap', marginTop: '2px' }}>
                    {show(comment?.text)}
                  </div>
                </div>
                <button onClick={comment?.remove} title="Delete comment" style={{
                    border: '0',
                    background: 'none',
                    color: 'oklch(0.75 0.01 265)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}>
                  {'×'}
                </button>
              </div>
            </Fragment>))}
            {' '}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={inlineStyle(`width:26px;height:26px;border-radius:50%;background:${attr(vm.me?.bg)};color:#fff;font-size:9.5px;font-weight:600;display:grid;place-items:center;flex-shrink:0`)}>
                {show(vm.me?.ini)}
              </span>
              <textarea rows="1" value={inputValue(vm.dl?.dp?.cdraft)} onChange={vm.dl?.dp?.onC} onKeyDown={vm.dl?.dp?.onCKey} placeholder="Share your view… (Enter to post)" style={{
                  flex: '1',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '13.5px',
                  resize: 'none',
                  fieldSizing: 'content',
                  minHeight: '36px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }} />
              <button onClick={vm.dl?.dp?.postC} style={{
                  height: '36px',
                  border: '1px solid oklch(0.88 0.008 85)',
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'Post'}
              </button>
            </div>
            {' '}
          </div>
          {' '}
          {vm.dl?.dp?.hasLog ? (<>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.52 0.012 265)',
                }}>
                {'History'}
              </span>
              {asList(vm.dl?.dp?.log).map((logEntry, index) => (<Fragment key={index}>
                <div style={{ display: 'flex', gap: '8px', fontSize: '12.5px', color: 'oklch(0.45 0.012 265)' }}>
                  <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'oklch(0.78 0.01 265)',
                      marginTop: '6px',
                      flexShrink: '0',
                    }} />
                  <span style={{ flex: '1' }}>
                    <span style={{ fontWeight: '600' }}>
                      {show(logEntry?.who)}
                    </span>
                    {' · '}{show(logEntry?.text)}
                  </span>
                  <span style={{ color: 'oklch(0.6 0.01 265)', whiteSpace: 'nowrap' }}>
                    {show(logEntry?.when)}
                  </span>
                </div>
              </Fragment>))}
            </div>
          </>) : null}
          {' '}
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              flexWrap: 'wrap',
              paddingTop: '14px',
              borderTop: '1px solid oklch(0.94 0.005 85)',
            }}>
            <span style={{ fontSize: '12px', color: 'oklch(0.6 0.01 265)' }}>
              {show(vm.dl?.dp?.created)}
            </span>
            <span style={{ fontSize: '12px', color: 'oklch(0.62 0.01 265)' }}>
              {'Esc to close'}
            </span>
          </div>
          {' '}
        </div>
        {' '}
      </div>
      {' '}
    </div>
    {' '}
  </>);
}
