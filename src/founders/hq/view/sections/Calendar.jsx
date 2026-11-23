/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import TaskModalHost from '../../teamTasks/TaskModalHost';
import { show, attr, inlineStyle, asList } from '../rt';
import TeamMark from './TeamMark';

/** Marks a founder task (My tasks) among team tasks: "Me" on month chips, "My task" in the day list. */
function MineTag({ compact = false }) {
  return (
    <span style={{ flexShrink: 0, fontSize: compact ? '9.5px' : '11px', fontWeight: '700', letterSpacing: '0.02em', padding: compact ? '0 4px' : '1px 6px', borderRadius: '4px', background: 'oklch(0.3 0.015 265)', color: '#fff' }}>
      {compact ? 'Me' : 'My task'}
    </span>
  );
}

export default function Calendar({ vm }) {
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
          {'Calendar'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {show(vm.cal?.sub)}
        </div>
      </div>
      {' '}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {' '}
        <div style={{
            display: 'flex',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '9px',
            overflow: 'hidden',
            background: '#fff',
          }}>
          {' '}
          <button onClick={vm.cal?.prev} title="Previous month" style={{
              width: '36px',
              height: '36px',
              border: '0',
              background: 'none',
              cursor: 'pointer',
              fontSize: '16px',
            }} className="scp10">
            {'‹'}
          </button>
          {' '}
          <button onClick={vm.cal?.today} style={{
              height: '36px',
              border: '0',
              borderLeft: '1px solid oklch(0.92 0.005 85)',
              borderRight: '1px solid oklch(0.92 0.005 85)',
              background: 'none',
              padding: '0 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }} className="scp10">
            {'Today'}
          </button>
          {' '}
          <button onClick={vm.cal?.next} title="Next month" style={{
              width: '36px',
              height: '36px',
              border: '0',
              background: 'none',
              cursor: 'pointer',
              fontSize: '16px',
            }} className="scp10">
            {'›'}
          </button>
          {' '}
        </div>
        {' '}
        <button onClick={vm.cal?.newMyTask} title="Your own founder task, due on the selected day" style={{
            height: '38px',
            border: '1px solid oklch(0.88 0.008 85)',
            background: '#fff',
            color: 'oklch(0.23 0.015 265)',
            borderRadius: '9px',
            padding: '0 16px',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer',
          }} className="scp10">
          {'+ My task'}
        </button>
        {' '}
        <button onClick={vm.cal?.newTask} title="A task for your team, due on the selected day" style={{
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
          {'+ Team task'}
        </button>
        {' '}
      </div>
      {' '}
    </div>
    {' '}
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px 16px', flexWrap: 'wrap', borderBottom: '1px solid oklch(0.92 0.005 85)' }}>
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {' '}
      {asList(vm.cal?.coTabs).map((tab, index) => (<Fragment key={index}>
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
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingBottom: '6px' }}>
      <div role="group" aria-label="Show tasks" style={{ display: 'inline-flex', gap: '2px', padding: '3px', borderRadius: '9px', background: 'oklch(0.945 0.005 85)' }}>
        {asList(vm.cal?.kindTabs).map((tab, index) => (
          <button key={index} type="button" onClick={tab?.go} title={tab?.tip} style={inlineStyle(`display:flex;align-items:center;gap:6px;height:28px;border:0;border-radius:7px;padding:0 10px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(tab?.bg)};color:${attr(tab?.fg)};box-shadow:${attr(tab?.sh)}`)}>
            <span>{show(tab?.label)}</span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'oklch(0.52 0.012 265)' }}>{show(tab?.n)}</span>
          </button>
        ))}
      </div>
      {asList(vm.cal?.pills).map((pill, index) => (
        <span key={index} title={pill?.tip} style={inlineStyle(`display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 10px;border-radius:999px;font-size:12.5px;font-weight:600;background:${attr(pill?.bg)};color:${attr(pill?.fg)}`)}>
          {show(pill?.label)} {show(pill?.v)}
        </span>
      ))}
    </div>
      {' '}
    </div>
    {' '}
    <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {' '}
      <div style={{
          flex: '3 1 640px',
          minWidth: '0',
          background: '#fff',
          border: '1px solid oklch(0.92 0.005 85)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
        {' '}
        <div style={{
            padding: '10px 14px',
            fontSize: '15px',
            fontWeight: '600',
            borderBottom: '1px solid oklch(0.92 0.005 85)',
          }}>
          {show(vm.cal?.month)}
        </div>
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
            background: 'oklch(0.985 0.003 85)',
            borderBottom: '1px solid oklch(0.92 0.005 85)',
          }}>
          {' '}
          {asList(vm.cal?.wd).map((weekday, index) => (<Fragment key={index}>
            <div style={{
                padding: '8px 10px',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'oklch(0.52 0.012 265)',
              }}>
              {show(weekday)}
            </div>
          </Fragment>))}
          {' '}
        </div>
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
            gap: '1px',
            background: 'oklch(0.93 0.005 85)',
          }}>
          {' '}
          {asList(vm.cal?.days).map((day, index) => (<Fragment key={index}>
            {' '}
            <div onClick={day?.pick} style={inlineStyle(`min-height:clamp(64px, calc((100vh - 400px) / ${vm.cal?.weeks || 6}), 112px);background:${attr(day?.bg)};box-shadow:${attr(day?.ring)};padding:6px;display:flex;flex-direction:column;gap:3px;cursor:pointer;min-width:0`)}>
              {' '}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={inlineStyle(`width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12.5px;font-weight:600;background:${attr(day?.numBg)};color:${attr(day?.numFg)}`)}>
                  {show(day?.n)}
                </span>
                {day?.hasOver ? (<>
                  <span title={day?.overTip} style={{
                      fontSize: '10.5px',
                      fontWeight: '700',
                      color: 'oklch(0.55 0.19 25)',
                      paddingRight: '4px',
                    }}>
                    {show(day?.over)}
                  </span>
                </>) : null}
              </div>
              {' '}
              {asList(day?.chips).map((chip, index) => (<Fragment key={index}>
                <button onClick={chip?.open} title={chip?.title} style={inlineStyle(`display:flex;align-items:center;gap:5px;border:0;border-radius:5px;padding:3px 6px;background:${attr(chip?.bg)};color:${attr(chip?.fg)};font-size:11.5px;font-weight:500;cursor:pointer;text-align:left;min-width:0`)}>
                  <span style={inlineStyle(`width:6px;height:6px;border-radius:50%;flex-shrink:0;background:${attr(chip?.dot)}`)} />
                  <TeamMark item={chip} compact />
                  {chip?.mine ? <MineTag compact /> : null}
                  <span style={inlineStyle(`overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-decoration:${attr(chip?.deco)}`)}>
                    {show(chip?.label)}
                  </span>
                </button>
              </Fragment>))}
              {' '}
              {day?.hasMore ? (<>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'oklch(0.52 0.012 265)', padding: '0 6px' }}>
                  {show(day?.more)}
                </span>
              </>) : null}
              {' '}
            </div>
            {' '}
          </Fragment>))}
          {' '}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{
          flex: '1 1 280px',
          minWidth: '0',
          background: '#fff',
          border: '1px solid oklch(0.92 0.005 85)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: '16px',
        }}>
        {' '}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid oklch(0.92 0.005 85)' }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            {show(vm.cal?.selLabel)}
          </div>
          <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
            {show(vm.cal?.selCount)}
          </div>
        </div>
        {' '}
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '6px 0' }}>
          {' '}
          {asList(vm.cal?.selTasks).map((task, index) => (<Fragment key={index}>
            {' '}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 16px' }} className="scp7">
              {' '}
              <button onClick={task?.toggle} title={task?.checkTip} style={inlineStyle(`width:18px;height:18px;flex-shrink:0;margin-top:1px;border-radius:5px;border:1.5px solid ${attr(task?.checkBd)};background:${attr(task?.checkBg)};color:#fff;font-size:11px;font-weight:700;display:grid;place-items:center;cursor:pointer;padding:0`)}>
                {show(task?.mark)}
              </button>
              {' '}
              <button onClick={task?.open} style={{
                  flex: '1',
                  minWidth: '0',
                  border: '0',
                  background: 'none',
                  padding: '0',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '0' }}>
                  <span style={inlineStyle(`font-size:13.5px;font-weight:500;text-decoration:${attr(task?.deco)};color:${attr(task?.fg)}`)}>
                    {show(task?.title)}
                  </span>
                  <TeamMark item={task} />
                  {task?.mine ? <MineTag /> : null}
                </span>
                <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                  {show(task?.meta)}
                </span>
              </button>
              {' '}
            </div>
            {' '}
          </Fragment>))}
          {' '}
          {vm.cal?.selEmpty ? (<>
            <div style={{ padding: '18px 16px', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
              {'Nothing due on this day.'}
            </div>
          </>) : null}
          {' '}
        </div>
        {' '}
      </div>
      {' '}
    </div>
    {' '}
    <TaskModalHost />
  </>);
}
