/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function RulePanel({ vm }) {
  return (<>
    <div onClick={vm.cx?.R?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.3)', zIndex: '45' }} />
    <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        width: 'min(600px,100%)',
        background: '#fff',
        zIndex: '46',
        boxShadow: '-12px 0 40px oklch(0.2 0.02 265 / 0.15)',
        display: 'flex',
        flexDirection: 'column',
      }}>
      {' '}
      <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid oklch(0.94 0.005 85)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
        <span style={{ fontFamily: '\'JetBrains Mono\',monospace', fontSize: '13px', fontWeight: '500' }}>
          {show(vm.cx?.R?.code)}
        </span>
        <span style={inlineStyle(`font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;background:${attr(vm.cx?.R?.sBg)};color:${attr(vm.cx?.R?.sFg)}`)}>
          {show(vm.cx?.R?.st)}
        </span>
        <span style={{
            fontSize: '12px',
            color: 'oklch(0.55 0.012 265)',
            flex: '1',
            minWidth: '0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          {show(vm.cx?.R?.ver)}
        </span>
        <button onClick={vm.cx?.R?.prev} title="Previous rule" style={{
            height: '30px',
            border: '1px solid oklch(0.9 0.006 85)',
            background: '#fff',
            borderRadius: '8px',
            padding: '0',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.35 0.012 265)',
            whiteSpace: 'nowrap',
            width: '30px',
          }}>
          {'↑'}
        </button>
        <button onClick={vm.cx?.R?.next} title="Next rule" style={{
            height: '30px',
            border: '1px solid oklch(0.9 0.006 85)',
            background: '#fff',
            borderRadius: '8px',
            padding: '0',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.35 0.012 265)',
            whiteSpace: 'nowrap',
            width: '30px',
          }}>
          {'↓'}
        </button>
        <button onClick={vm.cx?.R?.close} style={{
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
          flex: '1',
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}>
        {' '}
        <div style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
          {show(vm.cx?.R?.chName)}
        </div>
        {' '}
        {vm.cx?.R?.editable ? (<>
          <input data-rule={vm.cx?.R?.id} value={inputValue(vm.cx?.R?.title)} onChange={vm.cx?.R?.onTitle} placeholder="Rule title" style={{
              height: '42px',
              padding: '0 10px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              fontSize: '18px',
              outline: 'none',
              background: '#fff',
              minWidth: '0',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              fontWeight: '600',
              width: '100%',
            }} />
          <textarea value={inputValue(vm.cx?.R?.text)} onChange={vm.cx?.R?.onText} placeholder="Detailed explanation. What exactly is the rule, and when does it apply?" style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.5',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              fieldSizing: 'content',
              minHeight: '110px',
              boxSizing: 'border-box',
            }} />
          {vm.cx?.R?.isPend ? (<>
            <span style={{ fontSize: '12px', color: 'oklch(0.5 0.12 65)' }}>
              {'Changing the wording clears approvals, so both founders agree to the new text.'}
            </span>
          </>) : null}
        </>) : null}
        {' '}
        {vm.cx?.R?.locked ? (<>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '600', letterSpacing: '-0.01em', lineHeight: '1.3' }}>
              {show(vm.cx?.R?.title)}
            </div>
            <div style={{
                fontSize: '14.5px',
                lineHeight: '1.6',
                color: 'oklch(0.33 0.012 265)',
                marginTop: '8px',
                whiteSpace: 'pre-wrap',
              }}>
              {show(vm.cx?.R?.text)}
            </div>
          </div>
          {vm.cx?.R?.isActive ? (<>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={vm.cx?.R?.propose} style={{
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
                {'Propose a change'}
              </button>
              <button onClick={vm.cx?.R?.reqExc} style={{
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
                {'Request exception'}
              </button>
              <button onClick={vm.cx?.R?.repeal} style={{
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
                {'Propose repeal'}
              </button>
            </div>
          </>) : null}
        </>) : null}
        {' '}
        {vm.cx?.R?.hasPendAmd ? (<>
          <div style={{
              fontSize: '12.5px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'oklch(0.97 0.03 80)',
              color: 'oklch(0.42 0.1 65)',
            }}>
            {show(vm.cx?.R?.pendAmd)}
          </div>
        </>) : null}
        {' '}
        <div style={{
            borderRadius: '10px',
            background: 'oklch(0.975 0.004 85)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              {'Founder approval'}
            </span>
            <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
              {show(vm.cx?.R?.apprTxt)}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {asList(vm.cx?.R?.signs).map((signature, index) => (<Fragment key={index}>
              <button onClick={signature?.go} disabled={signature?.dis} style={inlineStyle(`height:30px;border:1px solid ${attr(signature?.bd)};background:${attr(signature?.bg)};color:${attr(signature?.fg)};border-radius:15px;padding:0 12px;font-size:12.5px;font-weight:600;cursor:${attr(signature?.cur)}`)}>
                {show(signature?.label)}
              </button>
            </Fragment>))}
            <span style={{ flex: '1' }} />
            {vm.cx?.R?.isDraft ? (<>
              <button onClick={vm.cx?.R?.submit} style={{
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
                {'Submit for approval'}
              </button>
            </>) : null}
          </div>
        </div>
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: '130px minmax(0,1fr)',
            gap: '12px 14px',
            alignItems: 'center',
          }}>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Chapter'}
          </span>
          <select value={inputValue(vm.cx?.R?.ch?.value)} onChange={vm.cx?.R?.ch?.onChange} style={{
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
            {asList(vm.cx?.R?.ch?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Classification'}
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
            {asList(vm.cx?.R?.kindSeg).map((option, index) => (<Fragment key={index}>
              <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                {show(option?.label)}
              </button>
            </Fragment>))}
          </div>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Level'}
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
            {asList(vm.cx?.R?.lvlSeg).map((option, index) => (<Fragment key={index}>
              <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                {show(option?.label)}
              </button>
            </Fragment>))}
          </div>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600', alignSelf: 'start', paddingTop: '6px' }}>
            {'Applies to'}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
                display: 'flex',
                gap: '2px',
                padding: '3px',
                background: 'oklch(0.94 0.005 85)',
                borderRadius: '9px',
                width: 'fit-content',
                flexWrap: 'wrap',
              }}>
              {asList(vm.cx?.R?.scopeSeg).map((option, index) => (<Fragment key={index}>
                <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                  {show(option?.label)}
                </button>
              </Fragment>))}
            </div>
            {vm.cx?.R?.isSel ? (<>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {asList(vm.cx?.R?.cos).map((company, index) => (<Fragment key={index}>
                  <button onClick={company?.go} style={inlineStyle(`height:26px;border:1px solid ${attr(company?.bd)};background:${attr(company?.bg)};color:${attr(company?.fg)};border-radius:13px;padding:0 10px;font-size:12px;font-weight:600;cursor:pointer`)}>
                    {show(company?.name)}
                  </button>
                </Fragment>))}
              </div>
            </>) : null}
          </div>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Responsible owner'}
          </span>
          <select value={inputValue(vm.cx?.R?.owner?.value)} onChange={vm.cx?.R?.owner?.onChange} style={{
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
            {asList(vm.cx?.R?.owner?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Effective date'}
          </span>
          <input type="date" value={inputValue(vm.cx?.R?.eff)} onChange={vm.cx?.R?.onEff} style={{
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
              width: 'fit-content',
            }} />
          {' '}
        </div>
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{
              fontSize: '11.5px',
              fontWeight: '700',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'oklch(0.5 0.012 265)',
            }}>
            {'Supporting documents'}
          </span>
          {asList(vm.cx?.R?.docs).map((doc, index) => (<Fragment key={index}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <span style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'oklch(0.95 0.03 255)',
                  color: 'oklch(0.42 0.13 255)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  flexShrink: '0',
                }}>
                {'↗'}
              </span>
              <a href={doc?.url} target="_blank" style={{
                  flex: '1',
                  minWidth: '0',
                  color: 'oklch(0.38 0.12 265)',
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {show(doc?.name)}
              </a>
              <button onClick={doc?.remove} style={{
                  border: '0',
                  background: 'none',
                  color: 'oklch(0.65 0.01 265)',
                  cursor: 'pointer',
                  fontSize: '15px',
                }}>
                {'×'}
              </button>
            </div>
          </Fragment>))}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <input value={inputValue(vm.cx?.R?.docName)} onChange={vm.cx?.R?.onDocName} placeholder="Name, e.g. Shareholders' agreement" style={{
                height: '30px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '12.5px',
                outline: 'none',
                background: '#fff',
                minWidth: '0',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                flex: '1 1 160px',
              }} />
            <input value={inputValue(vm.cx?.R?.docUrl)} onChange={vm.cx?.R?.onDocUrl} placeholder="Link" style={{
                height: '30px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '12.5px',
                outline: 'none',
                background: '#fff',
                minWidth: '0',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                flex: '1 1 120px',
              }} />
            <button onClick={vm.cx?.R?.addDoc} style={{
                height: '30px',
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
              {'Add'}
            </button>
          </div>
        </div>
        {' '}
        {vm.cx?.R?.hasExc ? (<>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{
                fontSize: '11.5px',
                fontWeight: '700',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'oklch(0.5 0.012 265)',
              }}>
              {'Exceptions'}
            </span>
            {asList(vm.cx?.R?.excs).map((exception, index) => (<Fragment key={index}>
              <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  fontSize: '13px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'oklch(0.975 0.012 80)',
                }}>
                <span style={{ fontWeight: '600' }}>
                  {show(exception?.co)}
                </span>
                <span style={{
                    flex: '1',
                    color: 'oklch(0.4 0.012 265)',
                    minWidth: '0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  {show(exception?.reason)}
                </span>
                <span style={inlineStyle(`font-size:11.5px;font-weight:700;color:${attr(exception?.sFg)}`)}>
                  {show(exception?.st)}
                </span>
              </div>
            </Fragment>))}
          </div>
        </>) : null}
        {' '}
        {vm.cx?.R?.hasVer ? (<>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
                fontSize: '11.5px',
                fontWeight: '700',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'oklch(0.5 0.012 265)',
                marginBottom: '10px',
              }}>
              {'Version history'}
            </span>
            {asList(vm.cx?.R?.versions).map((version, index) => (<Fragment key={index}>
              <div style={{ display: 'grid', gridTemplateColumns: '16px minmax(0,1fr)', gap: '10px' }}>
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={inlineStyle(`width:10px;height:10px;border-radius:50%;background:${attr(version?.dot)};margin-top:4px;flex-shrink:0`)} />
                  <span style={{ flex: '1', width: '1.5px', background: 'oklch(0.92 0.005 85)' }} />
                </span>
                <div style={{ paddingBottom: '14px', minWidth: '0' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    {show(version?.head)}{' '}
                    <span style={{ fontWeight: '400', color: 'oklch(0.55 0.012 265)' }}>
                      {'· '}{show(version?.meta)}
                    </span>
                  </div>
                  <div style={{
                      fontSize: '12.5px',
                      fontWeight: '600',
                      marginTop: '3px',
                      color: 'oklch(0.35 0.012 265)',
                    }}>
                    {show(version?.title)}
                  </div>
                  <div style={{ fontSize: '12.5px', lineHeight: '1.5', color: 'oklch(0.42 0.012 265)' }}>
                    {show(version?.text)}
                  </div>
                  {version?.hasReason ? (<>
                    <div style={{ fontSize: '12px', color: 'oklch(0.48 0.1 265)', marginTop: '2px' }}>
                      {'Reason: '}{show(version?.reason)}
                    </div>
                  </>) : null}
                </div>
              </div>
            </Fragment>))}
          </div>
        </>) : null}
        {' '}
        {vm.cx?.R?.canDelete ? (<>
          <button onClick={vm.cx?.R?.remove} style={{
              border: '0',
              background: 'none',
              color: 'oklch(0.5 0.18 25)',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
              alignSelf: 'flex-start',
              padding: '0',
            }}>
            {'Delete draft'}
          </button>
        </>) : null}
        {' '}
      </div>
      {' '}
    </div>
  </>);
}
