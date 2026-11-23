/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function ConstitutionRules({ vm }) {
  return (<>
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px,250px) minmax(0,1fr)',
        gap: '14px',
        alignItems: 'start',
      }}>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'sticky',
          top: '12px',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
        }}>
        {asList(vm.cx?.chNav).map((chapter, index) => (<Fragment key={index}>
          <button onClick={chapter?.go} style={inlineStyle(`width:100%;display:flex;align-items:center;gap:9px;border:0;border-bottom:1px solid oklch(0.96 0.004 85);background:${attr(chapter?.bg)};box-shadow:${attr(chapter?.sh)};padding:9px 14px;text-align:left;cursor:pointer`)}>
            <span style={{
                fontFamily: '\'JetBrains Mono\',monospace',
                fontSize: '11px',
                color: 'oklch(0.55 0.012 265)',
                width: '18px',
              }}>
              {show(chapter?.num)}
            </span>
            <span style={inlineStyle(`flex:1;min-width:0;font-size:13px;font-weight:${attr(chapter?.fw)};line-height:1.3`)}>
              {show(chapter?.name)}
            </span>
            {chapter?.hasPend ? (<>
              <span title="Waiting for approval" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'oklch(0.75 0.15 75)' }} />
            </>) : null}
            <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
              {show(chapter?.n)}
            </span>
          </button>
        </Fragment>))}
      </div>
      {' '}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '0' }}>
        {' '}
        {vm.cx?.hasCh ? (<>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <span style={{
                fontFamily: '\'Instrument Serif\',Georgia,serif',
                fontWeight: '400',
                fontSize: '46px',
                lineHeight: '0.9',
                color: 'var(--acc, oklch(0.5 0.17 265))',
              }}>
              {show(vm.cx?.ch?.num)}
            </span>
            <div>
              <div style={{ fontSize: '19px', fontWeight: '600', letterSpacing: '-0.01em' }}>
                {show(vm.cx?.ch?.name)}
              </div>
              <div style={{ fontSize: '13.5px', color: 'oklch(0.5 0.012 265)', marginTop: '2px' }}>
                {show(vm.cx?.ch?.desc)}
              </div>
            </div>
          </div>
        </>) : null}
        {' '}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={inputValue(vm.cx?.rf?.q)} onChange={vm.cx?.rf?.onQ} placeholder="Search ID, title or text" style={{
              height: '32px',
              padding: '0 10px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              fontSize: '13.5px',
              outline: 'none',
              background: '#fff',
              minWidth: '0',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              flex: '0 1 220px',
            }} />
          <select value={inputValue(vm.cx?.rf?.status?.value)} onChange={vm.cx?.rf?.status?.onChange} style={{
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
            {asList(vm.cx?.rf?.status?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          <select value={inputValue(vm.cx?.rf?.kind?.value)} onChange={vm.cx?.rf?.kind?.onChange} style={{
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
            {asList(vm.cx?.rf?.kind?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          <select value={inputValue(vm.cx?.rf?.level?.value)} onChange={vm.cx?.rf?.level?.onChange} style={{
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
            {asList(vm.cx?.rf?.level?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          <select value={inputValue(vm.cx?.rf?.co?.value)} onChange={vm.cx?.rf?.co?.onChange} style={{
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
            {asList(vm.cx?.rf?.co?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          {vm.cx?.rf?.any ? (<>
            <button onClick={vm.cx?.rf?.clear} style={{
                border: '0',
                background: 'none',
                fontSize: '12.5px',
                fontWeight: '600',
                color: 'var(--acc, oklch(0.5 0.17 265))',
                cursor: 'pointer',
              }}>
              {'Clear'}
            </button>
          </>) : null}
          <span style={{ flex: '1' }} />
          {vm.cx?.canBulk ? (<>
            <button onClick={vm.cx?.bulkApprove} style={{
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
              {'Approve '}{show(vm.cx?.bulkN)}{' as '}{show(vm.cx?.meFirst)}
            </button>
          </>) : null}
          <button onClick={vm.cx?.addRule} style={{
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
            {'+ New rule'}
          </button>
        </div>
        {' '}
        <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
          {show(vm.cx?.shown)}
        </div>
        {' '}
        {asList(vm.cx?.rgroups).map((group, index) => (<Fragment key={index}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {' '}
            {group?.showHead ? (<>
              <button onClick={group?.go} style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                  border: '0',
                  background: 'none',
                  padding: '8px 0 0',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}>
                <span style={{
                    fontFamily: '\'Instrument Serif\',Georgia,serif',
                    fontWeight: '400',
                    fontSize: '24px',
                    color: 'var(--acc, oklch(0.5 0.17 265))',
                  }}>
                  {show(group?.num)}
                </span>
                <span style={{ fontSize: '15px', fontWeight: '600' }}>
                  {show(group?.name)}
                </span>
                <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
                  {show(group?.n)}
                </span>
              </button>
            </>) : null}
            {' '}
            {asList(group?.rules).map((rule, index) => (<Fragment key={index}>
              <button onClick={rule?.open} style={inlineStyle(`background:#fff;border:1px solid oklch(0.915 0.006 85);border-radius:12px;padding:14px 16px;text-align:left;cursor:pointer;display:grid;grid-template-columns:72px minmax(0,1fr) auto;gap:4px 14px;align-items:start;box-shadow:${attr(rule?.sh)}`)} className="scp6">
                {' '}
                <span style={{
                    fontFamily: '\'JetBrains Mono\',monospace',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'oklch(0.42 0.012 265)',
                    paddingTop: '2px',
                  }}>
                  {show(rule?.code)}
                </span>
                {' '}
                <span style={{ minWidth: '0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <span style={{ fontSize: '14.5px', fontWeight: '600', lineHeight: '1.35' }}>
                    {show(rule?.title)}
                  </span>
                  <span style={{
                      fontSize: '13px',
                      lineHeight: '1.5',
                      color: 'oklch(0.4 0.012 265)',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                    {show(rule?.text)}
                  </span>
                  <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginTop: '2px' }}>
                    <span style={inlineStyle(`font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:5px;background:${attr(rule?.kBg)};color:${attr(rule?.kFg)}`)}>
                      {show(rule?.kind)}
                    </span>
                    <span style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        padding: '2px 7px',
                        borderRadius: '5px',
                        background: 'oklch(0.95 0.008 265)',
                        color: 'oklch(0.42 0.04 265)',
                      }}>
                      {show(rule?.lvl)}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
                      {show(rule?.scope)}{' · '}{show(rule?.owner)}
                    </span>
                    {rule?.hasExc ? (<>
                      <span style={{ fontSize: '11.5px', color: 'oklch(0.5 0.13 65)', fontWeight: '600' }}>
                        {'· '}{show(rule?.exc)}
                      </span>
                    </>) : null}
                    {rule?.hasV ? (<>
                      <span style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
                        {'· '}{show(rule?.ver)}
                      </span>
                    </>) : null}
                  </span>
                </span>
                {' '}
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={inlineStyle(`font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;background:${attr(rule?.sBg)};color:${attr(rule?.sFg)};white-space:nowrap`)}>
                    {show(rule?.st)}
                  </span>
                  <span style={{ display: 'flex', gap: '3px' }}>
                    {asList(rule?.signs).map((signature, index) => (<Fragment key={index}>
                      <span title={signature?.tip} style={inlineStyle(`width:22px;height:22px;border-radius:50%;background:${attr(signature?.bg)};color:${attr(signature?.fg)};border:1.5px solid ${attr(signature?.bd)};display:grid;place-items:center;font-size:9px;font-weight:700;box-sizing:border-box`)}>
                        {show(signature?.ini)}
                      </span>
                    </Fragment>))}
                  </span>
                </span>
                {' '}
              </button>
            </Fragment>))}
            {' '}
          </div>
        </Fragment>))}
        {' '}
        {vm.cx?.noRules ? (<>
          <div style={{
              background: '#fff',
              border: '1px solid oklch(0.915 0.006 85)',
              borderRadius: '12px',
              padding: '28px',
              textAlign: 'center',
              fontSize: '13.5px',
              color: 'oklch(0.5 0.012 265)',
            }}>
            {'No rules match these filters.'}
          </div>
        </>) : null}
        {' '}
      </div>
      {' '}
    </div>
  </>);
}
