/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function WeeklyReview({ vm }) {
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
          {'Weekly review'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {'Builds itself from your tasks, goals and decisions. Takes about 15 minutes.'}
        </div>
      </div>
      {' '}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {' '}
        <button onClick={vm.wr?.copy} title="Copy the full review as text" style={{
            height: '34px',
            border: '1px solid oklch(0.88 0.008 85)',
            background: '#fff',
            borderRadius: '8px',
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.3 0.012 265)',
          }}>
          {show(vm.wr?.copyLabel)}
        </button>
        {' '}
        <button onClick={vm.wr?.print} title="Print or save as PDF" style={{
            height: '34px',
            border: '1px solid oklch(0.88 0.008 85)',
            background: '#fff',
            borderRadius: '8px',
            padding: '0 12px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.3 0.012 265)',
          }}>
          {'Print'}
        </button>
        {' '}
        {vm.wr?.notDone ? (<>
          <button onClick={vm.wr?.complete} style={{
              height: '34px',
              border: '0',
              background: 'oklch(0.55 0.14 150)',
              color: '#fff',
              borderRadius: '8px',
              padding: '0 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            {'✓ Mark review complete'}
          </button>
        </>) : null}
        {' '}
        {vm.wr?.isDone ? (<>
          <button onClick={vm.wr?.reopen} style={{
              height: '34px',
              border: '1px solid oklch(0.88 0.008 85)',
              background: '#fff',
              borderRadius: '8px',
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.3 0.012 265)',
            }}>
            {'↺ Reopen review'}
          </button>
        </>) : null}
        {' '}
      </div>
      {' '}
    </div>
    {' '}
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
      {' '}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {' '}
        <button onClick={vm.wr?.prev} title="Previous week" style={{
            height: '34px',
            border: '1px solid oklch(0.88 0.008 85)',
            background: '#fff',
            borderRadius: '8px',
            padding: '0',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.3 0.012 265)',
            width: '34px',
          }}>
          {'‹'}
        </button>
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '150px' }}>
          <span style={{ fontSize: '14.5px', fontWeight: '600' }}>
            {show(vm.wr?.label)}
          </span>
          <span style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
            {show(vm.wr?.rangeSub)}
          </span>
        </div>
        {' '}
        <button onClick={vm.wr?.next} title="Next week" style={inlineStyle(`height:34px;border:1px solid oklch(0.88 0.008 85);background:#fff;border-radius:8px;padding:0 12px;font-size:13px;font-weight:600;cursor:pointer;color:oklch(0.3 0.012 265);width:34px;padding:0;opacity:${attr(vm.wr?.nextOp)}`)}>
          {'›'}
        </button>
        {' '}
        {vm.wr?.notNow ? (<>
          <button onClick={vm.wr?.toNow} style={{
              height: '34px',
              border: '0',
              background: 'none',
              padding: '0 8px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--acc, oklch(0.5 0.17 265))',
              cursor: 'pointer',
            }}>
            {'This week'}
          </button>
        </>) : null}
        {' '}
        <label title="Jump to any week" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12.5px',
            color: 'oklch(0.52 0.012 265)',
          }}>
          {'Jump to'}
          <input type="date" value={inputValue(vm.wr?.pickDate)} onChange={vm.wr?.onPick} style={{
              height: '32px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '7px',
              fontSize: '13px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }} />
        </label>
        {' '}
      </div>
      {' '}
      <div style={{ flex: '1' }} />
      {' '}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
          {'Person'}
        </span>
        <div style={{
            display: 'flex',
            gap: '2px',
            padding: '3px',
            background: 'oklch(0.94 0.005 85)',
            borderRadius: '9px',
          }}>
          {asList(vm.wr?.whoSeg).map((personOption, index) => (<Fragment key={index}>
            <button onClick={personOption?.go} style={inlineStyle(`border:0;padding:5px 12px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(personOption?.bg)};color:${attr(personOption?.fg)};box-shadow:${attr(personOption?.sh)}`)}>
              {show(personOption?.label)}
            </button>
          </Fragment>))}
        </div>
        {vm.wr?.anyF ? (<>
          <button onClick={vm.wr?.clearF} style={{
              border: '0',
              background: 'none',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--acc, oklch(0.5 0.17 265))',
              cursor: 'pointer',
            }}>
            {'Clear filters'}
          </button>
        </>) : null}
      </div>
      {' '}
    </div>
    {' '}
    <div style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid oklch(0.915 0.006 85)',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}>
      {' '}
      {asList(vm.wr?.coTabs).map((companyTab, index) => (<Fragment key={index}>
        <button onClick={companyTab?.go} style={inlineStyle(`display:flex;align-items:center;gap:8px;border:0;background:none;padding:10px 12px;margin-bottom:-1px;border-bottom:2px solid ${attr(companyTab?.bd)};font-size:13.5px;font-weight:600;color:${attr(companyTab?.fg)};cursor:pointer;white-space:nowrap`)}>
          {companyTab?.hasTile ? (<>
            <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(companyTab?.tile)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center`)}>
              {show(companyTab?.ini)}
            </span>
          </>) : null}
          {show(companyTab?.label)}
        </button>
      </Fragment>))}
      {vm.wr?.coMore?.has ? (<>
        <input list={vm.wr?.coMore?.id} onChange={vm.wr?.coMore?.on} placeholder={vm.wr?.coMore?.ph} style={{
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
        <datalist id={vm.wr?.coMore?.id}>
          {asList(vm.wr?.coMore?.opts).map((option, index) => (<Fragment key={index}>
            <option value={inputValue(option?.l)} />
          </Fragment>))}
        </datalist>
      </>) : null}
      {' '}
    </div>
    {' '}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      {' '}
      <span style={inlineStyle(`font-size:12.5px;font-weight:600;padding:4px 10px;border-radius:7px;background:${attr(vm.wr?.stBg)};color:${attr(vm.wr?.stFg)}`)}>
        {show(vm.wr?.status)}
      </span>
      {' '}
      <span style={{ fontSize: '13px', color: 'oklch(0.45 0.012 265)' }}>
        {show(vm.wr?.doneMeta)}
      </span>
      {' '}
      <div style={{ flex: '1' }} />
      {' '}
      <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'oklch(0.45 0.12 150)' }}>
        {show(vm.wr?.streak)}
      </span>
      {' '}
    </div>
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '10px' }}>
      {' '}
      {asList(vm.wr?.kpis).map((kpi, index) => (<Fragment key={index}>
        <button onClick={kpi?.go} title={kpi?.tip} style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            textAlign: 'left',
            cursor: 'pointer',
          }} className="scp3">
          <span style={{ fontSize: '12.5px', color: 'oklch(0.48 0.012 265)' }}>
            {show(kpi?.label)}
          </span>
          <span style={inlineStyle(`font-size:24px;font-weight:600;letter-spacing:-0.01em;color:${attr(kpi?.color)}`)}>
            {show(kpi?.value)}
          </span>
          <span style={inlineStyle(`font-size:11.5px;font-weight:600;color:${attr(kpi?.dcol)}`)}>
            {show(kpi?.dtxt)}
          </span>
        </button>
      </Fragment>))}
      {' '}
    </div>
    {' '}
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
        gap: '14px',
        alignItems: 'stretch',
      }}>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
        {' '}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
          <span style={{ fontSize: '15px', fontWeight: '600' }}>
            {'Last 6 weeks'}
          </span>
          <span style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'oklch(0.48 0.012 265)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'oklch(0.62 0.13 150)' }} />
              {'Completed'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: 'oklch(0.68 0.16 25)' }} />
              {'Slipped'}
            </span>
          </span>
        </div>
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6,minmax(0,1fr))',
            gap: '10px',
            alignItems: 'end',
            height: '150px',
          }}>
          {' '}
          {asList(vm.wr?.trend).map((week, index) => (<Fragment key={index}>
            <button onClick={week?.go} title={week?.tip} style={{
                height: '100%',
                border: '0',
                background: 'none',
                padding: '0',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: '6px',
              }}>
              <span style={{
                  flex: '1',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  gap: '3px',
                  minHeight: '0',
                }}>
                <span style={inlineStyle(`width:40%;max-width:22px;height:${attr(week?.dH)};min-height:2px;background:oklch(0.62 0.13 150);border-radius:4px 4px 0 0`)} />
                <span style={inlineStyle(`width:40%;max-width:22px;height:${attr(week?.sH)};min-height:2px;background:oklch(0.68 0.16 25);border-radius:4px 4px 0 0`)} />
              </span>
              <span style={inlineStyle(`font-size:11.5px;color:oklch(0.45 0.012 265);font-weight:${attr(week?.fw)};text-align:center`)}>
                {show(week?.label)}
              </span>
            </button>
          </Fragment>))}
          {' '}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
        {' '}
        <span style={{ fontSize: '15px', fontWeight: '600' }}>
          {'Who got what done'}
        </span>
        {' '}
        {asList(vm.wr?.people).map((person, index) => (<Fragment key={index}>
          <div style={{
              display: 'grid',
              gridTemplateColumns: '28px 70px minmax(0,1fr) auto',
              alignItems: 'center',
              gap: '10px',
            }}>
            <span style={inlineStyle(`width:26px;height:26px;border-radius:50%;background:${attr(person?.bg)};color:#fff;font-size:9.5px;font-weight:600;display:grid;place-items:center`)}>
              {show(person?.ini)}
            </span>
            <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
              {show(person?.name)}
            </span>
            <span style={{ height: '8px', background: 'oklch(0.95 0.005 85)', borderRadius: '4px', overflow: 'hidden' }}>
              <span style={inlineStyle(`display:block;height:100%;width:${attr(person?.w)};background:oklch(0.62 0.13 150);border-radius:4px`)} />
            </span>
            <span style={{ fontSize: '12.5px', whiteSpace: 'nowrap', display: 'flex', gap: '8px' }}>
              <span>
                {show(person?.done)}
              </span>
              {person?.hasSlip ? (<>
                <span style={{ color: 'oklch(0.52 0.19 25)', fontWeight: '600' }}>
                  {show(person?.slip)}
                </span>
              </>) : null}
            </span>
          </div>
        </Fragment>))}
        {' '}
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
      <div style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>
            {'Founders\' review'}
          </div>
          <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
            {'Five short steps. Everything saves as you type.'}
          </div>
        </div>
      </div>
      {' '}
      <div style={{
          display: 'grid',
          gridTemplateColumns: '32px minmax(0,1fr)',
          gap: '14px',
          padding: '18px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
        }}>
        <span style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'oklch(0.95 0.005 85)',
            color: 'oklch(0.35 0.012 265)',
            fontSize: '13px',
            fontWeight: '700',
            display: 'grid',
            placeItems: 'center',
          }}>
          {'1'}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '0' }}>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
              {'How was the week?'}
            </div>
            <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'Each of you rates the week from 1 to 5.'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {asList(vm.wr?.scores).map((score, index) => (<Fragment key={index}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={inlineStyle(`width:26px;height:26px;border-radius:50%;background:${attr(score?.bg)};color:#fff;font-size:9.5px;font-weight:600;display:grid;place-items:center`)}>
                  {show(score?.ini)}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {asList(score?.opts).map((scoreOption, index) => (<Fragment key={index}>
                    <button onClick={scoreOption?.go} style={inlineStyle(`width:34px;height:34px;border:1px solid ${attr(scoreOption?.bd)};background:${attr(scoreOption?.bg)};color:${attr(scoreOption?.fg)};border-radius:8px;font-size:13.5px;font-weight:600;cursor:pointer`)}>
                      {show(scoreOption?.n)}
                    </button>
                  </Fragment>))}
                </div>
                <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', minWidth: '64px' }}>
                  {show(score?.word)}
                </span>
              </div>
            </Fragment>))}
          </div>
        </div>
      </div>
      {' '}
      <div style={{
          display: 'grid',
          gridTemplateColumns: '32px minmax(0,1fr)',
          gap: '14px',
          padding: '18px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
        }}>
        <span style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'oklch(0.95 0.005 85)',
            color: 'oklch(0.35 0.012 265)',
            fontSize: '13px',
            fontWeight: '700',
            display: 'grid',
            placeItems: 'center',
          }}>
          {'2'}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '0' }}>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
              {'Wins'}
            </div>
            <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'What went well? What are you proud of?'}
            </div>
          </div>
          <textarea value={inputValue(vm.wr?.wins)} onChange={vm.wr?.onWins} placeholder={'- Closed the Acme deal\n- Shipped the HROO onboarding'} style={{
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
              minHeight: '84px',
              background: '#fff',
            }} />
          {vm.wr?.hasWinsHint ? (<>
            <button onClick={vm.wr?.fillWins} style={{
                alignSelf: 'flex-start',
                border: '1px dashed oklch(0.8 0.04 265)',
                background: 'color-mix(in oklch, var(--acc) 5%, #fff)',
                color: 'var(--acc2, oklch(0.42 0.17 265))',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'+ '}{show(vm.wr?.winsHint)}
            </button>
          </>) : null}
        </div>
      </div>
      {' '}
      <div style={{
          display: 'grid',
          gridTemplateColumns: '32px minmax(0,1fr)',
          gap: '14px',
          padding: '18px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
        }}>
        <span style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'oklch(0.95 0.005 85)',
            color: 'oklch(0.35 0.012 265)',
            fontSize: '13px',
            fontWeight: '700',
            display: 'grid',
            placeItems: 'center',
          }}>
          {'3'}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '0' }}>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
              {'Misses'}
            </div>
            <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'What slipped or went wrong, and why?'}
            </div>
          </div>
          <textarea value={inputValue(vm.wr?.misses)} onChange={vm.wr?.onMisses} placeholder="- GTM deck slipped: waiting on numbers" style={{
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
              minHeight: '84px',
              background: '#fff',
            }} />
          {vm.wr?.hasMissHint ? (<>
            <button onClick={vm.wr?.fillMisses} style={{
                alignSelf: 'flex-start',
                border: '1px dashed oklch(0.8 0.04 265)',
                background: 'color-mix(in oklch, var(--acc) 5%, #fff)',
                color: 'var(--acc2, oklch(0.42 0.17 265))',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'+ '}{show(vm.wr?.missHint)}
            </button>
          </>) : null}
        </div>
      </div>
      {' '}
      <div style={{
          display: 'grid',
          gridTemplateColumns: '32px minmax(0,1fr)',
          gap: '14px',
          padding: '18px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
        }}>
        <span style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'oklch(0.95 0.005 85)',
            color: 'oklch(0.35 0.012 265)',
            fontSize: '13px',
            fontWeight: '700',
            display: 'grid',
            placeItems: 'center',
          }}>
          {'4'}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '0' }}>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
              {'What we learned'}
            </div>
            <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'One or two lessons to carry forward.'}
            </div>
          </div>
          <textarea value={inputValue(vm.wr?.learned)} onChange={vm.wr?.onLearned} placeholder="- Lock numbers before building the deck" style={{
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
              minHeight: '64px',
              background: '#fff',
            }} />
        </div>
      </div>
      {' '}
      <div style={{
          display: 'grid',
          gridTemplateColumns: '32px minmax(0,1fr)',
          gap: '14px',
          padding: '18px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
        }}>
        <span style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'oklch(0.95 0.005 85)',
            color: 'oklch(0.35 0.012 265)',
            fontSize: '13px',
            fontWeight: '700',
            display: 'grid',
            placeItems: 'center',
          }}>
          {'5'}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '0' }}>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
              {'Top 3 for next week'}
            </div>
            <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'The three things that matter most. Turn each into a task with one click.'}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {asList(vm.wr?.pri).map((priority, index) => (<Fragment key={index}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                    width: '22px',
                    fontSize: '15px',
                    fontWeight: '700',
                    color: 'oklch(0.5 0.012 265)',
                    textAlign: 'center',
                  }}>
                  {show(priority?.n)}
                </span>
                <input value={inputValue(priority?.text)} onChange={priority?.onText} placeholder="Priority" style={{
                    flex: '1',
                    minWidth: '0',
                    height: '38px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '14px',
                    outline: 'none',
                  }} />
                {priority?.canMake ? (<>
                  <button onClick={priority?.make} style={{
                      height: '34px',
                      border: '1px solid oklch(0.85 0.05 265)',
                      background: 'color-mix(in oklch, var(--acc) 6%, #fff)',
                      color: 'var(--acc2, oklch(0.42 0.17 265))',
                      borderRadius: '8px',
                      padding: '0 12px',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}>
                    {'+ Make task'}
                  </button>
                </>) : null}
                {priority?.hasTask ? (<>
                  <button onClick={priority?.openTask} style={{
                      height: '34px',
                      border: '1px solid oklch(0.85 0.06 150)',
                      background: 'oklch(0.97 0.02 150)',
                      color: 'oklch(0.38 0.1 150)',
                      borderRadius: '8px',
                      padding: '0 12px',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}>
                    {show(priority?.taskLabel)}
                  </button>
                </>) : null}
              </div>
            </Fragment>))}
          </div>
        </div>
      </div>
      {' '}
      <div style={{
          padding: '18px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'oklch(0.99 0.002 85)',
        }}>
        {' '}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: '600' }}>
              {'Other notes'}
            </div>
            <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {'Anything else. Claude can draft this from the week\'s facts.'}
            </div>
          </div>
          {vm.wr?.aiOn ? (<>
            <button onClick={vm.wr?.draft} style={{
                height: '32px',
                border: '1px solid oklch(0.85 0.05 265)',
                background: 'color-mix(in oklch, var(--acc) 6%, #fff)',
                color: 'var(--acc2, oklch(0.42 0.17 265))',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {show(vm.wr?.draftLabel)}
            </button>
          </>) : null}
        </div>
        {' '}
        <textarea value={inputValue(vm.wr?.summary)} onChange={vm.wr?.onSummary} placeholder="Notes, context, shout-outs" style={{
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
            minHeight: '84px',
            background: '#fff',
          }} />
        {' '}
        {vm.wr?.hasNote ? (<>
          <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
            {show(vm.wr?.note)}
          </span>
        </>) : null}
        {' '}
      </div>
      {' '}
    </div>
    {' '}
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        overflowX: 'auto',
      }}>
      {' '}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', minWidth: '620px' }}>
        {' '}
        <thead>
          <tr style={{
              background: 'oklch(0.975 0.004 85)',
              fontSize: '12px',
              color: 'oklch(0.48 0.012 265)',
              textAlign: 'right',
            }}>
            <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600' }}>
              {'By company'}
            </th>
            <th style={{ padding: '10px 16px', fontWeight: '600' }}>
              {'Completed'}
            </th>
            <th style={{ padding: '10px 16px', fontWeight: '600' }}>
              {'Slipped'}
            </th>
            <th style={{ padding: '10px 16px', fontWeight: '600' }}>
              {'Open now'}
            </th>
            <th style={{ padding: '10px 16px', fontWeight: '600' }}>
              {'Goals (avg)'}
            </th>
            <th style={{ padding: '10px 16px', fontWeight: '600' }}>
              {'Decisions'}
            </th>
          </tr>
        </thead>
        {' '}
        <tbody>
          {asList(vm.wr?.rows).map((companyRow, index) => (<Fragment key={index}>
            <tr onClick={companyRow?.go} title="Show only this company" style={{ borderTop: '1px solid oklch(0.95 0.004 85)', textAlign: 'right', cursor: 'pointer' }} className="scp4">
              <td style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
                  <span style={inlineStyle(`width:20px;height:20px;border-radius:5px;background:${attr(companyRow?.tile)};color:#fff;font-size:10.5px;font-weight:700;display:grid;place-items:center`)}>
                    {show(companyRow?.ini)}
                  </span>
                  {show(companyRow?.name)}
                </span>
              </td>
              <td style={{ padding: '10px 16px', color: 'oklch(0.45 0.12 150)', fontWeight: '600' }}>
                {show(companyRow?.done)}
              </td>
              <td style={inlineStyle(`padding:10px 16px;color:${attr(companyRow?.slipColor)};font-weight:600`)}>
                {show(companyRow?.slipped)}
              </td>
              <td style={{ padding: '10px 16px' }}>
                {show(companyRow?.open)}
              </td>
              <td style={{ padding: '10px 16px' }}>
                {show(companyRow?.goals)}
              </td>
              <td style={{ padding: '10px 16px' }}>
                {show(companyRow?.decs)}
              </td>
            </tr>
          </Fragment>))}
        </tbody>
        {' '}
      </table>
      {' '}
    </div>
    {' '}
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
        gap: '14px',
        alignItems: 'start',
      }}>
      {' '}
      {asList(vm.wr?.lists).map((list, index) => (<Fragment key={index}>
        {' '}
        <div data-wr={list?.id} style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
          {' '}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid oklch(0.94 0.005 85)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              <span style={inlineStyle(`width:8px;height:8px;border-radius:50%;background:${attr(list?.dot)}`)} />
              {show(list?.label)}
              <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)' }}>
                {show(list?.n)}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)', marginTop: '2px', paddingLeft: '16px' }}>
              {show(list?.help)}
            </div>
          </div>
          {' '}
          {asList(list?.items).map((item, index) => (<Fragment key={index}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 10px 0 0',
                borderBottom: '1px solid oklch(0.96 0.004 85)',
              }} className="scp13">
              <button onClick={item?.go} style={{
                  flex: '1',
                  minWidth: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 0 9px 16px',
                  border: '0',
                  background: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}>
                <span style={{
                    flex: '1',
                    minWidth: '0',
                    fontSize: '13.5px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  {show(item?.title)}
                </span>
                <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(item?.tint)};color:${attr(item?.ink)}`)}>
                  {show(item?.chip)}
                </span>
                <span style={inlineStyle(`font-size:12px;color:${attr(item?.metaColor)};white-space:nowrap`)}>
                  {show(item?.meta)}
                </span>
              </button>
              {item?.hasActs ? (<>
                <button onClick={item?.push} title="Move due date to next week" style={{
                    height: '26px',
                    border: '1px solid oklch(0.88 0.008 85)',
                    background: '#fff',
                    borderRadius: '6px',
                    padding: '0 8px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}>
                  {'+1 week'}
                </button>
                <button onClick={item?.finish} title="Mark as done" style={{
                    height: '26px',
                    border: '1px solid oklch(0.85 0.06 150)',
                    background: 'oklch(0.97 0.02 150)',
                    color: 'oklch(0.38 0.1 150)',
                    borderRadius: '6px',
                    padding: '0 8px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}>
                  {'Done'}
                </button>
              </>) : null}
            </div>
          </Fragment>))}
          {' '}
          {list?.hasMore ? (<>
            <div style={{ padding: '9px 16px', fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
              {show(list?.more)}
            </div>
          </>) : null}
          {' '}
          {list?.empty ? (<>
            <div style={{ padding: '16px', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
              {show(list?.emptyText)}
            </div>
          </>) : null}
          {' '}
        </div>
        {' '}
      </Fragment>))}
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
      <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid oklch(0.94 0.005 85)',
          fontSize: '14px',
          fontWeight: '600',
        }}>
        {'Past reviews'}
      </div>
      {' '}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}>
        {' '}
        {asList(vm.wr?.history).map((historyWeek, index) => (<Fragment key={index}>
          <button onClick={historyWeek?.go} style={inlineStyle(`border:0;border-right:1px solid oklch(0.95 0.004 85);border-bottom:1px solid oklch(0.95 0.004 85);background:${attr(historyWeek?.bg)};padding:12px 16px;display:flex;flex-direction:column;gap:5px;text-align:left;cursor:pointer`)} className="scp13">
            <span style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '8px',
                alignItems: 'center',
                width: '100%',
              }}>
              <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                {show(historyWeek?.label)}
              </span>
              <span style={inlineStyle(`font-size:11px;font-weight:600;padding:2px 7px;border-radius:5px;background:${attr(historyWeek?.stBg)};color:${attr(historyWeek?.stFg)}`)}>
                {show(historyWeek?.st)}
              </span>
            </span>
            <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
              {show(historyWeek?.sub)}
            </span>
          </button>
        </Fragment>))}
        {' '}
      </div>
      {' '}
    </div>
    {' '}
  </>);
}
