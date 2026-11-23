/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function GoalPanel({ vm }) {
  return (<>
    {' '}
    <div onClick={vm.gp?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.25)', zIndex: '40' }} />
    {' '}
    <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        width: 'min(760px,100%)',
        background: '#fff',
        zIndex: '41',
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
            {'Goals'}
          </span>
          <span>
            {'/'}
          </span>
          <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(vm.gp?.coTint)};color:${attr(vm.gp?.coInk)}`)}>
            {show(vm.gp?.coName)}
          </span>
        </div>
        {' '}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'oklch(0.62 0.01 265)', marginRight: '4px' }}>
            {'Esc to close'}
          </span>
          <button onClick={vm.gp?.close} style={{
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
            {'Close'}
          </button>
        </div>
        {' '}
      </div>
      {' '}
      <div style={{ flex: '1', overflowY: 'auto' }}>
        {' '}
        <div style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: '32px 32px 80px 56px',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          }}>
          {' '}
          <textarea data-gid={vm.gp?.id} rows="1" value={inputValue(vm.gp?.title)} onChange={vm.gp?.onTitle} placeholder="Name this goal, e.g. Reach ₹50 L monthly revenue" style={{
              border: '0',
              outline: 'none',
              resize: 'none',
              overflow: 'hidden',
              fieldSizing: 'content',
              fontSize: '30px',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              padding: '0',
              width: '100%',
              background: 'transparent',
              fontFamily: 'inherit',
            }} />
          {' '}
          <div style={inlineStyle(`display:flex;gap:18px;align-items:center;padding:18px;border-radius:14px;background:${attr(vm.gp?.stTint)}`)}>
            {' '}
            <span style={inlineStyle(`width:96px;height:96px;border-radius:50%;background:conic-gradient(${attr(vm.gp?.stDot)} ${attr(vm.gp?.pct)}, oklch(0.93 0.005 85) 0);display:grid;place-items:center;flex-shrink:0`)}>
              <span style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '22px',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                }}>
                {show(vm.gp?.pct)}
              </span>
            </span>
            {' '}
            <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {' '}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={inlineStyle(`display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;padding:3px 10px;border-radius:7px;background:#fff;color:${attr(vm.gp?.stInk)}`)}>
                  <span style={inlineStyle(`width:8px;height:8px;border-radius:50%;background:${attr(vm.gp?.stDot)}`)} />
                  {show(vm.gp?.stLabel)}
                </span>
                <span style={inlineStyle(`font-size:13px;font-weight:600;color:${attr(vm.gp?.dueColor)}`)}>
                  {show(vm.gp?.dueText)}
                </span>
              </div>
              {' '}
              <div style={{ fontSize: '14px', lineHeight: '1.5', color: 'oklch(0.3 0.012 265)' }}>
                {show(vm.gp?.explain)}
              </div>
              {' '}
              <span style={{
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                  height: '8px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '8px',
                }}>
                <span style={inlineStyle(`display:block;height:100%;width:${attr(vm.gp?.pct)};background:${attr(vm.gp?.stDot)};border-radius:8px`)} />
                {vm.gp?.hasExp ? (<>
                  <span title="Where you should be today" style={inlineStyle(`position:absolute;top:-4px;bottom:-4px;left:${attr(vm.gp?.expPos)};width:2px;background:oklch(0.3 0.015 265);border-radius:1px`)} />
                </>) : null}
              </span>
              {' '}
              <div style={{ fontSize: '12.5px', color: 'oklch(0.4 0.012 265)' }}>
                {show(vm.gp?.basis)}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
          <div style={{
              display: 'grid',
              gridTemplateColumns: '120px minmax(0,1fr)',
              gap: '8px 10px',
              alignItems: 'start',
            }}>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                height: '34px',
              }}>
              {'Company'}
            </span>
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
              {asList(vm.gp?.coSeg).map((companyOption, index) => (<Fragment key={index}>
                <button onClick={companyOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(companyOption?.bg)};color:${attr(companyOption?.fg)};box-shadow:${attr(companyOption?.sh)}`)}>
                  {show(companyOption?.label)}
                </button>
              </Fragment>))}
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                height: '34px',
              }}>
              {'Owner'}
            </span>
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
              {asList(vm.gp?.ownerSeg).map((ownerOption, index) => (<Fragment key={index}>
                <button onClick={ownerOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(ownerOption?.bg)};color:${attr(ownerOption?.fg)};box-shadow:${attr(ownerOption?.sh)}`)}>
                  {show(ownerOption?.label)}
                </button>
              </Fragment>))}
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                height: '34px',
              }}>
              {'Start date'}
            </span>
            <input type="date" value={inputValue(vm.gp?.start)} onChange={vm.gp?.onStart} style={{
                height: '34px',
                padding: '0 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '13.5px',
                outline: 'none',
                background: '#fff',
                minWidth: '0',
                fontFamily: 'inherit',
                maxWidth: '200px',
              }} />
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                height: '34px',
              }}>
              {'Target date'}
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input type="date" value={inputValue(vm.gp?.target)} onChange={vm.gp?.onTarget} style={{
                  height: '34px',
                  padding: '0 10px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  outline: 'none',
                  background: '#fff',
                  minWidth: '0',
                  fontFamily: 'inherit',
                  maxWidth: '200px',
                }} />
              {asList(vm.gp?.quickDates).map((quickDate, index) => (<Fragment key={index}>
                <button onClick={quickDate?.go} style={{
                    height: '28px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    background: '#fff',
                    borderRadius: '7px',
                    padding: '0 9px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: 'oklch(0.4 0.012 265)',
                  }}>
                  {show(quickDate?.label)}
                </button>
              </Fragment>))}
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                height: '34px',
              }}>
              {'Measure by'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                {asList(vm.gp?.measureSeg).map((measureOption, index) => (<Fragment key={index}>
                  <button onClick={measureOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(measureOption?.bg)};color:${attr(measureOption?.fg)};box-shadow:${attr(measureOption?.sh)}`)}>
                    {show(measureOption?.label)}
                  </button>
                </Fragment>))}
              </div>
              <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                {show(vm.gp?.measureHelp)}
              </span>
            </div>
            {' '}
            {vm.gp?.isNumber ? (<>
              <span style={{
                  fontSize: '13px',
                  color: 'oklch(0.52 0.012 265)',
                  display: 'flex',
                  alignItems: 'center',
                  height: '34px',
                }}>
                {'Numbers'}
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="number" value={inputValue(vm.gp?.current)} onChange={vm.gp?.onCurrent} placeholder="Now" title="Where you are now" style={{
                    height: '34px',
                    padding: '0 10px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    outline: 'none',
                    background: '#fff',
                    minWidth: '0',
                    fontFamily: 'inherit',
                    width: '110px',
                  }} />
                <span style={{ color: 'oklch(0.52 0.012 265)', fontSize: '13px' }}>
                  {'of'}
                </span>
                <input type="number" value={inputValue(vm.gp?.goalVal)} onChange={vm.gp?.onGoalVal} placeholder="Target" title="Target" style={{
                    height: '34px',
                    padding: '0 10px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    outline: 'none',
                    background: '#fff',
                    minWidth: '0',
                    fontFamily: 'inherit',
                    width: '110px',
                  }} />
                <input value={inputValue(vm.gp?.unit)} onChange={vm.gp?.onUnit} placeholder="unit, e.g. ₹ / clients" style={{
                    height: '34px',
                    padding: '0 10px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    outline: 'none',
                    background: '#fff',
                    minWidth: '0',
                    fontFamily: 'inherit',
                    width: '150px',
                  }} />
              </div>
            </>) : null}
            {' '}
          </div>
          {' '}
          <div style={{ border: '1px solid oklch(0.92 0.005 85)', borderRadius: '12px' }}>
            {' '}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                padding: '10px 14px',
                borderBottom: '1px solid oklch(0.94 0.005 85)',
              }}>
              {' '}
              <span style={{ fontSize: '14px', fontWeight: '600' }}>
                {'Tasks for this goal '}
                <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)', marginLeft: '4px' }}>
                  {show(vm.gp?.linkInfo)}
                </span>
              </span>
              {' '}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={vm.gp?.linkMenu} style={{
                    height: '30px',
                    border: '1px solid oklch(0.88 0.008 85)',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: 'oklch(0.3 0.012 265)',
                  }}>
                  {'Link existing ▾'}
                </button>
                <button onClick={vm.gp?.addTask} style={{
                    height: '30px',
                    border: '0',
                    background: 'var(--acc, oklch(0.5 0.17 265))',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}>
                  {'+ New task'}
                </button>
              </div>
              {' '}
            </div>
            {' '}
            {asList(vm.gp?.tasks).map((task, index) => (<Fragment key={index}>
              <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  borderBottom: '1px solid oklch(0.96 0.004 85)',
                }}>
                <button onClick={task?.toggle} title="Mark done" style={inlineStyle(`width:18px;height:18px;border-radius:5px;border:1.5px solid ${attr(task?.checkBorder)};background:${attr(task?.checkBg)};color:#fff;font-size:10px;line-height:1;cursor:pointer;padding:0;flex-shrink:0`)}>
                  {show(task?.mark)}
                </button>
                <button onClick={task?.open} style={inlineStyle(`flex:1;min-width:0;border:0;background:none;padding:0;text-align:left;cursor:pointer;font-size:14px;text-decoration:${attr(task?.deco)};color:${attr(task?.color)};overflow:hidden;text-overflow:ellipsis;white-space:nowrap`)}>
                  {show(task?.title)}
                </button>
                <span style={inlineStyle(`width:20px;height:20px;border-radius:50%;background:${attr(task?.ownerBg)};color:#fff;font-size:8.5px;font-weight:600;display:grid;place-items:center;flex-shrink:0`)}>
                  {show(task?.ownerIni)}
                </span>
                <span style={inlineStyle(`font-size:12px;color:${attr(task?.dueColor)};white-space:nowrap;min-width:64px;text-align:right`)}>
                  {show(task?.dueText)}
                </span>
                <button onClick={task?.unlink} title="Remove from this goal" style={{
                    border: '0',
                    background: 'none',
                    color: 'oklch(0.72 0.01 265)',
                    fontSize: '15px',
                    cursor: 'pointer',
                    padding: '0 2px',
                  }} className="scp1c">
                  {'×'}
                </button>
              </div>
            </Fragment>))}
            {' '}
            {vm.gp?.noTasks ? (<>
              <div style={{ padding: '14px', fontSize: '13px', color: 'oklch(0.52 0.012 265)', lineHeight: '1.5' }}>
                {show(vm.gp?.noTasksText)}
              </div>
            </>) : null}
            {' '}
          </div>
          {' '}
          <div style={{
              border: '1px solid oklch(0.92 0.005 85)',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
            {' '}
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              {'Progress updates'}
            </div>
            {' '}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {' '}
              {vm.gp?.isNumber ? (<>
                <input type="number" value={inputValue(vm.gp?.updVal)} onChange={vm.gp?.onUpdVal} placeholder="New number" style={{
                    height: '34px',
                    padding: '0 10px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    outline: 'none',
                    background: '#fff',
                    minWidth: '0',
                    fontFamily: 'inherit',
                    width: '130px',
                  }} />
              </>) : null}
              {' '}
              <input value={inputValue(vm.gp?.updNote)} onChange={vm.gp?.onUpdNote} onKeyDown={vm.gp?.onUpdKey} placeholder="What changed? e.g. Closed 2 new clients this week" style={{
                  height: '34px',
                  padding: '0 10px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  outline: 'none',
                  background: '#fff',
                  minWidth: '0',
                  fontFamily: 'inherit',
                  flex: '1 1 240px',
                }} />
              {' '}
              <button onClick={vm.gp?.postUpd} style={{
                  height: '34px',
                  border: '0',
                  background: 'var(--acc, oklch(0.5 0.17 265))',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'Post update'}
              </button>
              {' '}
            </div>
            {' '}
            {asList(vm.gp?.checkins).map((checkin, index) => (<Fragment key={index}>
              <div style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  paddingTop: '10px',
                  borderTop: '1px solid oklch(0.96 0.004 85)',
                }}>
                <span style={inlineStyle(`width:24px;height:24px;border-radius:50%;background:${attr(checkin?.bg)};color:#fff;font-size:9.5px;font-weight:600;display:grid;place-items:center;flex-shrink:0`)}>
                  {show(checkin?.ini)}
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div style={{ fontSize: '12.5px' }}>
                    <span style={{ fontWeight: '600' }}>
                      {show(checkin?.name)}
                    </span>
                    <span style={{ color: 'oklch(0.52 0.012 265)', marginLeft: '6px' }}>
                      {show(checkin?.when)}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: '1.5', marginTop: '2px' }}>
                    {show(checkin?.text)}
                  </div>
                </div>
                <button onClick={checkin?.remove} title="Delete update" style={{
                    border: '0',
                    background: 'none',
                    color: 'oklch(0.75 0.01 265)',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }} className="scp1c">
                  {'×'}
                </button>
              </div>
            </Fragment>))}
            {' '}
            {vm.gp?.noCheckins ? (<>
              <div style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
                {'Post a quick update each week so every founder sees how it\'s going.'}
              </div>
            </>) : null}
            {' '}
          </div>
          {' '}
          <div>
            {' '}
            <div style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'oklch(0.52 0.012 265)',
                marginBottom: '8px',
              }}>
              {'Plan & notes'}
            </div>
            {' '}
            {asList(vm.gp?.blocks).map((block, index) => (<Fragment key={index}>
              {' '}
              <div style={inlineStyle(`display:flex;align-items:flex-start;gap:2px;margin-top:${attr(block?.mt)};margin-left:-28px`)}>
                {' '}
                <div style={inlineStyle(`position:relative;width:26px;flex-shrink:0;padding-top:${attr(block?.ht)}`)}>
                  {' '}
                  <button onClick={block?.openMenu} title="Turn into or delete" style={{
                      width: '22px',
                      height: '22px',
                      border: '0',
                      background: 'none',
                      color: 'oklch(0.82 0.008 265)',
                      cursor: 'pointer',
                      borderRadius: '5px',
                      fontSize: '12px',
                      lineHeight: '1',
                      padding: '0',
                      letterSpacing: '-2px',
                    }} className="scp2c">
                    {'⋮⋮'}
                  </button>
                  {' '}
                  {block?.menuOpen ? (<>
                    <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: '0',
                        zIndex: '30',
                        minWidth: '170px',
                        background: '#fff',
                        border: '1px solid oklch(0.9 0.006 85)',
                        borderRadius: '10px',
                        boxShadow: '0 10px 28px oklch(0.2 0.02 265 / 0.14)',
                        padding: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1px',
                      }}>
                      {asList(block?.menu).map((menuItem, index) => (<Fragment key={index}>
                        <button onClick={menuItem?.go} style={inlineStyle(`display:flex;align-items:center;justify-content:space-between;gap:10px;border:0;background:${attr(menuItem?.bg)};padding:7px 10px;border-radius:6px;font-size:13px;cursor:pointer;text-align:left;white-space:nowrap`)} className="scp2d">
                          <span>
                            {show(menuItem?.label)}
                          </span>
                          <span style={{ color: 'var(--acc, oklch(0.5 0.17 265))', fontSize: '12px' }}>
                            {show(menuItem?.mark)}
                          </span>
                        </button>
                      </Fragment>))}
                      <div style={{ height: '1px', background: 'oklch(0.93 0.005 85)', margin: '3px 0' }} />
                      <button onClick={block?.del} style={{
                          border: '0',
                          background: 'none',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          color: 'oklch(0.5 0.18 25)',
                        }} className="scp2e">
                        {'Delete'}
                      </button>
                    </div>
                  </>) : null}
                  {' '}
                </div>
                {' '}
                {block?.isBullet ? (<>
                  <span style={inlineStyle(`width:22px;flex-shrink:0;text-align:center;font-size:${attr(block?.fs)};line-height:${attr(block?.lh)};padding-top:3px`)}>
                    {'•'}
                  </span>
                </>) : null}
                {' '}
                {block?.isNum ? (<>
                  <span style={inlineStyle(`min-width:24px;flex-shrink:0;text-align:right;padding:3px 4px 0 0;font-size:${attr(block?.fs)};line-height:${attr(block?.lh)}`)}>
                    {show(block?.num)}{'.'}
                  </span>
                </>) : null}
                {' '}
                {block?.isTodo ? (<>
                  <span style={inlineStyle(`width:24px;flex-shrink:0;padding-top:${attr(block?.ct)};display:flex;justify-content:center`)}>
                    <button onClick={block?.toggleCheck} style={inlineStyle(`width:16px;height:16px;border-radius:4px;border:1.5px solid ${attr(block?.checkBorder)};background:${attr(block?.checkBg)};color:#fff;font-size:10px;line-height:1;padding:0;cursor:pointer`)}>
                      {show(block?.mark)}
                    </button>
                  </span>
                </>) : null}
                {' '}
                {block?.isDivider ? (<>
                  <div style={{ flex: '1', padding: '11px 0' }}>
                    <div style={{ height: '1px', background: 'oklch(0.88 0.006 85)' }} />
                  </div>
                </>) : null}
                {' '}
                {block?.isText ? (<>
                  <div style={{ flex: '1', minWidth: '0', position: 'relative' }}>
                    {' '}
                    <textarea data-bid={block?.id} rows="1" value={inputValue(block?.text)} onChange={block?.onChange} onKeyDown={block?.onKey} onFocus={block?.onFocus} placeholder={block?.ph} style={inlineStyle(`display:block;width:100%;border:0;outline:none;resize:none;background:transparent;overflow:hidden;field-sizing:content;padding:3px 2px 3px ${attr(block?.pl)};font-size:${attr(block?.fs)};font-weight:${attr(block?.fw)};line-height:${attr(block?.lh)};letter-spacing:${attr(block?.ls)};text-decoration:${attr(block?.deco)};color:${attr(block?.color)};font-style:${attr(block?.fst)};border-left:${attr(block?.bl)}`)} />
                    {' '}
                    {block?.slashOpen ? (<>
                      <div style={{
                          position: 'absolute',
                          top: 'calc(100% + 4px)',
                          left: '0',
                          zIndex: '30',
                          minWidth: '170px',
                          background: '#fff',
                          border: '1px solid oklch(0.9 0.006 85)',
                          borderRadius: '10px',
                          boxShadow: '0 10px 28px oklch(0.2 0.02 265 / 0.14)',
                          padding: '4px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1px',
                        }}>
                        {asList(block?.slash).map((slashOption, index) => (<Fragment key={index}>
                          <button onClick={slashOption?.go} style={inlineStyle(`display:flex;align-items:center;justify-content:space-between;gap:10px;border:0;background:${attr(slashOption?.bg)};padding:7px 10px;border-radius:6px;font-size:13px;cursor:pointer;text-align:left;white-space:nowrap`)} className="scp2d">
                            <span>
                              {show(slashOption?.label)}
                            </span>
                            <span style={{ color: 'var(--acc, oklch(0.5 0.17 265))', fontSize: '12px' }}>
                              {show(slashOption?.mark)}
                            </span>
                          </button>
                        </Fragment>))}
                      </div>
                    </>) : null}
                    {' '}
                  </div>
                </>) : null}
                {' '}
              </div>
              {' '}
            </Fragment>))}
            {' '}
            <div onClick={vm.gp?.addBlockEnd} style={{ minHeight: '60px', cursor: 'text' }} />
            {' '}
          </div>
          {' '}
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              paddingTop: '14px',
              borderTop: '1px solid oklch(0.94 0.005 85)',
            }}>
            <span style={{ fontSize: '12px', color: 'oklch(0.6 0.01 265)' }}>
              {show(vm.gp?.created)}
            </span>
            <button onClick={vm.gp?.remove} style={{
                border: '0',
                background: 'none',
                color: 'oklch(0.5 0.18 25)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '0',
              }}>
              {'Delete goal'}
            </button>
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
