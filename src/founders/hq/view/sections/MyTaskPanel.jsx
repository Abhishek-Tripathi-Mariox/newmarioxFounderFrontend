/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function MyTaskPanel({ vm }) {
  return (<>
    {' '}
    <div onClick={vm.tp?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.25)', zIndex: '40' }} />
    {' '}
    <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        width: 'min(780px,100%)',
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
            {'My tasks'}
          </span>
          <span>
            {'/'}
          </span>
          <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(vm.tp?.co?.tint)};color:${attr(vm.tp?.co?.ink)}`)}>
            {show(vm.tp?.co?.label)}
          </span>
        </div>
        {' '}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {' '}
          <div style={{ display: 'flex', gap: '2px', marginRight: '4px' }}>
            <button onClick={vm.tp?.prev} title="Previous task" disabled={vm.tp?.noPrev} style={inlineStyle(`width:30px;height:30px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:7px;cursor:pointer;font-size:12px;color:oklch(0.4 0.012 265);opacity:${attr(vm.tp?.prevOp)}`)} className="scp10">
              {'↑'}
            </button>
            <button onClick={vm.tp?.next} title="Next task" disabled={vm.tp?.noNext} style={inlineStyle(`width:30px;height:30px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:7px;cursor:pointer;font-size:12px;color:oklch(0.4 0.012 265);opacity:${attr(vm.tp?.nextOp)}`)} className="scp10">
              {'↓'}
            </button>
          </div>
          {' '}
          <button onClick={vm.tp?.markDone} title={vm.tp?.doneTip} style={inlineStyle(`height:30px;border:1px solid ${attr(vm.tp?.doneBd)};background:${attr(vm.tp?.doneBg)};color:${attr(vm.tp?.doneFg)};border-radius:7px;padding:0 11px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px`)}>
            {show(vm.tp?.doneLabel)}
          </button>
          {' '}
          <button onClick={vm.tp?.dup} title="Make a copy of this task" style={{
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
          <button onClick={vm.tp?.more} title="Move dates, copy, start" style={{
              height: '30px',
              border: '1px solid oklch(0.9 0.006 85)',
              background: '#fff',
              borderRadius: '7px',
              padding: '0 11px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.35 0.012 265)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }} className="scp10">
            {'More'}
            <span style={{ fontSize: '9px', opacity: '0.6' }}>
              {'▼'}
            </span>
          </button>
          {' '}
          <button onClick={vm.tp?.remove} title="Delete this task (you can undo)" style={{
              height: '30px',
              border: '1px solid oklch(0.88 0.05 25)',
              background: 'oklch(0.98 0.012 25)',
              color: 'oklch(0.5 0.18 25)',
              borderRadius: '7px',
              padding: '0 11px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }} className="scp30">
            {'Delete'}
          </button>
          {' '}
          <div style={{ width: '1px', height: '20px', background: 'oklch(0.9 0.006 85)', margin: '0 2px' }} />
          <button onClick={vm.tp?.close} style={{
              height: '30px',
              border: '1px solid oklch(0.9 0.006 85)',
              background: '#fff',
              borderRadius: '7px',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.35 0.012 265)',
            }} className="scp10">
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
            padding: '36px 32px 80px 56px',
            display: 'flex',
            flexDirection: 'column',
          }}>
          {' '}
          <textarea data-tpeek-title="1" rows="1" value={inputValue(vm.tp?.title)} onChange={vm.tp?.onTitle} onKeyDown={vm.tp?.onTitleKey} placeholder="Untitled task" style={{
              border: '0',
              outline: 'none',
              resize: 'none',
              overflow: 'hidden',
              fieldSizing: 'content',
              fontSize: '34px',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              padding: '0',
              width: '100%',
              background: 'transparent',
              fontFamily: 'inherit',
            }} />
          {' '}
          <div style={{
              display: 'grid',
              gridTemplateColumns: '130px minmax(0,1fr)',
              gap: '2px 8px',
              margin: '22px 0 8px',
            }}>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '34px',
              }}>
              {'Status'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={vm.tp?.st?.toggle} style={{
                  border: '0',
                  background: 'none',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '100%',
                  minWidth: '0',
                }} className="scp2d">
                <span style={inlineStyle(`display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;padding:3px 8px 3px 9px;border-radius:7px;white-space:nowrap;background:${attr(vm.tp?.st?.tint)};color:${attr(vm.tp?.st?.ink)};border:1px solid ${attr(vm.tp?.st?.bd)}`)}>
                  <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(vm.tp?.st?.dot)}`)} />
                  {show(vm.tp?.st?.label)}
                  <span style={{ fontSize: '9px', opacity: '0.7' }}>
                    {'▼'}
                  </span>
                </span>
              </button>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '34px',
              }}>
              {'Start date'}
            </span>
            <div style={{ maxWidth: '200px' }}>
              <input type="date" value={inputValue(vm.tp?.start)} onChange={vm.tp?.onStart} style={inlineStyle(`height:30px;width:100%;min-width:0;border:1px solid transparent;border-radius:6px;background:transparent;font-size:13px;padding:0 6px;font-family:inherit;cursor:pointer;color:${attr(vm.tp?.startColor)};`)} className="scp31" />
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '34px',
              }}>
              {'Due date'}
            </span>
            <div style={{ maxWidth: '200px' }}>
              <input type="date" value={inputValue(vm.tp?.due)} onChange={vm.tp?.onDue} style={inlineStyle(`height:30px;width:100%;min-width:0;border:1px solid transparent;border-radius:6px;background:transparent;font-size:13px;padding:0 6px;font-family:inherit;cursor:pointer;color:${attr(vm.tp?.dueColor)};font-weight:${attr(vm.tp?.dueWeight)}`)} className="scp31" />
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '34px',
              }}>
              {'Team'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={vm.tp?.own?.toggle} style={{
                  border: '0',
                  background: 'none',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '100%',
                  minWidth: '0',
                }} className="scp2d">
                <span style={inlineStyle(`width:22px;height:22px;border-radius:50%;background:${attr(vm.tp?.own?.bg)};color:#fff;font-size:9px;font-weight:600;display:grid;place-items:center`)}>
                  {show(vm.tp?.own?.ini)}
                </span>
                <span style={{ fontSize: '13.5px' }}>
                  {show(vm.tp?.own?.label)}
                </span>
                <span style={{ fontSize: '9px', opacity: '0.5' }}>
                  {'▼'}
                </span>
              </button>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '34px',
              }}>
              {'Company'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={vm.tp?.co?.toggle} style={{
                  border: '0',
                  background: 'none',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '100%',
                  minWidth: '0',
                }} className="scp2d">
                <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(vm.tp?.co?.tint)};color:${attr(vm.tp?.co?.ink)}`)}>
                  {show(vm.tp?.co?.label)}
                </span>
                <span style={{ fontSize: '9px', opacity: '0.5' }}>
                  {'▼'}
                </span>
              </button>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '34px',
              }}>
              {'Priority'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={vm.tp?.pr?.toggle} style={{
                  border: '0',
                  background: 'none',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '100%',
                  minWidth: '0',
                }} className="scp2d">
                <span style={inlineStyle(`width:8px;height:8px;border-radius:2px;background:${attr(vm.tp?.pr?.dot)}`)} />
                <span style={{ fontSize: '13.5px' }}>
                  {show(vm.tp?.pr?.label)}
                </span>
                <span style={{ fontSize: '9px', opacity: '0.5' }}>
                  {'▼'}
                </span>
              </button>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '34px',
              }}>
              {'Goal'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={vm.tp?.goal?.toggle} style={{
                  border: '0',
                  background: 'none',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '100%',
                  minWidth: '0',
                }} className="scp2d">
                <span style={inlineStyle(`font-size:13.5px;color:${attr(vm.tp?.goal?.color)}`)}>
                  {show(vm.tp?.goal?.label)}
                </span>
                <span style={{ fontSize: '9px', opacity: '0.5' }}>
                  {'▼'}
                </span>
              </button>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '34px',
              }}>
              {'Waiting on'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={vm.tp?.wait?.toggle} style={{
                  border: '0',
                  background: 'none',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '100%',
                  minWidth: '0',
                }} className="scp2d">
                <span style={inlineStyle(`font-size:13.5px;color:${attr(vm.tp?.wait?.color)}`)}>
                  {show(vm.tp?.wait?.label)}
                </span>
                <span style={{ fontSize: '9px', opacity: '0.5' }}>
                  {'▼'}
                </span>
              </button>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '34px',
              }}>
              {'Repeat'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={vm.tp?.rep?.toggle} style={{
                  border: '0',
                  background: 'none',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '100%',
                  minWidth: '0',
                }} className="scp2d">
                <span style={inlineStyle(`font-size:13.5px;color:${attr(vm.tp?.rep?.color)}`)}>
                  {show(vm.tp?.rep?.label)}
                </span>
                <span style={{ fontSize: '9px', opacity: '0.5' }}>
                  {'▼'}
                </span>
              </button>
            </div>
            {' '}
          </div>
          {' '}
          <div style={{ border: '1px solid oklch(0.92 0.005 85)', borderRadius: '10px', margin: '14px 0 26px' }}>
            {' '}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '8px 12px',
                borderBottom: '1px solid oklch(0.94 0.005 85)',
              }}>
              {' '}
              <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                {'Sub-tasks '}
                <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)', marginLeft: '4px' }}>
                  {show(vm.tp?.subInfo)}
                </span>
              </span>
              {' '}
              <button onClick={vm.tp?.addSub} style={{
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
                {'+ Add sub-task'}
              </button>
              {' '}
            </div>
            {' '}
            {vm.tp?.hasSubs ? (<>
              <div style={{
                  height: '4px',
                  background: 'oklch(0.95 0.005 85)',
                  margin: '0 12px',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginTop: '10px',
                }}>
                <div style={inlineStyle(`height:100%;width:${attr(vm.tp?.subPct)};background:oklch(0.6 0.14 150)`)} />
              </div>
            </>) : null}
            {' '}
            {asList(vm.tp?.subs).map((sub, index) => (<Fragment key={index}>
              {' '}
              <div style={{
                  display: 'grid',
                  gridTemplateColumns: '26px minmax(0,1fr) 140px 24px',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderBottom: '1px solid oklch(0.96 0.004 85)',
                }}>
                {' '}
                <button onClick={sub?.toggle} style={inlineStyle(`width:17px;height:17px;border-radius:5px;border:1.5px solid ${attr(sub?.checkBorder)};background:${attr(sub?.checkBg)};color:#fff;font-size:10px;line-height:1;cursor:pointer;padding:0`)}>
                  {show(sub?.mark)}
                </button>
                {' '}
                <input data-sid={sub?.id} value={inputValue(sub?.title)} onChange={sub?.onTitle} onKeyDown={sub?.onKey} placeholder="Sub-task name" style={inlineStyle(`border:0;outline:none;background:transparent;font-size:14px;padding:7px 2px;min-width:0;text-decoration:${attr(sub?.deco)};color:${attr(sub?.color)}`)} />
                {' '}
                <input type="date" value={inputValue(sub?.due)} onChange={sub?.onDue} style={inlineStyle(`height:30px;width:100%;min-width:0;border:1px solid transparent;border-radius:6px;background:transparent;font-size:13px;padding:0 6px;font-family:inherit;cursor:pointer;color:${attr(sub?.dueColor)};`)} className="scp31" />
                {' '}
                <button onClick={sub?.remove} title="Delete sub-task" style={{
                    border: '0',
                    background: 'none',
                    color: 'oklch(0.72 0.01 265)',
                    fontSize: '15px',
                    cursor: 'pointer',
                    padding: '0',
                  }} className="scp1c">
                  {'×'}
                </button>
                {' '}
              </div>
              {' '}
            </Fragment>))}
            {' '}
            {vm.tp?.noSubs ? (<>
              <button onClick={vm.tp?.addSub} style={{
                  width: '100%',
                  border: '0',
                  background: 'none',
                  padding: '14px 12px',
                  fontSize: '13px',
                  color: 'oklch(0.52 0.012 265)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }} className="scp13">
                {'Break this task into smaller steps. Click to add the first one.'}
              </button>
            </>) : null}
            {' '}
          </div>
          {' '}
          <div style={{
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'oklch(0.52 0.012 265)',
              marginBottom: '6px',
            }}>
            {'Description & document'}
          </div>
          {' '}
          {asList(vm.tp?.blocks).map((block, index) => (<Fragment key={index}>
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
                      {asList(block?.slash).map((slashItem, index) => (<Fragment key={index}>
                        <button onClick={slashItem?.go} style={inlineStyle(`display:flex;align-items:center;justify-content:space-between;gap:10px;border:0;background:${attr(slashItem?.bg)};padding:7px 10px;border-radius:6px;font-size:13px;cursor:pointer;text-align:left;white-space:nowrap`)} className="scp2d">
                          <span>
                            {show(slashItem?.label)}
                          </span>
                          <span style={{ color: 'var(--acc, oklch(0.5 0.17 265))', fontSize: '12px' }}>
                            {show(slashItem?.mark)}
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
          <div onClick={vm.tp?.addBlockEnd} style={{ minHeight: '70px', cursor: 'text' }} />
          {' '}
          <div style={{ fontSize: '12px', color: 'oklch(0.62 0.01 265)', marginBottom: '26px' }}>
            {'Type / for headings, lists, to-dos, quotes and dividers.'}
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
              {'Comments'}
            </div>
            {' '}
            {asList(vm.tp?.comments).map((comment, index) => (<Fragment key={index}>
              {' '}
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
                  }} className="scp1c">
                  {'×'}
                </button>
              </div>
              {' '}
            </Fragment>))}
            {' '}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={inlineStyle(`width:26px;height:26px;border-radius:50%;background:${attr(vm.me?.bg)};color:#fff;font-size:9.5px;font-weight:600;display:grid;place-items:center;flex-shrink:0`)}>
                {show(vm.me?.ini)}
              </span>
              <textarea rows="1" value={inputValue(vm.tp?.cdraft)} onChange={vm.tp?.onC} onKeyDown={vm.tp?.onCKey} placeholder="Add a comment… (Enter to post)" style={{
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
              <button onClick={vm.tp?.postC} style={{
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
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              marginTop: '30px',
              paddingTop: '14px',
              borderTop: '1px solid oklch(0.94 0.005 85)',
            }}>
            <span style={{ fontSize: '12px', color: 'oklch(0.6 0.01 265)' }}>
              {show(vm.tp?.created)}
            </span>
            <button onClick={vm.tp?.remove} style={{
                border: '0',
                background: 'none',
                color: 'oklch(0.5 0.18 25)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '0',
              }}>
              {'Delete task'}
            </button>
          </div>
          {' '}
          <div style={{ fontSize: '12px', color: 'oklch(0.62 0.01 265)', marginTop: '10px' }}>
            {'Shortcuts: Esc closes · Alt+↑/↓ previous or next task'}
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
