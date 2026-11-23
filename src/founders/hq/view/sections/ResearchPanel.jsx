/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function ResearchPanel({ vm }) {
  return (<>
    {' '}
    <div onClick={vm.rs?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.25)', zIndex: '38' }} />
    {' '}
    <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        width: 'min(780px,100%)',
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
            {'Research'}
          </span>
          <span>
            {'/'}
          </span>
          <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(vm.rs?.coTint)};color:${attr(vm.rs?.coInk)}`)}>
            {show(vm.rs?.coName)}
          </span>
        </div>
        {' '}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {' '}
          <div style={{ display: 'flex', gap: '2px', marginRight: '4px' }}>
            <button onClick={vm.rs?.prev} disabled={vm.rs?.noPrev} title="Previous" style={inlineStyle(`width:30px;height:30px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:7px;cursor:pointer;font-size:12px;opacity:${attr(vm.rs?.prevOp)}`)}>
              {'↑'}
            </button>
            <button onClick={vm.rs?.next} disabled={vm.rs?.noNext} title="Next" style={inlineStyle(`width:30px;height:30px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:7px;cursor:pointer;font-size:12px;opacity:${attr(vm.rs?.nextOp)}`)}>
              {'↓'}
            </button>
          </div>
          {' '}
          {vm.rs?.notConc ? (<>
            <button onClick={vm.rs?.conclude} style={{
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
              {'✓ Mark concluded'}
            </button>
          </>) : null}
          {' '}
          {vm.rs?.isConc ? (<>
            <button onClick={vm.rs?.reopen} style={{
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
          <button onClick={vm.rs?.dup} title="Make a copy" style={{
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
            {'Duplicate'}
          </button>
          {' '}
          <button onClick={vm.rs?.copy} title="Copy as text" style={{
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
            {'Copy'}
          </button>
          {' '}
          <button onClick={vm.rs?.remove} title="Delete (you can undo)" style={{
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
          <button onClick={vm.rs?.close} style={{
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
            <span style={inlineStyle(`display:inline-flex;align-self:flex-start;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:3px 9px;border-radius:7px;background:${attr(vm.rs?.stTint)};color:${attr(vm.rs?.stInk)}`)}>
              <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(vm.rs?.stDot)}`)} />
              {show(vm.rs?.stLabel)}
            </span>
            {' '}
            <textarea data-rtitle="1" rows="1" value={inputValue(vm.rs?.cur?.title)} onChange={vm.rs?.onTitle} placeholder="Research title" style={{
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.rs?.stSeg).map((option, index) => (<Fragment key={index}>
                  <button onClick={option?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                    {show(option?.label)}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.rs?.coSeg).map((option, index) => (<Fragment key={index}>
                  <button onClick={option?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                    {show(option?.label)}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.rs?.ownerSeg).map((option, index) => (<Fragment key={index}>
                  <button onClick={option?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                    {show(option?.label)}
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
              {'Priority'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.rs?.priSeg).map((option, index) => (<Fragment key={index}>
                  <button onClick={option?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                    {show(option?.label)}
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
              {'Answer by'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <input type="date" value={inputValue(vm.rs?.cur?.due)} onChange={vm.rs?.onDue} style={inlineStyle(`height:32px;border:1px solid oklch(0.9 0.006 85);border-radius:7px;background:#fff;font-size:13px;padding:0 8px;font-family:inherit;cursor:pointer;color:${attr(vm.rs?.dueColor)}`)} />
              {vm.rs?.hasLate ? (<>
                <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'oklch(0.52 0.19 25)' }}>
                  {show(vm.rs?.lateHint)}
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
              {'Tags'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              {asList(vm.rs?.tags).map((tag, index) => (<Fragment key={index}>
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '26px',
                    padding: '0 4px 0 10px',
                    borderRadius: '13px',
                    background: 'oklch(0.95 0.005 85)',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    color: 'oklch(0.35 0.012 265)',
                  }}>
                  {'#'}{show(tag?.t)}
                  <button onClick={tag?.remove} title="Remove tag" style={{
                      border: '0',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'oklch(0.6 0.01 265)',
                      fontSize: '14px',
                      padding: '0 4px',
                    }}>
                    {'×'}
                  </button>
                </span>
              </Fragment>))}
              <input value={inputValue(vm.rs?.tagDraft)} onChange={vm.rs?.onTag} onKeyDown={vm.rs?.onTagKey} placeholder="Add tag, press Enter" style={{
                  height: '28px',
                  width: '150px',
                  border: '1px dashed oklch(0.85 0.008 85)',
                  borderRadius: '14px',
                  padding: '0 10px',
                  fontSize: '12.5px',
                  outline: 'none',
                }} />
              {asList(vm.rs?.tagSugg).map((suggestion, index) => (<Fragment key={index}>
                <button onClick={suggestion?.go} style={{
                    height: '24px',
                    border: '0',
                    background: 'none',
                    color: 'oklch(0.52 0.012 265)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    padding: '0 4px',
                  }} className="scp27">
                  {'+'}{show(suggestion?.t)}
                </button>
              </Fragment>))}
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
              {'1 · Question'}
            </span>
            <textarea value={inputValue(vm.rs?.cur?.question)} onChange={vm.rs?.onQuestion} placeholder="What exactly do we need to find out?" style={{
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
            <span style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'oklch(0.52 0.012 265)',
              }}>
              {'2 · Our hunch (optional)'}
            </span>
            <textarea value={inputValue(vm.rs?.cur?.hypo)} onChange={vm.rs?.onHypo} placeholder="What do we think the answer is before looking?" style={{
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
                minHeight: '44px',
              }} />
          </div>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {' '}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
              }}>
              <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.52 0.012 265)',
                }}>
                {'3 · Findings'}
              </span>
              {vm.rs?.aiOn ? (<>
                <button onClick={vm.rs?.draft} style={inlineStyle(`height:28px;border:1px solid oklch(0.85 0.05 265);background:color-mix(in oklch, var(--acc) 6%, #fff);color:var(--acc2, oklch(0.42 0.17 265));border-radius:7px;padding:0 12px;font-size:12.5px;font-weight:600;cursor:pointer;opacity:${attr(vm.rs?.draftOp)}`)}>
                  {show(vm.rs?.draftLabel)}
                </button>
              </>) : null}
            </div>
            {' '}
            <textarea value={inputValue(vm.rs?.cur?.findings)} onChange={vm.rs?.onFindings} placeholder="Facts, numbers, options, risks" style={{
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
                minHeight: '140px',
              }} />
            {' '}
            {vm.rs?.aiOn ? (<>
              <span style={inlineStyle(`font-size:12px;color:${attr(vm.rs?.aiColor)}`)}>
                {show(vm.rs?.aiNote)}
              </span>
            </>) : null}
            {' '}
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
                {'4 · Sources '}
                <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)', marginLeft: '4px' }}>
                  {show(vm.rs?.srcInfo)}
                </span>
              </span>
              <button onClick={vm.rs?.addSrc} style={{
                  height: '28px',
                  border: '1px solid oklch(0.88 0.008 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 12px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'+ Add source'}
              </button>
            </div>
            {' '}
            {asList(vm.rs?.srcs).map((source, index) => (<Fragment key={index}>
              <div style={{
                  display: 'grid',
                  gridTemplateColumns: '22px minmax(0,1fr) minmax(0,0.8fr) auto 24px',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px',
                  borderBottom: '1px solid oklch(0.96 0.004 85)',
                }}>
                <span style={{ fontSize: '12px', color: 'oklch(0.6 0.01 265)', textAlign: 'center' }}>
                  {show(source?.num)}
                </span>
                <input data-srci={source?.num} value={inputValue(source?.text)} onChange={source?.onText} placeholder="Link or reference" style={{
                    minWidth: '0',
                    height: '32px',
                    border: '0',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '13px',
                    fontFamily: '\'JetBrains Mono\',monospace',
                  }} />
                <input value={inputValue(source?.note)} onChange={source?.onNote} placeholder="What it says" style={{
                    minWidth: '0',
                    height: '32px',
                    border: '0',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '13px',
                    color: 'oklch(0.45 0.012 265)',
                  }} />
                {source?.isUrl ? (<>
                  <a href={source?.href} target="_blank" rel="noopener" style={{ fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    {'Open ↗'}
                  </a>
                </>) : null}
                <button onClick={source?.remove} title="Remove" style={{
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
            {vm.rs?.noSrcs ? (<>
              <button onClick={vm.rs?.addSrc} style={{
                  width: '100%',
                  border: '0',
                  background: 'none',
                  padding: '14px 12px',
                  fontSize: '13px',
                  color: 'oklch(0.52 0.012 265)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}>
                {'Add links, reports or people you spoke to, so others can check the facts.'}
              </button>
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
              {'5 · Answer / conclusion'}
            </span>
            <textarea data-rconc="1" value={inputValue(vm.rs?.cur?.decision)} onChange={vm.rs?.onDecision} placeholder="What's the answer, and what should we do?" style={{
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
            {' '}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
                {'How sure are we?'}
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
                {asList(vm.rs?.confSeg).map((option, index) => (<Fragment key={index}>
                  <button onClick={option?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                    {show(option?.label)}
                  </button>
                </Fragment>))}
              </div>
              <div style={{ flex: '1' }} />
              {vm.rs?.noDec ? (<>
                <button onClick={vm.rs?.logDec} title="Create a decision from this research" style={{
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
                  {'→ Log as decision'}
                </button>
              </>) : null}
              {vm.rs?.hasDec ? (<>
                <button onClick={vm.rs?.openDec} style={{
                    height: '30px',
                    border: '1px solid oklch(0.85 0.06 150)',
                    background: 'oklch(0.97 0.02 150)',
                    color: 'oklch(0.38 0.1 150)',
                    borderRadius: '7px',
                    padding: '0 11px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}>
                  {show(vm.rs?.decLabel)}{' ↗'}
                </button>
              </>) : null}
            </div>
            {' '}
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
                {'Tasks '}
                <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)', marginLeft: '4px' }}>
                  {show(vm.rs?.folInfo)}
                </span>
              </span>
              <button onClick={vm.rs?.addFol} style={{
                  height: '28px',
                  border: '1px solid oklch(0.88 0.008 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 12px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'+ Add task'}
              </button>
            </div>
            {' '}
            {asList(vm.rs?.fols).map((followUp, index) => (<Fragment key={index}>
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
                <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', whiteSpace: 'nowrap' }}>
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
            {vm.rs?.noFols ? (<>
              <div style={{ padding: '14px 12px', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
                {'Split the research into tasks, like "Call 3 agencies". They show in Tasks too.'}
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
            {asList(vm.rs?.comments).map((comment, index) => (<Fragment key={index}>
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
              <textarea rows="1" value={inputValue(vm.rs?.cdraft)} onChange={vm.rs?.onC} onKeyDown={vm.rs?.onCKey} placeholder="Add a note or question… (Enter to post)" style={{
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
              <button onClick={vm.rs?.postC} style={{
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
          {vm.rs?.hasLog ? (<>
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
              {asList(vm.rs?.log).map((entry, index) => (<Fragment key={index}>
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
                      {show(entry?.who)}
                    </span>
                    {' · '}{show(entry?.text)}
                  </span>
                  <span style={{ color: 'oklch(0.6 0.01 265)', whiteSpace: 'nowrap' }}>
                    {show(entry?.when)}
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
              {show(vm.rs?.updated)}
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
