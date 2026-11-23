/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function RolePanel({ vm }) {
  return (<>
    {' '}
    <div onClick={vm.pk?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.25)', zIndex: '38' }} />
    {' '}
    <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        width: 'min(820px,100%)',
        background: '#fff',
        zIndex: '39',
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
          flexWrap: 'wrap',
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
            {'Hiring'}
          </span>
          <span>
            {'/'}
          </span>
          <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(vm.pk?.coTint)};color:${attr(vm.pk?.coInk)}`)}>
            {show(vm.pk?.coName)}
          </span>
        </div>
        {' '}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {' '}
          <div style={{ display: 'flex', gap: '2px', marginRight: '4px' }}>
            <button onClick={vm.pk?.prev} disabled={vm.pk?.noPrev} title="Previous role" style={inlineStyle(`width:30px;height:30px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:7px;cursor:pointer;font-size:12px;opacity:${attr(vm.pk?.prevOp)}`)}>
              {'↑'}
            </button>
            <button onClick={vm.pk?.next} disabled={vm.pk?.noNext} title="Next role" style={inlineStyle(`width:30px;height:30px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:7px;cursor:pointer;font-size:12px;opacity:${attr(vm.pk?.nextOp)}`)}>
              {'↓'}
            </button>
          </div>
          {' '}
          {vm.pk?.notHired ? (<>
            <button onClick={vm.pk?.advance} style={{
                height: '30px',
                border: '0',
                background: 'var(--acc, oklch(0.5 0.17 265))',
                color: '#fff',
                borderRadius: '7px',
                padding: '0 12px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {show(vm.pk?.nextLabel)}
            </button>
          </>) : null}
          {' '}
          {vm.pk?.isHired ? (<>
            <button onClick={vm.pk?.reopen} style={{
                height: '30px',
                border: '1px solid oklch(0.9 0.006 85)',
                background: '#fff',
                borderRadius: '7px',
                padding: '0 11px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'oklch(0.35 0.012 265)',
              }}>
              {'↺ Reopen'}
            </button>
          </>) : null}
          {' '}
          <button onClick={vm.pk?.copyJD} title="Copy as a job post" style={{
              height: '30px',
              border: '1px solid oklch(0.9 0.006 85)',
              background: '#fff',
              borderRadius: '7px',
              padding: '0 11px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.35 0.012 265)',
            }}>
            {'Copy job post'}
          </button>
          {' '}
          <button onClick={vm.pk?.dup} style={{
              height: '30px',
              border: '1px solid oklch(0.9 0.006 85)',
              background: '#fff',
              borderRadius: '7px',
              padding: '0 11px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.35 0.012 265)',
            }}>
            {'Duplicate'}
          </button>
          {' '}
          <button onClick={vm.pk?.remove} title="Delete (you can undo)" style={{
              height: '30px',
              border: '1px solid oklch(0.88 0.05 25)',
              background: 'oklch(0.98 0.012 25)',
              color: 'oklch(0.5 0.18 25)',
              borderRadius: '7px',
              padding: '0 11px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            {'Delete'}
          </button>
          {' '}
          <div style={{ width: '1px', height: '20px', background: 'oklch(0.9 0.006 85)', margin: '0 2px' }} />
          {' '}
          <button onClick={vm.pk?.close} style={{
              height: '30px',
              border: '1px solid oklch(0.9 0.006 85)',
              background: '#fff',
              borderRadius: '7px',
              padding: '0 11px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.35 0.012 265)',
            }}>
            {'Close'}
          </button>
          {' '}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{ flex: '1', overflowY: 'auto' }}>
        {' '}
        <div style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '30px 32px 80px',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
          }}>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {' '}
            <span style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                padding: '3px 9px',
                borderRadius: '7px',
                background: 'oklch(0.96 0.004 265)',
              }}>
              <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(vm.pk?.stDot)}`)} />
              {show(vm.pk?.stage)}
            </span>
            {' '}
            <input data-peek-title="1" value={inputValue(vm.pk?.role)} onChange={vm.pk?.onRole} placeholder="Role title, e.g. Senior React developer" style={{
                border: '0',
                outline: 'none',
                fontSize: '28px',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                padding: '0',
                width: '100%',
                background: 'transparent',
              }} />
            {' '}
          </div>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: '130px minmax(0,1fr)', gap: '4px 10px' }}>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Stage'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.pk?.stageSeg).map((stageOption, index) => (<Fragment key={index}>
                  <button onClick={stageOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(stageOption?.bg)};color:${attr(stageOption?.fg)};box-shadow:${attr(stageOption?.sh)}`)}>
                    {show(stageOption?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Company'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.pk?.coSeg).map((companyOption, index) => (<Fragment key={index}>
                  <button onClick={companyOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(companyOption?.bg)};color:${attr(companyOption?.fg)};box-shadow:${attr(companyOption?.sh)}`)}>
                    {show(companyOption?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Hiring manager'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.pk?.ownerSeg).map((ownerOption, index) => (<Fragment key={index}>
                  <button onClick={ownerOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(ownerOption?.bg)};color:${attr(ownerOption?.fg)};box-shadow:${attr(ownerOption?.sh)}`)}>
                    {show(ownerOption?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Priority'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.pk?.priSeg).map((priorityOption, index) => (<Fragment key={index}>
                  <button onClick={priorityOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(priorityOption?.bg)};color:${attr(priorityOption?.fg)};box-shadow:${attr(priorityOption?.sh)}`)}>
                    {show(priorityOption?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Type'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.pk?.typeSeg).map((typeOption, index) => (<Fragment key={index}>
                  <button onClick={typeOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(typeOption?.bg)};color:${attr(typeOption?.fg)};box-shadow:${attr(typeOption?.sh)}`)}>
                    {show(typeOption?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Location'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.pk?.locSeg).map((locationOption, index) => (<Fragment key={index}>
                  <button onClick={locationOption?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(locationOption?.bg)};color:${attr(locationOption?.fg)};box-shadow:${attr(locationOption?.sh)}`)}>
                    {show(locationOption?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Openings'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <input type="number" min="1" value={inputValue(vm.pk?.heads)} onChange={vm.pk?.onHeads} style={{
                  height: '32px',
                  padding: '0 10px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '7px',
                  fontSize: '13.5px',
                  outline: 'none',
                  minWidth: '0',
                  background: '#fff',
                  width: '80px',
                }} />
              <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
                {show(vm.pk?.headsInfo)}
              </span>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Budget / month (₹)'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <input type="number" value={inputValue(vm.pk?.budget)} onChange={vm.pk?.onBudget} placeholder="Monthly CTC" style={{
                  height: '32px',
                  padding: '0 10px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '7px',
                  fontSize: '13.5px',
                  outline: 'none',
                  minWidth: '0',
                  background: '#fff',
                  width: '160px',
                }} />
              <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
                {show(vm.pk?.budgetInfo)}
              </span>
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Join by'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              <input type="date" value={inputValue(vm.pk?.due)} onChange={vm.pk?.onDue} style={inlineStyle(`height:32px;padding:0 10px;border:1px solid oklch(0.9 0.006 85);border-radius:7px;font-size:13.5px;outline:none;min-width:0;background:#fff;font-family:inherit;color:${attr(vm.pk?.dueColor)}`)} />
              {vm.pk?.hasLate ? (<>
                <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'oklch(0.52 0.19 25)' }}>
                  {show(vm.pk?.lateHint)}
                </span>
              </>) : null}
            </div>
            {' '}
            <span style={{
                fontSize: '13px',
                color: 'oklch(0.52 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
              }}>
              {'Where to find'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', minHeight: '36px' }}>
              {asList(vm.pk?.sources).map((source, index) => (<Fragment key={index}>
                <button onClick={source?.go} style={inlineStyle(`height:28px;border:1px solid ${attr(source?.bd)};background:${attr(source?.bg)};color:${attr(source?.fg)};border-radius:14px;padding:0 11px;font-size:12.5px;font-weight:600;cursor:pointer`)}>
                  {show(source?.mark)}{show(source?.label)}
                </button>
              </Fragment>))}
            </div>
            {' '}
          </div>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'oklch(0.52 0.012 265)',
              }}>
              {'About the role'}
            </span>
            <textarea value={inputValue(vm.pk?.summary)} onChange={vm.pk?.onSummary} placeholder="What will this person do? Who do they report to? What does success look like in 90 days?" style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '1.55',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                color: 'oklch(0.23 0.015 265)',
                fieldSizing: 'content',
                minHeight: '72px',
              }} />
          </div>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'oklch(0.52 0.012 265)',
              }}>
              {'Skills'}
            </span>
            {' '}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input value={inputValue(vm.pk?.skDraft)} onChange={vm.pk?.onSk} onKeyDown={vm.pk?.onSkKey} placeholder="Type a skill, e.g. React, 3+ years" style={{
                  height: '32px',
                  padding: '0 10px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '7px',
                  fontSize: '13.5px',
                  outline: 'none',
                  minWidth: '0',
                  background: '#fff',
                  flex: '1 1 220px',
                }} />
              <button onClick={vm.pk?.addMust} style={{
                  height: '32px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 11px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.35 0.012 265)',
                }}>
                {'+ Must have'}
              </button>
              <button onClick={vm.pk?.addNice} style={{
                  height: '32px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 11px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.35 0.012 265)',
                }}>
                {'+ Nice to have'}
              </button>
            </div>
            {' '}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '10px' }}>
              {' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '600' }}>
                  {'Must have'}
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {asList(vm.pk?.must).map((mustHave, index) => (<Fragment key={index}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        height: '28px',
                        padding: '0 4px 0 11px',
                        borderRadius: '14px',
                        background: 'oklch(0.94 0.04 150)',
                        color: 'oklch(0.35 0.1 150)',
                        fontSize: '12.5px',
                        fontWeight: '600',
                      }}>
                      {show(mustHave?.t)}
                      <button onClick={mustHave?.remove} style={{
                          border: '0',
                          background: 'none',
                          cursor: 'pointer',
                          color: 'inherit',
                          opacity: '0.6',
                          fontSize: '14px',
                          padding: '0 5px',
                        }}>
                        {'×'}
                      </button>
                    </span>
                  </Fragment>))}
                </div>
              </div>
              {' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '600' }}>
                  {'Nice to have'}
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {asList(vm.pk?.nice).map((niceToHave, index) => (<Fragment key={index}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        height: '28px',
                        padding: '0 4px 0 11px',
                        borderRadius: '14px',
                        background: 'oklch(0.95 0.005 85)',
                        color: 'oklch(0.38 0.012 265)',
                        fontSize: '12.5px',
                        fontWeight: '600',
                      }}>
                      {show(niceToHave?.t)}
                      <button onClick={niceToHave?.remove} style={{
                          border: '0',
                          background: 'none',
                          cursor: 'pointer',
                          color: 'inherit',
                          opacity: '0.6',
                          fontSize: '14px',
                          padding: '0 5px',
                        }}>
                        {'×'}
                      </button>
                    </span>
                  </Fragment>))}
                </div>
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
          <div style={{ border: '1px solid oklch(0.92 0.005 85)', borderRadius: '10px' }}>
            {' '}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '10px 12px',
                borderBottom: '1px solid oklch(0.94 0.005 85)',
                flexWrap: 'wrap',
              }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>
                {'Candidates '}
                <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)', marginLeft: '4px' }}>
                  {show(vm.pk?.candInfo)}
                </span>
              </span>
              <button onClick={vm.pk?.addCand} style={{
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
                {'+ Add candidate'}
              </button>
            </div>
            {' '}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 12px',
                flexWrap: 'wrap',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
              }}>
              {asList(vm.pk?.funnel).map((funnelStage, index) => (<Fragment key={index}>
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12.5px',
                    padding: '4px 10px',
                    borderRadius: '7px',
                    background: 'oklch(0.97 0.003 85)',
                  }}>
                  <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(funnelStage?.dot)}`)} />
                  {show(funnelStage?.label)}
                  <span style={{ fontWeight: '700' }}>
                    {show(funnelStage?.n)}
                  </span>
                </span>
              </Fragment>))}
              <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
                {show(vm.pk?.rejN)}
              </span>
            </div>
            {' '}
            <div style={{ padding: '8px 12px', borderBottom: '1px solid oklch(0.95 0.004 85)' }}>
              <div style={{
                  display: 'flex',
                  gap: '2px',
                  padding: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  borderRadius: '9px',
                  flexWrap: 'wrap',
                  width: 'fit-content',
                }}>
                {asList(vm.pk?.candSeg).map((candidateFilter, index) => (<Fragment key={index}>
                  <button onClick={candidateFilter?.go} style={inlineStyle(`border:0;padding:5px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(candidateFilter?.bg)};color:${attr(candidateFilter?.fg)};box-shadow:${attr(candidateFilter?.sh)}`)}>
                    {show(candidateFilter?.label)}
                  </button>
                </Fragment>))}
              </div>
            </div>
            {' '}
            {asList(vm.pk?.cands).map((candidate, index) => (<Fragment key={index}>
              <div style={inlineStyle(`padding:10px 12px;border-bottom:1px solid oklch(0.95 0.004 85);display:flex;flex-direction:column;gap:6px;opacity:${attr(candidate?.op)}`)}>
                {' '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={inlineStyle(`width:8px;height:8px;border-radius:50%;background:${attr(candidate?.dot)};flex-shrink:0`)} />
                  <input data-cid={candidate?.id} value={inputValue(candidate?.name)} onChange={candidate?.onName} placeholder="Candidate name" style={{
                      flex: '1 1 160px',
                      minWidth: '0',
                      height: '30px',
                      border: '0',
                      outline: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      background: 'transparent',
                    }} />
                  <select value={inputValue(candidate?.stage)} onChange={candidate?.onStage} style={{
                      height: '28px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      borderRadius: '7px',
                      background: '#fff',
                      fontSize: '12.5px',
                      padding: '0 6px',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                    }}>
                    {asList(candidate?.stOpts).map((stageOption, optionIndex) => (<Fragment key={optionIndex}>
                      <option value={inputValue(stageOption?.v)}>
                        {show(stageOption?.l)}
                      </option>
                    </Fragment>))}
                  </select>
                  <select value={inputValue(candidate?.src)} onChange={candidate?.onSrc} style={{
                      height: '28px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      borderRadius: '7px',
                      background: '#fff',
                      fontSize: '12.5px',
                      padding: '0 6px',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                    }}>
                    {asList(candidate?.srcOpts).map((sourceOption, optionIndex) => (<Fragment key={optionIndex}>
                      <option value={inputValue(sourceOption?.v)}>
                        {show(sourceOption?.l)}
                      </option>
                    </Fragment>))}
                  </select>
                  <span style={{ display: 'flex' }}>
                    {asList(candidate?.stars).map((star, starIndex) => (<Fragment key={starIndex}>
                      <button onClick={star?.go} title="Rate" style={inlineStyle(`border:0;background:none;cursor:pointer;font-size:15px;padding:0 1px;color:${attr(star?.col)}`)}>
                        {show(star?.ch)}
                      </button>
                    </Fragment>))}
                  </span>
                  <button onClick={candidate?.remove} title="Remove candidate" style={{
                      border: '0',
                      background: 'none',
                      color: 'oklch(0.72 0.01 265)',
                      fontSize: '15px',
                      cursor: 'pointer',
                    }}>
                    {'×'}
                  </button>
                </div>
                {' '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingLeft: '16px' }}>
                  <input type="number" value={inputValue(candidate?.ctc)} onChange={candidate?.onCtc} placeholder="Expected ₹ / month" style={{
                      height: '28px',
                      padding: '0 10px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      borderRadius: '7px',
                      fontSize: '12.5px',
                      outline: 'none',
                      minWidth: '0',
                      background: '#fff',
                      width: '150px',
                    }} />
                  {candidate?.overBudget ? (<>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.52 0.19 25)' }}>
                      {show(candidate?.overTxt)}
                    </span>
                  </>) : null}
                  <input value={inputValue(candidate?.link)} onChange={candidate?.onLink} placeholder="CV or LinkedIn link" style={{
                      height: '28px',
                      padding: '0 10px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      borderRadius: '7px',
                      fontSize: '12.5px',
                      outline: 'none',
                      minWidth: '0',
                      background: '#fff',
                      flex: '1 1 180px',
                    }} />
                  {candidate?.hasLink ? (<>
                    <a href={candidate?.link} target="_blank" rel="noopener" style={{ fontSize: '12px', fontWeight: '600' }}>
                      {'Open ↗'}
                    </a>
                  </>) : null}
                </div>
                {' '}
                <textarea value={inputValue(candidate?.notes)} onChange={candidate?.onNotes} rows="1" placeholder="Interview notes" style={{
                    marginLeft: '16px',
                    width: 'calc(100% - 16px)',
                    border: '1px solid oklch(0.93 0.005 85)',
                    borderRadius: '7px',
                    padding: '6px 9px',
                    fontSize: '13px',
                    resize: 'none',
                    fieldSizing: 'content',
                    outline: 'none',
                    fontFamily: 'inherit',
                    color: 'oklch(0.35 0.012 265)',
                  }} />
                {' '}
              </div>
            </Fragment>))}
            {' '}
            {vm.pk?.noCands ? (<>
              <button onClick={vm.pk?.addCand} style={{
                  width: '100%',
                  border: '0',
                  background: 'none',
                  padding: '14px 12px',
                  fontSize: '13px',
                  color: 'oklch(0.52 0.012 265)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}>
                {'No candidates here. Add people as they apply, then move them through Screening, Interview and Offer. Marking enough as Hired closes the role.'}
              </button>
            </>) : null}
            {' '}
          </div>
          {' '}
          <div style={{ border: '1px solid oklch(0.92 0.005 85)', borderRadius: '10px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '8px 12px',
                borderBottom: '1px solid oklch(0.94 0.005 85)',
              }}>
              <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                {'Interview steps '}
              </span>
              <button onClick={vm.pk?.addStep} style={{
                  height: '28px',
                  border: '1px solid oklch(0.88 0.008 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 12px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'+ Add step'}
              </button>
            </div>
            {asList(vm.pk?.steps).map((step, index) => (<Fragment key={index}>
              <div style={{
                  display: 'grid',
                  gridTemplateColumns: '24px minmax(0,1fr) 28px 24px',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderBottom: '1px solid oklch(0.96 0.004 85)',
                }}>
                <span style={{
                    fontSize: '12.5px',
                    fontWeight: '700',
                    color: 'oklch(0.52 0.012 265)',
                    textAlign: 'center',
                  }}>
                  {show(step?.n)}
                </span>
                <input value={inputValue(step?.text)} onChange={step?.onText} placeholder="Step name" style={{
                    minWidth: '0',
                    height: '30px',
                    border: '0',
                    outline: 'none',
                    fontSize: '13.5px',
                    background: 'transparent',
                  }} />
                <button onClick={step?.up} title="Move up" style={{
                    border: '0',
                    background: 'none',
                    cursor: 'pointer',
                    color: 'oklch(0.6 0.01 265)',
                    fontSize: '12px',
                  }}>
                  {'↑'}
                </button>
                <button onClick={step?.remove} title="Remove" style={{
                    border: '0',
                    background: 'none',
                    cursor: 'pointer',
                    color: 'oklch(0.72 0.01 265)',
                    fontSize: '15px',
                  }}>
                  {'×'}
                </button>
              </div>
            </Fragment>))}
          </div>
          {' '}
          <div style={{ border: '1px solid oklch(0.92 0.005 85)', borderRadius: '10px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '8px 12px',
                borderBottom: '1px solid oklch(0.94 0.005 85)',
              }}>
              <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                {'Tasks '}
                <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)', marginLeft: '4px' }}>
                  {show(vm.pk?.folInfo)}
                </span>
              </span>
              <button onClick={vm.pk?.addFol} style={{
                  height: '28px',
                  border: '1px solid oklch(0.88 0.008 85)',
                  background: '#fff',
                  borderRadius: '7px',
                  padding: '0 12px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                {'+ Add task'}
              </button>
            </div>
            {asList(vm.pk?.fols).map((followUpTask, index) => (<Fragment key={index}>
              <div style={{
                  display: 'grid',
                  gridTemplateColumns: '26px minmax(0,1fr) auto 24px auto',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 12px',
                  borderBottom: '1px solid oklch(0.96 0.004 85)',
                }}>
                <button onClick={followUpTask?.toggle} style={inlineStyle(`width:17px;height:17px;border-radius:5px;border:1.5px solid ${attr(followUpTask?.checkBorder)};background:${attr(followUpTask?.checkBg)};color:#fff;font-size:10px;line-height:1;cursor:pointer;padding:0`)}>
                  {show(followUpTask?.mark)}
                </button>
                <span style={inlineStyle(`font-size:14px;text-decoration:${attr(followUpTask?.deco)};color:${attr(followUpTask?.color)};min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`)}>
                  {show(followUpTask?.title)}
                </span>
                <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
                  {show(followUpTask?.due)}
                </span>
                <span style={inlineStyle(`width:22px;height:22px;border-radius:50%;background:${attr(followUpTask?.bg)};color:#fff;font-size:8.5px;font-weight:600;display:grid;place-items:center`)}>
                  {show(followUpTask?.ini)}
                </span>
                <button onClick={followUpTask?.open} style={{
                    height: '24px',
                    border: '1px solid oklch(0.88 0.008 85)',
                    background: '#fff',
                    borderRadius: '6px',
                    padding: '0 8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    color: 'oklch(0.4 0.012 265)',
                  }}>
                  {'OPEN'}
                </button>
              </div>
            </Fragment>))}
            {vm.pk?.noFols ? (<>
              <div style={{ padding: '14px 12px', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
                {'Post the job, ask for referrals, schedule interviews. Tasks show in Tasks too.'}
              </div>
            </>) : null}
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
              {'Discussion'}
            </div>
            {' '}
            {asList(vm.pk?.comments).map((comment, index) => (<Fragment key={index}>
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
                <button onClick={comment?.remove} style={{
                    border: '0',
                    background: 'none',
                    color: 'oklch(0.75 0.01 265)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}>
                  {'×'}
                </button>
              </div>
            </Fragment>))}
            {' '}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={inlineStyle(`width:26px;height:26px;border-radius:50%;background:${attr(vm.me?.bg)};color:#fff;font-size:9.5px;font-weight:600;display:grid;place-items:center;flex-shrink:0`)}>
                {show(vm.me?.ini)}
              </span>
              <textarea rows="1" value={inputValue(vm.pk?.cdraft)} onChange={vm.pk?.onC} onKeyDown={vm.pk?.onCKey} placeholder="Add a note… (Enter to post)" style={{
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
              <button onClick={vm.pk?.postC} style={{
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
          {vm.pk?.hasLog ? (<>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.52 0.012 265)',
                }}>
                {'History'}
              </span>
              {asList(vm.pk?.log).map((logEntry, index) => (<Fragment key={index}>
                <div style={{ display: 'flex', gap: '8px', fontSize: '12.5px', color: 'oklch(0.45 0.012 265)' }}>
                  <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'oklch(0.78 0.01 265)',
                      marginTop: '6px',
                      flexShrink: '0',
                    }} />
                  <span style={{ flex: '1' }}>
                    <span style={{ fontWeight: '600' }}>
                      {show(logEntry?.who)}
                    </span>
                    {' · '}{show(logEntry?.text)}
                  </span>
                  <span style={{ color: 'oklch(0.6 0.01 265)', whiteSpace: 'nowrap' }}>
                    {show(logEntry?.when)}
                  </span>
                </div>
              </Fragment>))}
            </div>
          </>) : null}
          {' '}
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
              paddingTop: '14px',
              borderTop: '1px solid oklch(0.94 0.005 85)',
            }}>
            <span style={{ fontSize: '12px', color: 'oklch(0.6 0.01 265)' }}>
              {show(vm.pk?.meta)}
            </span>
            <span style={{ fontSize: '12px', color: 'oklch(0.62 0.01 265)' }}>
              {'Esc to close'}
            </span>
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
