/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList } from '../rt';
import SyncMeeting from './SyncMeeting';

export default function FoundersSync({ vm }) {
  return (<>
    {' '}
    <div style={{
        display: 'flex',
        gap: '2px',
        padding: '3px',
        background: 'oklch(0.94 0.005 85)',
        borderRadius: '10px',
        width: 'fit-content',
        maxWidth: '100%',
        overflowX: 'auto',
      }}>
      {asList(vm.hub?.weekly).map((hubTab, index) => (<Fragment key={index}>
        <button onClick={hubTab?.go} style={inlineStyle(`display:flex;align-items:center;gap:7px;border:0;padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;background:${attr(hubTab?.bg)};color:${attr(hubTab?.fg)};box-shadow:${attr(hubTab?.sh)}`)}>
          {show(hubTab?.label)}
          {hubTab?.hasN ? (<>
            <span style={inlineStyle(`font-size:11px;font-weight:700;padding:1px 6px;border-radius:8px;background:${attr(hubTab?.nBg)};color:${attr(hubTab?.nFg)}`)}>
              {show(hubTab?.n)}
            </span>
          </>) : null}
        </button>
      </Fragment>))}
    </div>
    {' '}
    {vm.sy?.idle ? (<>
      {' '}
      <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
        <div>
          <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '600', letterSpacing: '-0.015em' }}>
            {'Founders\' sync'}
          </h1>
          <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
            {'A 50-minute weekly meeting for both founders. Everything you agree lands in Tasks and Decisions.'}
          </div>
        </div>
        <button onClick={vm.sy?.start} style={{
            height: '38px',
            border: '0',
            background: 'var(--acc, oklch(0.5 0.17 265))',
            color: '#fff',
            borderRadius: '8px',
            padding: '0 18px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
          {'▶ Start sync now'}
        </button>
      </div>
      {' '}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(118px,1fr))', gap: '10px' }}>
        {asList(vm.sy?.prep).map((prepItem, index) => (<Fragment key={index}>
          <button onClick={prepItem?.go} style={{
              background: '#fff',
              border: '1px solid oklch(0.915 0.006 85)',
              borderRadius: '12px',
              padding: '12px 14px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }} className="scp6">
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.5 0.012 265)' }}>
              {show(prepItem?.l)}
            </span>
            <span style={inlineStyle(`font-size:24px;font-weight:700;color:${attr(prepItem?.c)}`)}>
              {show(prepItem?.v)}
            </span>
          </button>
        </Fragment>))}
      </div>
      {' '}
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
          gap: '14px',
          alignItems: 'start',
        }}>
        {' '}
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
          <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid oklch(0.94 0.005 85)',
              fontSize: '15px',
              fontWeight: '600',
            }}>
            {'Agenda'}
          </div>
          {asList(vm.sy?.agenda).map((agendaStep, index) => (<Fragment key={index}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '28px minmax(0,1fr) 50px',
                gap: '10px',
                padding: '11px 18px',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
                alignItems: 'start',
              }}>
              <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'oklch(0.95 0.03 265)',
                  color: 'var(--acc, oklch(0.5 0.17 265))',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'grid',
                  placeItems: 'center',
                }}>
                {show(agendaStep?.n)}
              </span>
              <span>
                <span style={{ display: 'block', fontSize: '13.5px', fontWeight: '600' }}>
                  {show(agendaStep?.name)}
                </span>
                <span style={{
                    display: 'block',
                    fontSize: '12.5px',
                    color: 'oklch(0.5 0.012 265)',
                    lineHeight: '1.45',
                    marginTop: '2px',
                  }}>
                  {show(agendaStep?.desc)}
                </span>
              </span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.5 0.012 265)', textAlign: 'right' }}>
                {show(agendaStep?.min)}
              </span>
            </div>
          </Fragment>))}
        </div>
        {' '}
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
          <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid oklch(0.94 0.005 85)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>
              {'Past syncs'}
            </span>
            <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
              {show(vm.sy?.pastN)}
            </span>
          </div>
          {' '}
          {asList(vm.sy?.past).map((pastSync, index) => (<Fragment key={index}>
            <div style={{ borderBottom: '1px solid oklch(0.95 0.004 85)' }}>
              <button onClick={pastSync?.toggle} style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '0',
                  background: '#fff',
                  padding: '11px 18px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }} className="scp7">
                <span style={{ fontSize: '11px', color: 'oklch(0.55 0.012 265)', width: '10px' }}>
                  {show(pastSync?.caret)}
                </span>
                <span style={{ flex: '1', minWidth: '0' }}>
                  <span style={{ display: 'block', fontSize: '13.5px', fontWeight: '600' }}>
                    {show(pastSync?.date)}
                  </span>
                  <span style={{ display: 'block', fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                    {show(pastSync?.meta)}
                  </span>
                </span>
                <span style={inlineStyle(`font-size:13px;font-weight:700;color:${attr(pastSync?.rc)}`)}>
                  {show(pastSync?.rating)}
                </span>
              </button>
              {' '}
              {pastSync?.open ? (<>
                <div style={{
                    padding: '0 18px 14px 38px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: 'oklch(0.35 0.012 265)',
                  }}>
                  {asList(pastSync?.wins).map((win, index) => (<Fragment key={index}>
                    <div>
                      <span style={{ fontWeight: '600' }}>
                        {show(win?.who)}{':'}
                      </span>
                      {' '}{show(win?.text)}
                    </div>
                  </Fragment>))}
                  {asList(pastSync?.issues).map((issue, index) => (<Fragment key={index}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={inlineStyle(`color:${attr(issue?.c)};font-weight:700`)}>
                        {show(issue?.mark)}
                      </span>
                      <span>
                        {show(issue?.text)}
                      </span>
                    </div>
                  </Fragment>))}
                  {pastSync?.hasNotes ? (<>
                    <div style={{ whiteSpace: 'pre-wrap', color: 'oklch(0.45 0.012 265)' }}>
                      {show(pastSync?.notes)}
                    </div>
                  </>) : null}
                </div>
              </>) : null}
            </div>
          </Fragment>))}
          {' '}
          {vm.sy?.noPast ? (<>
            <div style={{ padding: '22px 18px', fontSize: '13.5px', color: 'oklch(0.5 0.012 265)' }}>
              {'No syncs yet. Your first one takes about 50 minutes.'}
            </div>
          </>) : null}
          {' '}
        </div>
        {' '}
      </div>
      {' '}
    </>) : null}
    {' '}
    {vm.sy?.live ? <SyncMeeting vm={vm} /> : null}
    {' '}
  </>);
}
