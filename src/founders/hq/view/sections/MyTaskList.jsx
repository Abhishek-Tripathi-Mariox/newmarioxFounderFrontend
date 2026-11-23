/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function MyTaskList({ vm }) {
  return (<>
    {' '}
    <div style={{ overflowX: 'auto' }}>
      {' '}
      <div style={{ minWidth: '960px' }}>
        {' '}
        <div style={inlineStyle(`display:grid;grid-template-columns:${attr(vm.tk?.gridCols)};align-items:center;gap:4px;padding:0 12px;font-size:12px;font-weight:500;color:oklch(0.55 0.012 265);height:36px`)}>
          <button onClick={vm.tk?.selAll} title="Select all shown" style={inlineStyle(`width:16px;height:16px;justify-self:center;border-radius:4px;border:1.5px solid ${attr(vm.tk?.allBd)};background:${attr(vm.tk?.allBg)};color:#fff;font-size:10px;line-height:1;cursor:pointer;padding:0`)}>
            {show(vm.tk?.allMark)}
          </button>
          <span />
          <span style={{ paddingLeft: '4px' }}>
            {'Task'}
          </span>
          {vm.tk?.cs?.status ? (<>
            <span style={{ paddingLeft: '6px' }}>
              {'Status'}
            </span>
          </>) : null}
          {vm.tk?.cs?.dept ? (<>
            <span style={{ paddingLeft: '6px' }}>
              {'Department'}
            </span>
          </>) : null}
          {vm.tk?.cs?.co ? (<>
            <span style={{ paddingLeft: '6px' }}>
              {'Company'}
            </span>
          </>) : null}
          {vm.tk?.cs?.team ? (<>
            <span style={{ paddingLeft: '6px' }}>
              {'Team'}
            </span>
          </>) : null}
          {vm.tk?.cs?.dates ? (<>
            <span style={{ paddingLeft: '6px' }}>
              {'Dates'}
            </span>
          </>) : null}
          {vm.tk?.cs?.pri ? (<>
            <span style={{ paddingLeft: '6px' }}>
              {'Priority'}
            </span>
          </>) : null}
          <span />
        </div>
        {' '}
        {asList(vm.tk?.groups).map((group, index) => (<Fragment key={index}>
          {' '}
          <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              background: 'oklch(0.975 0.004 85)',
              borderTop: '1px solid oklch(0.93 0.005 85)',
              borderBottom: '1px solid oklch(0.95 0.004 85)',
            }}>
            {' '}
            <button onClick={group?.toggle} title="Show or hide" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '0',
                background: 'none',
                cursor: 'pointer',
                padding: '4px',
                fontSize: '13.5px',
                fontWeight: '600',
                borderRadius: '6px',
              }} className="scp1e">
              <span style={{ fontSize: '10px', color: 'oklch(0.52 0.012 265)', width: '12px' }}>
                {show(group?.caret)}
              </span>
              <span style={inlineStyle(`width:9px;height:9px;border-radius:50%;background:${attr(group?.dot)}`)} />
              <span>
                {show(group?.label)}
              </span>
              <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)' }}>
                {show(group?.count)}
              </span>
            </button>
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
              {'+ Add task'}
            </button>
            {' '}
          </div>
          {' '}
          {group?.open ? (<>
            {' '}
            {asList(group?.rows).map((task, index) => (<Fragment key={index}>
              {' '}
              <div style={inlineStyle(`display:grid;grid-template-columns:${attr(task?.gridCols)};align-items:center;gap:4px;padding:0 12px;min-height:46px;border-bottom:1px solid oklch(0.955 0.004 85);background:${attr(task?.rowBg)};box-shadow:${attr(task?.rowEdge)}`)} className="scp1f">
                {' '}
                <button onClick={task?.selToggle} title="Select" style={inlineStyle(`width:16px;height:16px;justify-self:center;border-radius:4px;border:1.5px solid ${attr(task?.selBd)};background:${attr(task?.selBg)};color:#fff;font-size:10px;line-height:1;cursor:pointer;padding:0;opacity:${attr(task?.selOp)}`)} className="scp20">
                  {show(task?.selMark)}
                </button>
                {' '}
                <button onClick={task?.toggle} title={task?.checkTip} style={inlineStyle(`width:19px;height:19px;justify-self:center;border-radius:6px;border:1.5px solid ${attr(task?.checkBorder)};background:${attr(task?.checkBg)};color:#fff;font-size:11px;line-height:1;cursor:pointer;padding:0`)}>
                  {show(task?.mark)}
                </button>
                {' '}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minWidth: '0',
                    padding: '3px 0',
                  }}>
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: '0' }}>
                    <input data-tid={task?.id} value={inputValue(task?.title)} onChange={task?.onTitle} onKeyDown={task?.onKey} title={task?.titleOr} placeholder="Type a task name" style={inlineStyle(`flex:1;min-width:0;border:0;outline:none;background:transparent;font-size:14px;font-weight:500;padding:5px 4px;text-overflow:ellipsis;text-decoration:${attr(task?.deco)};color:${attr(task?.titleColor)}`)} />
                    <button onClick={task?.openTask} title="Open task page" style={{
                        width: '26px',
                        height: '26px',
                        flexShrink: '0',
                        border: '1px solid oklch(0.9 0.006 85)',
                        background: '#fff',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'oklch(0.45 0.012 265)',
                        opacity: '0.45',
                        padding: '0',
                      }} className="scp21">
                      <span style={{
                          width: '12px',
                          height: '10px',
                          border: '1.5px solid currentColor',
                          borderRadius: '2px',
                          borderRightWidth: '4.5px',
                          boxSizing: 'border-box',
                        }} />
                    </button>
                  </div>
                  {' '}
                  {task?.hasMeta ? (<>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexWrap: 'wrap',
                        padding: '0 4px 3px',
                      }}>
                      {task?.hasWait ? (<>
                        <span title="Waiting on this person" style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '1px 7px',
                            borderRadius: '5px',
                            background: 'oklch(0.95 0.05 80)',
                            color: 'oklch(0.45 0.1 65)',
                            whiteSpace: 'nowrap',
                          }}>
                          {show(task?.waitLabel)}
                        </span>
                      </>) : null}
                      {task?.hasRepeat ? (<>
                        <span title={task?.repeatLabel} style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '1px 7px',
                            borderRadius: '5px',
                            background: 'oklch(0.95 0.008 265)',
                            color: 'oklch(0.42 0.012 265)',
                            whiteSpace: 'nowrap',
                          }}>
                          {'↻ '}{show(task?.repeatShort)}
                        </span>
                      </>) : null}
                      {task?.hasGoal ? (<>
                        <span title={task?.goalLabel} style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '1px 7px',
                            borderRadius: '5px',
                            background: 'oklch(0.95 0.03 300)',
                            color: 'oklch(0.42 0.12 300)',
                            whiteSpace: 'nowrap',
                            maxWidth: '220px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                          {'◎ '}{show(task?.goalShort)}
                        </span>
                      </>) : null}
                      {task?.hasSub ? (<>
                        <span title="Sub-tasks done" style={{
                            fontSize: '11.5px',
                            fontWeight: '500',
                            color: 'oklch(0.52 0.012 265)',
                            whiteSpace: 'nowrap',
                          }}>
                          {'☑ '}{show(task?.subInfo)}
                        </span>
                      </>) : null}
                    </div>
                  </>) : null}
                  {' '}
                </div>
                {' '}
                {task?.cs?.status ? (<>
                  <button onClick={task?.st?.toggle} title="Change status" style={{
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
                    }}>
                    <span style={inlineStyle(`display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;padding:3px 8px 3px 9px;border-radius:7px;white-space:nowrap;background:${attr(task?.st?.tint)};color:${attr(task?.st?.ink)};border:1px solid ${attr(task?.st?.bd)}`)}>
                      <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(task?.st?.dot)}`)} />
                      {show(task?.st?.label)}
                      <span style={{ fontSize: '9px', opacity: '0.7' }}>
                        {'▼'}
                      </span>
                    </span>
                  </button>
                </>) : null}
                {' '}
                {task?.cs?.dept ? (<>
                  <button onClick={task?.dp?.toggle} title={task?.dp?.tip} style={{
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
                    }} className="scp22">
                    <span style={inlineStyle(`display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;background:${attr(task?.dp?.tint)};color:${attr(task?.dp?.ink)}`)}>
                      {show(task?.dp?.label)}
                      {task?.dp?.synced ? (<>
                        <span title="Visible in the company portal" style={{ fontSize: '10px' }}>
                          {'↗'}
                        </span>
                      </>) : null}
                    </span>
                  </button>
                </>) : null}
                {' '}
                {task?.cs?.co ? (<>
                  <button onClick={task?.co?.toggle} title="Change company" style={{
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
                    }} className="scp22">
                    <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(task?.co?.tint)};color:${attr(task?.co?.ink)}`)}>
                      {show(task?.co?.label)}
                    </span>
                  </button>
                </>) : null}
                {' '}
                {task?.cs?.team ? (<>
                  <button onClick={task?.own?.toggle} title="Change who's doing it" style={{
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
                    }} className="scp22">
                    <span style={inlineStyle(`width:22px;height:22px;border-radius:50%;background:${attr(task?.own?.bg)};color:#fff;font-size:9px;font-weight:600;display:grid;place-items:center;flex-shrink:0`)}>
                      {show(task?.own?.ini)}
                    </span>
                    <span style={{ fontSize: '13px' }}>
                      {show(task?.own?.label)}
                    </span>
                  </button>
                </>) : null}
                {' '}
                {task?.cs?.dates ? (<>
                  <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      minWidth: '0',
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                    }}>
                    {task?.showStart ? (<>
                      <label title="Start date" style={{
                          position: 'relative',
                          padding: '4px 5px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: 'oklch(0.42 0.012 265)',
                        }} className="scp23">
                        {show(task?.startText)}
                        <input type="date" value={inputValue(task?.start)} onChange={task?.onStart} onClick={task?.pick} style={{
                            position: 'absolute',
                            inset: '0',
                            opacity: '0',
                            cursor: 'pointer',
                            width: '100%',
                            border: '0',
                            padding: '0',
                          }} />
                      </label>
                      <span style={{ color: 'oklch(0.7 0.01 265)' }}>
                        {'→'}
                      </span>
                    </>) : null}
                    {task?.cs?.due ? (<>
                      <label title="Due date" style={inlineStyle(`position:relative;padding:4px 5px;border-radius:6px;cursor:pointer;color:${attr(task?.dueColor)};font-weight:${attr(task?.dueWeight)}`)} className="scp23">
                        {show(task?.dueShow)}
                        <input type="date" value={inputValue(task?.due)} onChange={task?.onDue} onClick={task?.pick} style={{
                            position: 'absolute',
                            inset: '0',
                            opacity: '0',
                            cursor: 'pointer',
                            width: '100%',
                            border: '0',
                            padding: '0',
                          }} />
                      </label>
                    </>) : null}
                  </div>
                </>) : null}
                {' '}
                {task?.cs?.pri ? (<>
                  <button onClick={task?.pr?.toggle} title="Change priority" style={{
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
                    }} className="scp22">
                    <span style={inlineStyle(`width:8px;height:8px;border-radius:2px;background:${attr(task?.pr?.dot)}`)} />
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>
                      {show(task?.pr?.label)}
                    </span>
                  </button>
                </>) : null}
                {' '}
                <button onClick={task?.actions} title="More actions: duplicate, move, delete" style={{
                    width: '30px',
                    height: '30px',
                    justifySelf: 'center',
                    border: '1px solid transparent',
                    background: 'none',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    color: 'oklch(0.5 0.012 265)',
                    fontSize: '17px',
                    lineHeight: '1',
                    padding: '0 0 6px',
                  }} className="scp24">
                  {'…'}
                </button>
                {' '}
              </div>
              {' '}
            </Fragment>))}
            {' '}
            {group?.empty ? (<>
              <div style={{
                  padding: '12px 52px',
                  fontSize: '13px',
                  color: 'oklch(0.62 0.01 265)',
                  borderBottom: '1px solid oklch(0.955 0.004 85)',
                }}>
                {'No tasks here.'}
              </div>
            </>) : null}
            {' '}
          </>) : null}
          {' '}
        </Fragment>))}
        {' '}
      </div>
      {' '}
    </div>
    {' '}
  </>);
}
