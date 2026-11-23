/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html): the founders' own tasks (My tasks, data.tasks). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';
import MyTaskList from './MyTaskList';

export default function MyTasks({ vm }) {
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
          {'My tasks'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {show(vm.tk?.sub)}
        </div>
      </div>
      {' '}
      <button onClick={vm.tk?.add} style={{
          height: '38px',
          border: '0',
          background: 'var(--acc, oklch(0.5 0.17 265))',
          color: '#fff',
          borderRadius: '9px',
          padding: '0 18px',
          fontSize: '13.5px',
          fontWeight: '600',
          cursor: 'pointer',
        }} className="scp15">
        {'+ New task'}
      </button>
      {' '}
    </div>
    {' '}
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', borderBottom: '1px solid oklch(0.92 0.005 85)' }}>
      {' '}
      {asList(vm.tk?.coTabs).map((tab, index) => (<Fragment key={index}>
        <button onClick={tab?.go} style={inlineStyle(`display:flex;align-items:center;gap:8px;border:0;background:none;padding:8px 12px 10px;font-size:14px;font-weight:600;cursor:pointer;color:${attr(tab?.fg)};border-bottom:2px solid ${attr(tab?.bd)};margin-bottom:-1px`)}>
          {tab?.hasTile ? (<>
            <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(tab?.tile)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center`)}>
              {show(tab?.ini)}
            </span>
          </>) : null}
          <span>
            {show(tab?.label)}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '500', color: 'oklch(0.52 0.012 265)' }}>
            {show(tab?.n)}
          </span>
        </button>
      </Fragment>))}
      {vm.tk?.coMore?.has ? (<>
        <input list={vm.tk?.coMore?.id} onChange={vm.tk?.coMore?.on} placeholder={vm.tk?.coMore?.ph} style={{
            marginLeft: 'auto',
            flex: '0 0 210px',
            height: '30px',
            padding: '0 10px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '8px',
            fontSize: '12.5px',
            outline: 'none',
            background: '#fff',
            alignSelf: 'center',
            fontFamily: 'inherit',
          }} />
        <datalist id={vm.tk?.coMore?.id}>
          {asList(vm.tk?.coMore?.opts).map((option, index) => (<Fragment key={index}>
            <option value={inputValue(option?.l)} />
          </Fragment>))}
        </datalist>
      </>) : null}
      {' '}
    </div>
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(118px,1fr))', gap: '10px' }}>
      {' '}
      {asList(vm.tk?.tiles).map((tile, index) => (<Fragment key={index}>
        {' '}
        <button onClick={tile?.go} title={tile?.tip} style={inlineStyle(`text-align:left;background:${attr(tile?.bg)};border:1.5px solid ${attr(tile?.bd)};border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:3px;cursor:pointer`)} className="scp1b">
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
          <span style={inlineStyle(`font-size:22px;font-weight:600;letter-spacing:-0.01em;color:${attr(tile?.color)}`)}>
            {show(tile?.n)}
          </span>
          {' '}
        </button>
        {' '}
      </Fragment>))}
      {' '}
    </div>
    {' '}
    <div style={{ background: '#fff', border: '1px solid oklch(0.915 0.006 85)', borderRadius: '12px' }}>
      {' '}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', padding: '10px 12px 0' }}>
        {' '}
        {asList(vm.tk?.quick).map((quickView, index) => (<Fragment key={index}>
          <button onClick={quickView?.go} style={inlineStyle(`height:28px;border:1px solid ${attr(quickView?.bd)};background:${attr(quickView?.bg)};color:${attr(quickView?.fg)};border-radius:999px;padding:0 12px;font-size:12.5px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap`)} className="scp1b">
            <span>
              {show(quickView?.label)}
            </span>
            <span style={{ fontWeight: '500', opacity: '0.65' }}>
              {show(quickView?.n)}
            </span>
          </button>
        </Fragment>))}
        {' '}
        <div style={{ flex: '1' }} />
        {' '}
        <div style={{
            display: 'flex',
            gap: '2px',
            padding: '3px',
            background: 'oklch(0.94 0.005 85)',
            borderRadius: '9px',
          }}>
          {asList(vm.tk?.viewSeg).map((segment, index) => (<Fragment key={index}>
            <button onClick={segment?.go} style={inlineStyle(`border:0;padding:4px 12px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
              {show(segment?.label)}
            </button>
          </Fragment>))}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          padding: '10px 12px',
          borderBottom: '1px solid oklch(0.94 0.005 85)',
        }}>
        {' '}
        <input value={inputValue(vm.tk?.q)} onChange={vm.tk?.onQ} placeholder="Search tasks" style={{
            flex: '0 1 220px',
            minWidth: '140px',
            height: '32px',
            padding: '0 12px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '8px',
            fontSize: '13px',
            outline: 'none',
          }} />
        {' '}
        {asList(vm.tk?.filters).map((filter, index) => (<Fragment key={index}>
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
        {vm.tk?.anyFilter ? (<>
          <button onClick={vm.tk?.clear} style={{
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
        {asList(vm.tk?.viewOpts).map((viewOpt, index) => (<Fragment key={index}>
          <button onClick={viewOpt?.go} style={inlineStyle(`height:32px;border:1px solid ${attr(viewOpt?.bd)};background:${attr(viewOpt?.bg)};color:${attr(viewOpt?.fg)};border-radius:8px;padding:0 10px;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap`)} className="scp17">
            <span>
              {show(viewOpt?.label)}
            </span>
            <span style={{ fontSize: '9px', opacity: '0.6' }}>
              {'▼'}
            </span>
          </button>
        </Fragment>))}
        {' '}
      </div>
      {' '}
      {vm.tk?.hasSel ? (<>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '8px 12px',
            background: 'oklch(0.97 0.015 265)',
            borderBottom: '1px solid oklch(0.9 0.03 265)',
          }}>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'oklch(0.35 0.12 265)' }}>
            {show(vm.tk?.selN)}
          </span>
          {' '}
          {asList(vm.tk?.bulk).map((bulkAction, index) => (<Fragment key={index}>
            <button onClick={bulkAction?.go} style={{
                height: '30px',
                border: '1px solid oklch(0.85 0.03 265)',
                background: '#fff',
                borderRadius: '7px',
                padding: '0 10px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'oklch(0.3 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }} className="scp1d">
              <span>
                {show(bulkAction?.label)}
              </span>
              <span style={{ fontSize: '9px', opacity: '0.6' }}>
                {'▼'}
              </span>
            </button>
          </Fragment>))}
          {' '}
          <button onClick={vm.tk?.bulkDel} style={{
              height: '30px',
              border: '1px solid oklch(0.85 0.06 25)',
              background: '#fff',
              borderRadius: '7px',
              padding: '0 10px',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.5 0.17 25)',
            }}>
            {'Delete'}
          </button>
          {' '}
          <div style={{ flex: '1' }} />
          {' '}
          <button onClick={vm.tk?.selClear} style={{
              height: '30px',
              border: '0',
              background: 'none',
              padding: '0 6px',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.45 0.12 265)',
            }}>
            {'Clear selection'}
          </button>
          {' '}
        </div>
      </>) : null}
      {' '}
      {vm.tk?.isList ? <MyTaskList vm={vm} /> : null}
      {' '}
      {vm.tk?.isBoard ? (<>
        {' '}
        <div style={{ overflowX: 'auto', padding: '12px' }}>
          {' '}
          <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(260px,1fr)', gap: '10px' }}>
            {' '}
            {asList(vm.tk?.groups).map((group, index) => (<Fragment key={index}>
              {' '}
              <div style={{
                  background: 'oklch(0.97 0.004 85)',
                  borderRadius: '12px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minHeight: '180px',
                }}>
                {' '}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '2px 4px',
                    fontSize: '13.5px',
                    fontWeight: '600',
                  }}>
                  <span style={inlineStyle(`width:9px;height:9px;border-radius:50%;background:${attr(group?.dot)}`)} />
                  <span>
                    {show(group?.label)}
                  </span>
                  <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)' }}>
                    {show(group?.count)}
                  </span>
                </div>
                {' '}
                {asList(group?.rows).map((task, index) => (<Fragment key={index}>
                  {' '}
                  <button onClick={task?.openTask} style={{
                      width: '100%',
                      textAlign: 'left',
                      background: '#fff',
                      border: '1px solid oklch(0.915 0.006 85)',
                      borderRadius: '10px',
                      padding: '11px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '9px',
                      cursor: 'pointer',
                    }} className="scp1b">
                    {' '}
                    <span style={inlineStyle(`font-size:14px;font-weight:600;line-height:1.35;text-decoration:${attr(task?.deco)};color:${attr(task?.titleColor)}`)}>
                      {show(task?.titleOr)}
                    </span>
                    {' '}
                    <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(task?.dp?.tint)};color:${attr(task?.dp?.ink)}`)}>
                        {show(task?.dp?.label)}
                      </span>
                      <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(task?.co?.tint)};color:${attr(task?.co?.ink)}`)}>
                        {show(task?.co?.label)}
                      </span>
                      <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                        <span style={inlineStyle(`width:7px;height:7px;border-radius:2px;background:${attr(task?.pr?.dot)}`)} />
                        {show(task?.pr?.label)}
                      </span>
                    </span>
                    {' '}
                    <span style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                      }}>
                      <span style={inlineStyle(`font-size:12.5px;color:${attr(task?.dueColor)};font-weight:${attr(task?.dueWeight)}`)}>
                        {show(task?.dueCard)}
                      </span>
                      <span style={inlineStyle(`width:22px;height:22px;border-radius:50%;background:${attr(task?.own?.bg)};color:#fff;font-size:9px;font-weight:600;display:grid;place-items:center`)}>
                        {show(task?.own?.ini)}
                      </span>
                    </span>
                    {' '}
                  </button>
                  {' '}
                </Fragment>))}
                {' '}
                <button onClick={group?.add} style={{
                    border: '0',
                    background: 'transparent',
                    borderRadius: '8px',
                    padding: '8px 6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'oklch(0.52 0.012 265)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }} className="scp25">
                  {'+ Add task'}
                </button>
                {' '}
              </div>
              {' '}
            </Fragment>))}
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </>) : null}
      {' '}
      {vm.tk?.empty ? (<>
        <div style={{
            padding: '36px 16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
          }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>
            {'No tasks match these filters'}
          </span>
          <button onClick={vm.tk?.clear} style={{
              height: '32px',
              border: '1px solid oklch(0.88 0.008 85)',
              background: '#fff',
              borderRadius: '8px',
              padding: '0 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            {'Clear filters'}
          </button>
        </div>
      </>) : null}
      {' '}
      {vm.tk?.isList ? (<>
        <button onClick={vm.tk?.add} style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            border: '0',
            background: 'transparent',
            padding: '12px 18px',
            fontSize: '13.5px',
            fontWeight: '500',
            color: 'oklch(0.52 0.012 265)',
            cursor: 'pointer',
            textAlign: 'left',
            borderRadius: '0 0 12px 12px',
          }} className="scp26">
          <span>
            {'+ New task'}
          </span>
        </button>
      </>) : null}
      {' '}
    </div>
    {' '}
    <div style={{ fontSize: '12.5px', color: 'oklch(0.58 0.012 265)' }}>
      {'Tip: click any cell to change it. Tick the box when a task is finished. Press Enter after typing a name to add the next task.'}
    </div>
    {' '}
  </>);
}
