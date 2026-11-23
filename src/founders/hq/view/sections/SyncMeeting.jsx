/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function SyncMeeting({ vm }) {
  return (<>
    {' '}
    <div style={{
        background: 'oklch(0.24 0.035 265)',
        color: '#fff',
        borderRadius: '14px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
      {' '}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <span style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            background: 'oklch(0.7 0.2 25)',
            boxShadow: '0 0 0 4px oklch(0.7 0.2 25 / 0.25)',
          }} />
        <span style={{ fontSize: '15px', fontWeight: '600' }}>
          {'Founders\' sync · '}{show(vm.sy?.date)}
        </span>
        <span style={{ flex: '1' }} />
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '10.5px', letterSpacing: '0.08em', color: 'oklch(0.78 0.03 265)' }}>
            {'THIS STEP · '}{show(vm.sy?.stepMin)}{' MIN'}
          </span>
          {show(vm.sy?.stepClock)}
        </span>
        <span style={{ width: '1px', height: '32px', background: 'oklch(1 0 0 / 0.15)' }} />
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '10.5px', letterSpacing: '0.08em', color: 'oklch(0.78 0.03 265)' }}>
            {'TOTAL'}
          </span>
          {show(vm.sy?.clock)}
        </span>
        <button onClick={vm.sy?.cancel} style={{
            height: '30px',
            border: '1px solid oklch(1 0 0 / 0.25)',
            background: 'none',
            color: '#fff',
            borderRadius: '7px',
            padding: '0 10px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
          {'Discard'}
        </button>
      </div>
      {' '}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
        {asList(vm.sy?.steps).map((step, index) => (<Fragment key={index}>
          <button onClick={step?.go} style={inlineStyle(`flex:1 0 auto;min-width:96px;border:0;background:${attr(step?.bg)};color:${attr(step?.fg)};border-radius:8px;padding:8px 10px;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:2px`)}>
            <span style={{ fontSize: '11px', fontWeight: '700', opacity: '0.8' }}>
              {show(step?.mark)}{' '}{show(step?.min)}{' min'}
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: '600', whiteSpace: 'nowrap' }}>
              {show(step?.name)}
            </span>
          </button>
        </Fragment>))}
      </div>
      {' '}
    </div>
    {' '}
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
      {' '}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid oklch(0.94 0.005 85)' }}>
        <div style={{
            fontSize: '11.5px',
            fontWeight: '700',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--acc, oklch(0.5 0.17 265))',
          }}>
          {'Step '}{show(vm.sy?.stepN)}{' of 7'}
        </div>
        <div style={{ fontSize: '20px', fontWeight: '600', marginTop: '2px' }}>
          {show(vm.sy?.stepName)}
        </div>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.5 0.012 265)', marginTop: '3px' }}>
          {show(vm.sy?.stepDesc)}
        </div>
      </div>
      {' '}
      {vm.sy?.s1 ? (<>
        <div style={{
            padding: '18px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
            gap: '14px',
          }}>
          {asList(vm.sy?.wins).map((win, index) => (<Fragment key={index}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={inlineStyle(`width:28px;height:28px;border-radius:50%;background:${attr(win?.bg)};color:#fff;font-size:11px;font-weight:700;display:grid;place-items:center`)}>
                  {show(win?.ini)}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  {show(win?.name)}
                </span>
              </span>
              <textarea value={inputValue(win?.v)} onChange={win?.on} placeholder="One personal win, one business win" style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  fieldSizing: 'content',
                  minHeight: '90px',
                  boxSizing: 'border-box',
                }} />
            </label>
          </Fragment>))}
        </div>
      </>) : null}
      {' '}
      {vm.sy?.s2 ? (<>
        <div>
          {asList(vm.sy?.offTrack).map((metric, index) => (<Fragment key={index}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
                fontSize: '13.5px',
                flexWrap: 'wrap',
              }}>
              <span style={inlineStyle(`width:20px;height:20px;border-radius:5px;background:${attr(metric?.bg)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center`)}>
                {show(metric?.ini)}
              </span>
              <span style={{ flex: '1', minWidth: '160px', fontWeight: '600' }}>
                {show(metric?.name)}
              </span>
              <span style={{ color: 'oklch(0.48 0.17 25)', fontWeight: '700' }}>
                {show(metric?.v)}
              </span>
              <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
                {'goal '}{show(metric?.goal)}
              </span>
              <button onClick={metric?.issue} style={{
                  height: '28px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 9px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.35 0.012 265)',
                  whiteSpace: 'nowrap',
                }}>
                {show(metric?.issueLbl)}
              </button>
            </div>
          </Fragment>))}
          {vm.sy?.noOff ? (<>
            <div style={{ padding: '22px 20px', fontSize: '13.5px', color: 'oklch(0.45 0.11 150)', fontWeight: '600' }}>
              {show(vm.sy?.offEmpty)}
            </div>
          </>) : null}
          <div style={{ padding: '12px 20px' }}>
            <button onClick={vm.sy?.goScore} style={{
                height: '28px',
                border: '1px solid oklch(0.9 0.006 85)',
                background: '#fff',
                borderRadius: '7px',
                padding: '0 9px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'oklch(0.35 0.012 265)',
                whiteSpace: 'nowrap',
              }}>
              {'Open Scorecard'}
            </button>
          </div>
        </div>
      </>) : null}
      {' '}
      {vm.sy?.s3 ? (<>
        <div>
          {asList(vm.sy?.goals).map((goal, index) => (<Fragment key={index}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
                fontSize: '13.5px',
                flexWrap: 'wrap',
              }}>
              <span style={inlineStyle(`font-size:11px;font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(goal?.cBg)};color:${attr(goal?.cFg)}`)}>
                {show(goal?.co)}
              </span>
              <span style={{ flex: '1', minWidth: '160px', fontWeight: '600' }}>
                {show(goal?.title)}
              </span>
              <span style={inlineStyle(`font-size:12.5px;font-weight:700;color:${attr(goal?.sc)}`)}>
                {show(goal?.status)}
              </span>
              <button onClick={goal?.issue} style={{
                  height: '28px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 9px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.35 0.012 265)',
                  whiteSpace: 'nowrap',
                }}>
                {show(goal?.issueLbl)}
              </button>
            </div>
          </Fragment>))}
          {vm.sy?.noGoals ? (<>
            <div style={{ padding: '22px 20px', fontSize: '13.5px', color: 'oklch(0.45 0.11 150)', fontWeight: '600' }}>
              {'Every goal is on track.'}
            </div>
          </>) : null}
        </div>
      </>) : null}
      {' '}
      {vm.sy?.s4 ? (<>
        <div>
          {asList(vm.sy?.tasks).map((task, index) => (<Fragment key={index}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
                fontSize: '13.5px',
                flexWrap: 'wrap',
              }}>
              <span style={inlineStyle(`font-size:11px;font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(task?.cBg)};color:${attr(task?.cFg)}`)}>
                {show(task?.co)}
              </span>
              <span style={{ flex: '1', minWidth: '160px', fontWeight: '600' }}>
                {show(task?.title)}
              </span>
              <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
                {show(task?.owner)}
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'oklch(0.52 0.19 25)' }}>
                {show(task?.late)}
              </span>
              <button onClick={task?.done} style={{
                  height: '28px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 9px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.35 0.012 265)',
                  whiteSpace: 'nowrap',
                }}>
                {'✓ Done'}
              </button>
              <button onClick={task?.push} style={{
                  height: '28px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 9px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.35 0.012 265)',
                  whiteSpace: 'nowrap',
                }}>
                {'+1 week'}
              </button>
              <button onClick={task?.issue} style={{
                  height: '28px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 9px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.35 0.012 265)',
                  whiteSpace: 'nowrap',
                }}>
                {show(task?.issueLbl)}
              </button>
            </div>
          </Fragment>))}
          {vm.sy?.noTasks ? (<>
            <div style={{ padding: '22px 20px', fontSize: '13.5px', color: 'oklch(0.45 0.11 150)', fontWeight: '600' }}>
              {'Nothing is overdue.'}
            </div>
          </>) : null}
        </div>
      </>) : null}
      {' '}
      {vm.sy?.s5 ? (<>
        <div>
          {asList(vm.sy?.decs).map((decision, index) => (<Fragment key={index}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
                fontSize: '13.5px',
                flexWrap: 'wrap',
              }}>
              <span style={inlineStyle(`font-size:11px;font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(decision?.cBg)};color:${attr(decision?.cFg)}`)}>
                {show(decision?.co)}
              </span>
              <span style={{ flex: '1', minWidth: '160px', fontWeight: '600' }}>
                {show(decision?.title)}
              </span>
              <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
                {show(decision?.age)}
              </span>
              <button onClick={decision?.open} style={{
                  height: '28px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 9px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.35 0.012 265)',
                  whiteSpace: 'nowrap',
                }}>
                {'Open'}
              </button>
              <button onClick={decision?.issue} style={{
                  height: '28px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 9px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.35 0.012 265)',
                  whiteSpace: 'nowrap',
                }}>
                {show(decision?.issueLbl)}
              </button>
            </div>
          </Fragment>))}
          {vm.sy?.noDecs ? (<>
            <div style={{ padding: '16px 20px', fontSize: '13.5px', color: 'oklch(0.5 0.012 265)' }}>
              {'No open decisions.'}
            </div>
          </>) : null}
          <div style={{
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              background: 'oklch(0.975 0.004 85)',
            }}>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              {'Constitution'}
            </span>
            <span style={{ flex: '1', fontSize: '13px', color: 'oklch(0.42 0.012 265)' }}>
              {show(vm.sy?.consTxt)}
            </span>
            <button onClick={vm.sy?.goCons} style={{
                height: '28px',
                border: '1px solid oklch(0.9 0.006 85)',
                background: '#fff',
                borderRadius: '7px',
                padding: '0 9px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'oklch(0.35 0.012 265)',
                whiteSpace: 'nowrap',
              }}>
              {'Open Constitution'}
            </button>
          </div>
        </div>
      </>) : null}
      {' '}
      {vm.sy?.s6 ? (<>
        <div>
          {' '}
          <div style={{
              padding: '14px 20px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              borderBottom: '1px solid oklch(0.94 0.005 85)',
            }}>
            <input value={inputValue(vm.sy?.newIssue)} onChange={vm.sy?.onNewIssue} onKeyDown={vm.sy?.onIssueKey} placeholder="Add an issue and press Enter" style={{
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
                flex: '1 1 260px',
              }} />
            <select value={inputValue(vm.sy?.issueCo?.value)} onChange={vm.sy?.issueCo?.onChange} style={{
                height: '34px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                background: '#fff',
                fontSize: '12px',
                padding: '0 4px',
                fontFamily: 'inherit',
                cursor: 'pointer',
                minWidth: '0',
                maxWidth: '100%',
              }}>
              {asList(vm.sy?.issueCo?.opts).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
            <button onClick={vm.sy?.addIssue} style={{
                height: '34px',
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
          {' '}
          {asList(vm.sy?.issues).map((issue, index) => (<Fragment key={index}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
                fontSize: '13.5px',
                flexWrap: 'wrap',
              }}>
              <button onClick={issue?.toggle} style={inlineStyle(`width:20px;height:20px;border-radius:5px;border:1.5px solid ${attr(issue?.cbd)};background:${attr(issue?.cbg)};color:#fff;font-size:11px;cursor:pointer;padding:0`)}>
                {show(issue?.mark)}
              </button>
              <span style={inlineStyle(`font-size:11px;font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(issue?.cBg)};color:${attr(issue?.cFg)}`)}>
                {show(issue?.co)}
              </span>
              <span style={inlineStyle(`flex:1;min-width:180px;font-weight:600;text-decoration:${attr(issue?.deco)};color:${attr(issue?.col)}`)}>
                {show(issue?.text)}
                {issue?.hasFrom ? (<>
                  <span style={{ fontWeight: '500', fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
                    {' · '}{show(issue?.from)}
                  </span>
                </>) : null}
              </span>
              {issue?.hasOut ? (<>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.45 0.12 150)' }}>
                  {show(issue?.out)}
                </span>
              </>) : null}
              {issue?.canAct ? (<>
                {(issue?.taskFor || []).map((task) => (
                <button key={task.label} onClick={task.go} style={{
                    height: '28px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    background: '#fff',
                    borderRadius: '7px',
                    padding: '0 9px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: 'oklch(0.35 0.012 265)',
                    whiteSpace: 'nowrap',
                  }}>
                  {task.label}
                </button>
                ))}
                <button onClick={issue?.dec} style={{
                    height: '28px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    background: '#fff',
                    borderRadius: '7px',
                    padding: '0 9px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: 'oklch(0.35 0.012 265)',
                    whiteSpace: 'nowrap',
                  }}>
                  {'→ Decision'}
                </button>
              </>) : null}
              <button onClick={issue?.remove} title="Remove" style={{
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
          {' '}
          {vm.sy?.noIssues ? (<>
            <div style={{ padding: '22px 20px', fontSize: '13.5px', color: 'oklch(0.5 0.012 265)' }}>
              {'No issues yet. Add them here or with “Add as issue” in the earlier steps.'}
            </div>
          </>) : null}
          {' '}
        </div>
      </>) : null}
      {' '}
      {vm.sy?.s7 ? (<>
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(118px,1fr))', gap: '10px' }}>
            {asList(vm.sy?.sum).map((summaryItem, index) => (<Fragment key={index}>
              <div style={{ borderRadius: '10px', background: 'oklch(0.975 0.004 85)', padding: '12px 14px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.5 0.012 265)' }}>
                  {show(summaryItem?.l)}
                </div>
                <div style={{ fontSize: '22px', fontWeight: '700' }}>
                  {show(summaryItem?.v)}
                </div>
              </div>
            </Fragment>))}
          </div>
          {' '}
          {asList(vm.sy?.newTasks).map((newTask, index) => (<Fragment key={index}>
            <div style={{ display: 'flex', gap: '10px', fontSize: '13.5px' }}>
              <span style={{ color: 'oklch(0.5 0.13 150)', fontWeight: '700' }}>
                {'✓'}
              </span>
              <span style={{ flex: '1' }}>
                {show(newTask?.title)}
              </span>
              <span style={{ color: 'oklch(0.52 0.012 265)' }}>
                {show(newTask?.meta)}
              </span>
            </div>
          </Fragment>))}
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
              {'Rate this meeting, 1 to 10'}
            </span>
            {asList(vm.sy?.rates).map((founderRating, index) => (<Fragment key={index}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ width: '60px', fontSize: '13px', fontWeight: '600' }}>
                  {show(founderRating?.name)}
                </span>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {asList(founderRating?.opts).map((ratingOption, index) => (<Fragment key={index}>
                    <button onClick={ratingOption?.go} style={inlineStyle(`width:32px;height:32px;border-radius:8px;border:1px solid ${attr(ratingOption?.bd)};background:${attr(ratingOption?.bg)};color:${attr(ratingOption?.fg)};font-size:13px;font-weight:700;cursor:pointer`)}>
                      {show(ratingOption?.n)}
                    </button>
                  </Fragment>))}
                </div>
              </div>
            </Fragment>))}
          </div>
          {' '}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
              {'Notes'}
            </span>
            <textarea value={inputValue(vm.sy?.notes)} onChange={vm.sy?.onNotes} placeholder="Anything else to remember from this sync" style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '13.5px',
                lineHeight: '1.5',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                fieldSizing: 'content',
                minHeight: '60px',
                boxSizing: 'border-box',
              }} />
          </label>
          {' '}
          <div>
            <button onClick={vm.sy?.end} style={{
                height: '38px',
                border: '0',
                background: 'oklch(0.52 0.13 150)',
                color: '#fff',
                borderRadius: '8px',
                padding: '0 18px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
              {'End and save sync'}
            </button>
          </div>
          {' '}
        </div>
      </>) : null}
      {' '}
      <div style={{
          padding: '12px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          display: 'flex',
          gap: '8px',
          justifyContent: 'space-between',
        }}>
        {vm.sy?.hasPrev ? (<>
          <button onClick={vm.sy?.prev} style={{
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
            {'← '}{show(vm.sy?.prevName)}
          </button>
        </>) : null}
        <span style={{ flex: '1' }} />
        {vm.sy?.hasNext ? (<>
          <button onClick={vm.sy?.next} style={{
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
            {show(vm.sy?.nextName)}{' →'}
          </button>
        </>) : null}
      </div>
      {' '}
    </div>
    {' '}
  </>);
}
