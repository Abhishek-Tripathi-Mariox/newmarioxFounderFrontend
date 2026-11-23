/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList } from '../rt';

export default function ConstitutionOverview({ vm }) {
  return (<>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {' '}
      <div style={{
          background: 'oklch(0.24 0.035 265)',
          color: '#fff',
          borderRadius: '16px',
          padding: 'clamp(24px,4vw,44px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: '28px',
          alignItems: 'end',
        }}>
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: '0' }}>
          {' '}
          <span style={{
              fontSize: '11.5px',
              fontWeight: '700',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'oklch(0.82 0.06 265)',
            }}>
            {'The operating principles of our business group'}
          </span>
          {' '}
          <h2 style={{
              margin: '0',
              fontFamily: '\'Instrument Serif\',Georgia,serif',
              fontWeight: '400',
              fontSize: 'clamp(36px,5vw,58px)',
              lineHeight: '1',
              letterSpacing: '-0.01em',
            }}>
            {'The Founders\' Constitution'}
          </h2>
          {' '}
          <div style={{ fontSize: '18px', fontWeight: '500', color: 'oklch(0.93 0.02 265)' }}>
            {'How We Build. How We Operate. How We Grow.'}
          </div>
          {' '}
          <div style={{
              fontSize: '14px',
              lineHeight: '1.55',
              color: 'oklch(0.84 0.02 265)',
              maxWidth: '520px',
              textWrap: 'pretty',
            }}>
            {'A common framework for leadership, company creation, product development, finance, people and business decisions.'}
          </div>
          {' '}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' }}>
            <span style={{
                fontSize: '12px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'oklch(1 0 0 / 0.12)',
                whiteSpace: 'nowrap',
              }}>
              {'Version '}{show(vm.cx?.version)}
            </span>
            <span style={{ fontSize: '12.5px', color: 'oklch(0.84 0.02 265)' }}>
              {'Last reviewed: '}{show(vm.cx?.reviewed)}
            </span>
            <button onClick={vm.cx?.markReviewed} style={{
                height: '28px',
                border: '1px solid oklch(1 0 0 / 0.25)',
                background: 'none',
                color: '#fff',
                borderRadius: '7px',
                padding: '0 10px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }} className="scp5">
              {'Mark reviewed today'}
            </button>
          </div>
          {' '}
        </div>
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {' '}
          {asList(vm.cx?.founders).map((founder, index) => (<Fragment key={index}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'oklch(1 0 0 / 0.07)',
                border: '1px solid oklch(1 0 0 / 0.1)',
              }}>
              <span style={inlineStyle(`width:38px;height:38px;border-radius:50%;background:${attr(founder?.bg)};display:grid;place-items:center;font-size:13px;font-weight:700;flex-shrink:0`)}>
                {show(founder?.ini)}
              </span>
              <div style={{ flex: '1', minWidth: '0' }}>
                <div style={{
                    fontFamily: '\'Instrument Serif\',Georgia,serif',
                    fontWeight: '400',
                    fontSize: '22px',
                    lineHeight: '1.1',
                  }}>
                  {show(founder?.name)}
                </div>
                <div style={{ fontSize: '12px', color: 'oklch(0.82 0.02 265)' }}>
                  {show(founder?.role)}
                </div>
              </div>
              <span style={inlineStyle(`font-size:11.5px;font-weight:600;padding:3px 9px;border-radius:20px;background:${attr(founder?.stBg)};color:${attr(founder?.stFg)};white-space:nowrap`)}>
                {show(founder?.st)}
              </span>
            </div>
          </Fragment>))}
          {' '}
          <div style={{ fontSize: '12px', letterSpacing: '0.04em', color: 'oklch(0.78 0.03 265)', textAlign: 'right' }}>
            {'One constitution · Multiple companies · Consistent governance'}
          </div>
          {' '}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(118px,1fr))', gap: '10px' }}>
        {asList(vm.cx?.stats).map((stat, index) => (<Fragment key={index}>
          <button onClick={stat?.go} style={{
              background: '#fff',
              border: '1px solid oklch(0.915 0.006 85)',
              borderRadius: '12px',
              padding: '14px 16px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }} className="scp6">
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.5 0.012 265)' }}>
              {show(stat?.l)}
            </span>
            <span style={inlineStyle(`font-size:26px;font-weight:700;letter-spacing:-0.02em;color:${attr(stat?.c)}`)}>
              {show(stat?.v)}
            </span>
            <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
              {show(stat?.h)}
            </span>
          </button>
        </Fragment>))}
      </div>
      {' '}
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <span style={{ fontSize: '14.5px', fontWeight: '600' }}>
              {'Waiting for '}{show(vm.cx?.meFirst)}
            </span>
            <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
              {show(vm.cx?.todoN)}
            </span>
          </div>
          {' '}
          {asList(vm.cx?.todo).map((todoItem, index) => (<Fragment key={index}>
            <button onClick={todoItem?.go} style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '0',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
                background: '#fff',
                padding: '10px 18px',
                textAlign: 'left',
                cursor: 'pointer',
              }} className="scp7">
              <span style={inlineStyle(`font-size:10px;font-weight:700;letter-spacing:0.03em;padding:2px 7px;border-radius:5px;background:${attr(todoItem?.bg)};color:${attr(todoItem?.fg)};white-space:nowrap`)}>
                {show(todoItem?.tag)}
              </span>
              <span style={{
                  flex: '1',
                  minWidth: '0',
                  fontSize: '13.5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {show(todoItem?.text)}
              </span>
              <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)', whiteSpace: 'nowrap' }}>
                {show(todoItem?.meta)}
              </span>
            </button>
          </Fragment>))}
          {' '}
          {vm.cx?.moreTodo ? (<>
            <button onClick={vm.cx?.goTodoAll} style={{
                width: '100%',
                border: '0',
                background: 'none',
                padding: '10px 18px',
                textAlign: 'left',
                fontSize: '12.5px',
                fontWeight: '600',
                color: 'var(--acc, oklch(0.5 0.17 265))',
                cursor: 'pointer',
              }}>
              {show(vm.cx?.moreTodoTxt)}
            </button>
          </>) : null}
          {' '}
          {vm.cx?.noTodo ? (<>
            <div style={{ padding: '22px 18px', fontSize: '13.5px', color: 'oklch(0.5 0.012 265)' }}>
              {'Nothing is waiting for your approval.'}
            </div>
          </>) : null}
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
            gap: '10px',
          }}>
          <span style={{ fontSize: '14.5px', fontWeight: '600' }}>
            {'Three levels of governance'}
          </span>
          {' '}
          {asList(vm.cx?.levels).map((level, index) => (<Fragment key={index}>
            <button onClick={level?.go} style={{
                display: 'grid',
                gridTemplateColumns: '44px minmax(0,1fr) auto',
                gap: '12px',
                alignItems: 'center',
                border: '1px solid oklch(0.93 0.005 85)',
                background: '#fff',
                borderRadius: '10px',
                padding: '10px 12px',
                textAlign: 'left',
                cursor: 'pointer',
              }} className="scp6">
              <span style={inlineStyle(`width:44px;height:44px;border-radius:10px;background:${attr(level?.bg)};color:${attr(level?.fg)};display:grid;place-items:center;font-size:12px;font-weight:700`)}>
                {show(level?.k)}
              </span>
              <span style={{ minWidth: '0' }}>
                <span style={{ display: 'block', fontSize: '13.5px', fontWeight: '600' }}>
                  {show(level?.name)}
                </span>
                <span style={{ display: 'block', fontSize: '12px', color: 'oklch(0.5 0.012 265)', marginTop: '1px' }}>
                  {show(level?.purpose)}
                </span>
                <span style={{
                    display: 'block',
                    fontSize: '12px',
                    color: 'oklch(0.4 0.012 265)',
                    marginTop: '4px',
                    fontStyle: 'italic',
                  }}>
                  {show(level?.ex)}
                </span>
              </span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'oklch(0.4 0.012 265)' }}>
                {show(level?.n)}
              </span>
            </button>
          </Fragment>))}
          {' '}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '10px',
          marginTop: '4px',
          flexWrap: 'wrap',
        }}>
        <span style={{ fontSize: '16px', fontWeight: '600' }}>
          {'15 chapters'}
        </span>
        <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
          {'Green is active, amber is waiting for approval'}
        </span>
      </div>
      {' '}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: '10px' }}>
        {asList(vm.cx?.chapters).map((chapter, index) => (<Fragment key={index}>
          <button onClick={chapter?.go} style={{
              background: '#fff',
              border: '1px solid oklch(0.915 0.006 85)',
              borderRadius: '12px',
              padding: '14px 16px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              minHeight: '136px',
            }} className="scp8">
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                  fontFamily: '\'Instrument Serif\',Georgia,serif',
                  fontWeight: '400',
                  fontSize: '30px',
                  lineHeight: '1',
                  color: 'var(--acc, oklch(0.5 0.17 265))',
                }}>
                {show(chapter?.num)}
              </span>
              <span style={{
                  fontFamily: '\'JetBrains Mono\',monospace',
                  fontSize: '10.5px',
                  color: 'oklch(0.55 0.012 265)',
                }}>
                {show(chapter?.code)}
              </span>
            </span>
            <span style={{ fontSize: '14px', fontWeight: '600', lineHeight: '1.3' }}>
              {show(chapter?.name)}
            </span>
            <span style={{ fontSize: '12px', color: 'oklch(0.5 0.012 265)', lineHeight: '1.4', flex: '1' }}>
              {show(chapter?.desc)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                  flex: '1',
                  height: '5px',
                  borderRadius: '3px',
                  background: 'oklch(0.94 0.005 85)',
                  overflow: 'hidden',
                  display: 'flex',
                }}>
                <span style={inlineStyle(`width:${attr(chapter?.wA)};background:oklch(0.58 0.13 150)`)} />
                <span style={inlineStyle(`width:${attr(chapter?.wP)};background:oklch(0.8 0.13 80)`)} />
              </span>
              <span style={{
                  fontSize: '11.5px',
                  fontWeight: '600',
                  color: 'oklch(0.45 0.012 265)',
                  whiteSpace: 'nowrap',
                }}>
                {show(chapter?.meta)}
              </span>
            </span>
          </button>
        </Fragment>))}
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
        <span style={{ fontSize: '14.5px', fontWeight: '600' }}>
          {'How Founder OS fits together'}
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '10px' }}>
          {asList(vm.cx?.layers).map((layer, index) => (<Fragment key={index}>
            <button onClick={layer?.go} style={inlineStyle(`border:0;background:${attr(layer?.bg)};border-radius:10px;padding:14px;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:4px`)}>
              <span style={inlineStyle(`font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${attr(layer?.fg)}`)}>
                {show(layer?.k)}
              </span>
              <span style={{ fontSize: '15px', fontWeight: '600', color: 'oklch(0.25 0.015 265)' }}>
                {show(layer?.name)}
              </span>
              <span style={{ fontSize: '12.5px', color: 'oklch(0.42 0.012 265)' }}>
                {show(layer?.desc)}
              </span>
              <span style={inlineStyle(`font-size:12px;font-weight:600;color:${attr(layer?.fg)};margin-top:4px`)}>
                {show(layer?.cta)}{' →'}
              </span>
            </button>
          </Fragment>))}
        </div>
      </div>
      {' '}
      <div style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)', lineHeight: '1.5', maxWidth: '760px' }}>
        {'This is an internal governance framework. It does not replace articles of association, shareholder agreements, board resolutions or statutory policies; align those with professional legal advice.'}
      </div>
      {' '}
    </div>
  </>);
}
