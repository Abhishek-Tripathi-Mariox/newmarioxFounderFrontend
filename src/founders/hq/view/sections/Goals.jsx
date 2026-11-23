/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function Goals({ vm }) {
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
          {'Goals'}
        </h1>
        <div style={{
            fontSize: '13.5px',
            color: 'oklch(0.52 0.012 265)',
            marginTop: '4px',
            maxWidth: '620px',
            lineHeight: '1.5',
          }}>
          {'What each company is aiming for, and whether you\'re on pace. The black line on each bar shows where you should be today.'}
        </div>
      </div>
      {' '}
      <button onClick={vm.gl?.newMenu} style={{
          height: '38px',
          border: '0',
          background: 'var(--acc, oklch(0.5 0.17 265))',
          color: '#fff',
          borderRadius: '9px',
          padding: '0 18px',
          fontSize: '13.5px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }} className="scp15">
        <span>
          {'+ New goal'}
        </span>
        <span style={{ fontSize: '9px', opacity: '0.8' }}>
          {'▼'}
        </span>
      </button>
      {' '}
    </div>
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(118px,1fr))', gap: '10px' }}>
      {' '}
      {asList(vm.gl?.tiles).map((tile, index) => (<Fragment key={index}>
        {' '}
        <button onClick={tile?.go} title={tile?.tip} style={inlineStyle(`text-align:left;background:${attr(tile?.bg)};border:1.5px solid ${attr(tile?.bd)};border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;cursor:pointer;font-family:inherit;color:inherit`)} className="scp16">
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
          <span style={inlineStyle(`font-size:24px;font-weight:600;letter-spacing:-0.01em;color:${attr(tile?.color)}`)}>
            {show(tile?.n)}
          </span>
          {' '}
        </button>
        {' '}
      </Fragment>))}
      {' '}
    </div>
    {' '}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {' '}
      <input value={inputValue(vm.gl?.q)} onChange={vm.gl?.onQ} placeholder="Search goals" style={{
          height: '32px',
          padding: '0 10px',
          border: '1px solid oklch(0.9 0.006 85)',
          borderRadius: '8px',
          fontSize: '13.5px',
          outline: 'none',
          background: '#fff',
          minWidth: '0',
          fontFamily: 'inherit',
          flex: '0 1 220px',
        }} />
      {' '}
      {asList(vm.gl?.filters).map((filter, index) => (<Fragment key={index}>
        <button onClick={filter?.go} style={inlineStyle(`height:32px;border:1px solid ${attr(filter?.bd)};background:${attr(filter?.bg)};color:${attr(filter?.fg)};border-radius:8px;padding:0 10px;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap`)} className="scp17">
          <span>
            {show(filter?.label)}
          </span>
          <span style={{ fontSize: '9px', opacity: '0.6' }}>
            {'▼'}
          </span>
        </button>
      </Fragment>))}
      {' '}
      {vm.gl?.anyFilter ? (<>
        <button onClick={vm.gl?.clear} style={{
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
      {asList(vm.gl?.viewOpts).map((viewOption, index) => (<Fragment key={index}>
        <button onClick={viewOption?.go} style={inlineStyle(`height:32px;border:1px solid ${attr(viewOption?.bd)};background:${attr(viewOption?.bg)};color:${attr(viewOption?.fg)};border-radius:8px;padding:0 10px;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap`)} className="scp17">
          <span>
            {show(viewOption?.label)}
          </span>
          <span style={{ fontSize: '9px', opacity: '0.6' }}>
            {'▼'}
          </span>
        </button>
      </Fragment>))}
      {' '}
      <div style={{
          display: 'flex',
          gap: '2px',
          padding: '3px',
          background: 'oklch(0.94 0.005 85)',
          borderRadius: '9px',
          flexWrap: 'wrap',
          alignSelf: 'flex-start',
          justifySelf: 'start',
        }}>
        {asList(vm.gl?.viewSeg).map((layoutOption, index) => (<Fragment key={index}>
          <button onClick={layoutOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(layoutOption?.bg)};color:${attr(layoutOption?.fg)};box-shadow:${attr(layoutOption?.sh)}`)}>
            {show(layoutOption?.label)}
          </button>
        </Fragment>))}
      </div>
      {' '}
    </div>
    {' '}
    {asList(vm.gl?.groups).map((group, index) => (<Fragment key={index}>
      {' '}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {' '}
        {group?.showHead ? (<>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
            {' '}
            {group?.hasTile ? (<>
              <span style={inlineStyle(`width:24px;height:24px;border-radius:7px;background:${attr(group?.tile)};color:#fff;font-size:12px;font-weight:700;display:grid;place-items:center`)}>
                {show(group?.ini)}
              </span>
            </>) : null}
            {' '}
            {group?.hasDot ? (<>
              <span style={inlineStyle(`width:10px;height:10px;border-radius:50%;background:${attr(group?.dot)}`)} />
            </>) : null}
            {' '}
            <span style={{ fontSize: '16px', fontWeight: '600' }}>
              {show(group?.label)}
            </span>
            {' '}
            <span style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
              {show(group?.meta)}
            </span>
            {' '}
            <button onClick={group?.add} style={{
                marginLeft: 'auto',
                border: '0',
                background: 'none',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: '600',
                color: 'oklch(0.52 0.012 265)',
                cursor: 'pointer',
              }} className="scp18">
              {'+ Add goal'}
            </button>
            {' '}
          </div>
        </>) : null}
        {' '}
        {vm.gl?.isCards ? (<>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '12px' }}>
            {' '}
            {asList(group?.items).map((goal, index) => (<Fragment key={index}>
              <button onClick={goal?.open} style={{
                  textAlign: 'left',
                  background: '#fff',
                  border: '1px solid oklch(0.915 0.006 85)',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  cursor: 'pointer',
                  minWidth: '0',
                  fontFamily: 'inherit',
                  color: 'inherit',
                }} className="scp19">
                {' '}
                <span style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', width: '100%' }}>
                  {' '}
                  <span style={inlineStyle(`width:62px;height:62px;border-radius:50%;background:conic-gradient(${attr(goal?.stDot)} ${attr(goal?.pct)}, oklch(0.93 0.005 85) 0);display:grid;place-items:center;flex-shrink:0`)}>
                    <span style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '15px',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                      }}>
                      {show(goal?.pct)}
                    </span>
                  </span>
                  {' '}
                  <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {' '}
                    <span style={inlineStyle(`font-size:15.5px;font-weight:600;line-height:1.3;color:${attr(goal?.titleColor)}`)}>
                      {show(goal?.titleOr)}
                    </span>
                    {' '}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(goal?.coTint)};color:${attr(goal?.coInk)}`)}>
                        {show(goal?.coName)}
                      </span>
                      <span style={inlineStyle(`display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:3px 9px;border-radius:7px;white-space:nowrap;background:${attr(goal?.stTint)};color:${attr(goal?.stInk)}`)}>
                        <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(goal?.stDot)}`)} />
                        {show(goal?.stLabel)}
                      </span>
                    </span>
                    {' '}
                  </span>
                  {' '}
                  <span style={inlineStyle(`width:24px;height:24px;border-radius:50%;background:${attr(goal?.ownerBg)};color:#fff;font-size:9.5px;font-weight:600;display:grid;place-items:center;flex-shrink:0`)}>
                    {show(goal?.ownerIni)}
                  </span>
                  {' '}
                </span>
                {' '}
                <span style={{ display: 'flex', flexDirection: 'column', gap: '7px', width: '100%' }}>
                  {' '}
                  <span style={{
                      position: 'relative',
                      display: 'block',
                      width: '100%',
                      height: '7px',
                      background: 'oklch(0.94 0.005 85)',
                      borderRadius: '7px',
                    }}>
                    <span style={inlineStyle(`display:block;height:100%;width:${attr(goal?.pct)};background:${attr(goal?.stDot)};border-radius:7px`)} />
                    {goal?.hasExp ? (<>
                      <span title="Where you should be today" style={inlineStyle(`position:absolute;top:-4px;bottom:-4px;left:${attr(goal?.expPos)};width:2px;background:oklch(0.3 0.015 265);border-radius:1px`)} />
                    </>) : null}
                  </span>
                  {' '}
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12.5px' }}>
                    <span style={{ color: 'oklch(0.4 0.012 265)' }}>
                      {show(goal?.basis)}
                    </span>
                    <span style={inlineStyle(`color:${attr(goal?.dueColor)};font-weight:500;white-space:nowrap`)}>
                      {show(goal?.dueText)}
                    </span>
                  </span>
                  {' '}
                </span>
                {' '}
                <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', lineHeight: '1.45' }}>
                  {show(goal?.explain)}
                </span>
                {' '}
                {goal?.hasNext ? (<>
                  <span style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      paddingTop: '10px',
                      borderTop: '1px solid oklch(0.95 0.004 85)',
                      width: '100%',
                    }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: 'oklch(0.52 0.012 265)',
                      }}>
                      {'Next up'}
                    </span>
                    {asList(goal?.next).map((nextTask, index) => (<Fragment key={index}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '13px' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {'○ '}{show(nextTask?.title)}
                        </span>
                        <span style={inlineStyle(`color:${attr(nextTask?.dueColor)};white-space:nowrap;font-size:12px`)}>
                          {show(nextTask?.due)}
                        </span>
                      </span>
                    </Fragment>))}
                  </span>
                </>) : null}
                {' '}
              </button>
            </Fragment>))}
            {' '}
            {group?.empty ? (<>
              <button onClick={group?.add} style={{
                  border: '1.5px dashed oklch(0.86 0.008 85)',
                  background: 'transparent',
                  borderRadius: '14px',
                  padding: '26px',
                  fontSize: '13.5px',
                  color: 'oklch(0.52 0.012 265)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }} className="scp1a">
                {show(group?.emptyText)}
              </button>
            </>) : null}
            {' '}
          </div>
          {' '}
        </>) : null}
        {' '}
        {vm.gl?.isList ? (<>
          {' '}
          <div style={{
              background: '#fff',
              border: '1px solid oklch(0.915 0.006 85)',
              borderRadius: '14px',
              overflowX: 'auto',
            }}>
            <div style={{ minWidth: '860px' }}>
              {' '}
              {asList(group?.items).map((goal, index) => (<Fragment key={index}>
                <button onClick={goal?.open} style={{
                    display: 'grid',
                    gridTemplateColumns: '44px minmax(220px,1fr) 100px 120px minmax(160px,220px) 130px',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '10px 16px',
                    border: '0',
                    borderBottom: '1px solid oklch(0.95 0.004 85)',
                    background: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    fontFamily: 'inherit',
                    color: 'inherit',
                  }} className="scp4">
                  {' '}
                  <span style={inlineStyle(`width:38px;height:38px;border-radius:50%;background:conic-gradient(${attr(goal?.stDot)} ${attr(goal?.pct)}, oklch(0.93 0.005 85) 0);display:grid;place-items:center;flex-shrink:0`)}>
                    <span style={{
                        width: '31px',
                        height: '31px',
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                      }}>
                      {show(goal?.pct)}
                    </span>
                  </span>
                  {' '}
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '0' }}>
                    <span style={inlineStyle(`font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:${attr(goal?.titleColor)}`)}>
                      {show(goal?.titleOr)}
                    </span>
                    <span style={{
                        fontSize: '12px',
                        color: 'oklch(0.52 0.012 265)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                      {show(goal?.basis)}
                    </span>
                  </span>
                  {' '}
                  <span>
                    <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(goal?.coTint)};color:${attr(goal?.coInk)}`)}>
                      {show(goal?.coName)}
                    </span>
                  </span>
                  {' '}
                  <span>
                    <span style={inlineStyle(`display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:3px 9px;border-radius:7px;white-space:nowrap;background:${attr(goal?.stTint)};color:${attr(goal?.stInk)}`)}>
                      <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(goal?.stDot)}`)} />
                      {show(goal?.stLabel)}
                    </span>
                  </span>
                  {' '}
                  <span style={{
                      position: 'relative',
                      display: 'block',
                      width: '100%',
                      height: '6px',
                      background: 'oklch(0.94 0.005 85)',
                      borderRadius: '6px',
                    }}>
                    <span style={inlineStyle(`display:block;height:100%;width:${attr(goal?.pct)};background:${attr(goal?.stDot)};border-radius:6px`)} />
                    {goal?.hasExp ? (<>
                      <span title="Where you should be today" style={inlineStyle(`position:absolute;top:-4px;bottom:-4px;left:${attr(goal?.expPos)};width:2px;background:oklch(0.3 0.015 265);border-radius:1px`)} />
                    </>) : null}
                  </span>
                  {' '}
                  <span style={inlineStyle(`font-size:12.5px;color:${attr(goal?.dueColor)};font-weight:500;text-align:right;white-space:nowrap`)}>
                    {show(goal?.dueText)}
                  </span>
                  {' '}
                </button>
              </Fragment>))}
              {' '}
              {group?.empty ? (<>
                <button onClick={group?.add} style={{
                    width: '100%',
                    border: '0',
                    background: 'none',
                    padding: '16px',
                    fontSize: '13.5px',
                    color: 'oklch(0.52 0.012 265)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}>
                  {show(group?.emptyText)}
                </button>
              </>) : null}
              {' '}
            </div>
          </div>
          {' '}
        </>) : null}
        {' '}
      </div>
      {' '}
    </Fragment>))}
    {' '}
    {vm.gl?.noResults ? (<>
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '14px',
          padding: '32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
        }}>
        <span style={{ fontSize: '14.5px', fontWeight: '600' }}>
          {'No goals match these filters'}
        </span>
        <button onClick={vm.gl?.clear} style={{
            height: '32px',
            border: '1px solid oklch(0.88 0.008 85)',
            background: '#fff',
            borderRadius: '8px',
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.3 0.012 265)',
          }}>
          {'Clear filters'}
        </button>
      </div>
    </>) : null}
    {' '}
    {vm.gl?.empty ? (<>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '14px',
          padding: '36px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          textAlign: 'center',
        }}>
        {' '}
        <span style={{ fontSize: '17px', fontWeight: '600' }}>
          {'Set your first goal'}
        </span>
        {' '}
        <span style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', maxWidth: '460px', lineHeight: '1.55' }}>
          {'Pick 2–3 goals per company for this quarter. Start from a template or a blank goal.'}
        </span>
        {' '}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {asList(vm.gl?.templates).map((template, index) => (<Fragment key={index}>
            <button onClick={template?.go} style={{
                height: '36px',
                border: '1px solid oklch(0.88 0.008 85)',
                background: '#fff',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'oklch(0.3 0.012 265)',
              }}>
              {show(template?.label)}
            </button>
          </Fragment>))}
        </div>
        {' '}
      </div>
      {' '}
    </>) : null}
    {' '}
  </>);
}
