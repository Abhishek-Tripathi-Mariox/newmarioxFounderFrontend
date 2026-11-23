/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList } from '../rt';
import TeamMark from './TeamMark';

export default function Home({ vm }) {
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
          {show(vm.greeting)}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {show(vm.br?.sub)}
        </div>
      </div>
      {' '}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {vm.aiOn ? (<><button onClick={vm.cs?.write} style={{
            height: '40px',
            border: '0',
            background: 'var(--acc, oklch(0.5 0.17 265))',
            color: '#fff',
            borderRadius: '10px',
            padding: '0 16px',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
          {show(vm.cs?.writeLbl)}
        </button></>) : null}
        <button onClick={vm.cmd?.openIt} style={{
            height: '40px',
            border: '1px solid oklch(0.88 0.008 85)',
            background: '#fff',
            borderRadius: '10px',
            padding: '0 8px 0 14px',
            fontSize: '13.5px',
            color: 'oklch(0.52 0.012 265)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 1px 2px oklch(0.2 0.02 265 / 0.05)',
          }} className="scp2">
          <span>
            {'Add a task, find anything…'}
          </span>
          <span style={{
              fontFamily: '\'JetBrains Mono\',monospace',
              fontSize: '11.5px',
              padding: '3px 7px',
              borderRadius: '6px',
              background: 'oklch(0.95 0.005 85)',
              color: 'oklch(0.4 0.012 265)',
            }}>
            {show(vm.cmd?.kbd)}
          </span>
        </button>
      </div>
      {' '}
    </div>
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(118px,1fr))', gap: '10px' }}>
      {asList(vm.cs?.pulse).map((pulseStat, index) => (<Fragment key={index}>
        <button onClick={pulseStat?.go} style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            padding: '12px 14px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }} className="scp6">
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.5 0.012 265)' }}>
            {show(pulseStat?.l)}
          </span>
          <span style={inlineStyle(`font-size:22px;font-weight:700;letter-spacing:-0.02em;color:${attr(pulseStat?.c)}`)}>
            {show(pulseStat?.v)}
          </span>
          <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
            {show(pulseStat?.h)}
          </span>
        </button>
      </Fragment>))}
    </div>
    {' '}
    {vm.cs?.hasBrief ? (<>
      <div style={{
          background: 'oklch(0.24 0.035 265)',
          color: '#fff',
          borderRadius: '14px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: '700', letterSpacing: '0.1em', color: 'oklch(0.82 0.06 265)' }}>
            {'✦ '}{show(vm.cs?.briefHead)}
          </span>
          <span style={{ flex: '1' }} />
          <span style={{ fontSize: '12px', color: 'oklch(0.78 0.03 265)' }}>
            {show(vm.cs?.briefWhen)}
          </span>
          <button onClick={vm.cs?.copyBrief} style={{
              height: '26px',
              border: '1px solid oklch(1 0 0 / 0.25)',
              background: 'none',
              color: '#fff',
              borderRadius: '6px',
              padding: '0 9px',
              fontSize: '11.5px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            {'Copy'}
          </button>
        </div>
        <div style={{
            fontSize: '14.5px',
            lineHeight: '1.65',
            whiteSpace: 'pre-wrap',
            color: 'oklch(0.95 0.01 265)',
            textWrap: 'pretty',
          }}>
          {show(vm.cs?.briefText)}
        </div>
      </div>
    </>) : null}
    {' '}
    {vm.cs?.hasNote ? (<>
      <div style={{ fontSize: '12.5px', color: 'oklch(0.5 0.012 265)' }}>
        {show(vm.cs?.note)}
      </div>
    </>) : null}
    {' '}
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))',
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
        {' '}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 18px',
            borderBottom: '1px solid oklch(0.94 0.005 85)',
          }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            {'Needs your attention'}
          </div>
          <span style={inlineStyle(`font-size:12.5px;font-weight:600;padding:2px 9px;border-radius:10px;background:${attr(vm.br?.countBg)};color:${attr(vm.br?.countFg)}`)}>
            {show(vm.br?.count)}
          </span>
        </div>
        {' '}
        {asList(vm.br?.sections).map((section, index) => (<Fragment key={index}>
          {' '}
          <div style={inlineStyle(`padding:12px 18px 4px;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${attr(section?.color)}`)}>
            <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(section?.dot)}`)} />
            {show(section?.label)}
            <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)' }}>
              {show(section?.n)}
            </span>
          </div>
          {' '}
          {asList(section?.items).map((item, index) => (<Fragment key={index}>
            {' '}
            <button onClick={item?.go} style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 18px',
                border: '0',
                background: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
              }} className="scp13">
              {' '}
              <span style={{
                  flex: '1',
                  minWidth: '0',
                  fontSize: '14px',
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {show(item?.title)}
              </span>
              {' '}
              <TeamMark item={item} />
              <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(item?.tint)};color:${attr(item?.ink)}`)}>
                {show(item?.chip)}
              </span>
              {' '}
              <span style={inlineStyle(`font-size:12.5px;font-weight:500;color:${attr(item?.metaColor)};white-space:nowrap;min-width:78px;text-align:right`)}>
                {show(item?.meta)}
              </span>
              {' '}
            </button>
            {' '}
          </Fragment>))}
          {' '}
          {section?.hasMore ? (<>
            <button onClick={section?.more} style={{
                border: '0',
                background: 'none',
                padding: '4px 18px 8px',
                fontSize: '12.5px',
                fontWeight: '600',
                color: 'var(--acc, oklch(0.5 0.17 265))',
                cursor: 'pointer',
                textAlign: 'left',
              }}>
              {show(section?.moreLabel)}
            </button>
          </>) : null}
          {' '}
        </Fragment>))}
        {' '}
        {vm.br?.allClear ? (<>
          <div style={{
              padding: '36px 18px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>
              {'You\'re all clear'}
            </span>
            <span style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
              {'Nothing overdue, nothing waiting on you, no open decisions.'}
            </span>
          </div>
        </>) : null}
        {' '}
        <div style={{ height: '8px' }} />
        {' '}
      </div>
      {' '}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {' '}
        {vm.cs?.hasRisk ? (<>
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
                {'Risks to watch'}
              </span>
              <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                {show(vm.cs?.riskN)}
              </span>
            </div>
            {asList(vm.cs?.risks).map((risk, index) => (<Fragment key={index}>
              <button onClick={risk?.go} style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  border: '0',
                  borderBottom: '1px solid oklch(0.95 0.004 85)',
                  background: '#fff',
                  padding: '10px 18px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }} className="scp7">
                <span style={inlineStyle(`width:8px;height:8px;border-radius:50%;background:${attr(risk?.c)};margin-top:6px;flex-shrink:0`)} />
                <span style={{ flex: '1', minWidth: '0' }}>
                  <span style={{ display: 'block', fontSize: '13.5px', fontWeight: '600', lineHeight: '1.35' }}>
                    {show(risk?.text)}
                  </span>
                  <span style={{ display: 'block', fontSize: '12px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
                    {show(risk?.area)}
                  </span>
                </span>
              </button>
            </Fragment>))}
            {vm.cs?.noRisk ? (<>
              <div style={{ padding: '22px 18px', fontSize: '13.5px', color: 'oklch(0.45 0.11 150)', fontWeight: '600' }}>
                {'No red flags right now.'}
              </div>
            </>) : null}
          </div>
        </>) : null}
        {' '}
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
          {' '}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>
              {'Next 7 days'}
            </div>
            <button onClick={vm.goTasks} style={{
                border: '0',
                background: 'none',
                color: 'var(--acc, oklch(0.5 0.17 265))',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {'All tasks →'}
            </button>
          </div>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: '6px' }}>
            {' '}
            {asList(vm.br?.week).map((day, index) => (<Fragment key={index}>
              {' '}
              <button onClick={day?.go} title={day?.tip} style={inlineStyle(`border:1.5px solid ${attr(day?.bd)};background:${attr(day?.bg)};border-radius:10px;padding:8px 2px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;min-width:0`)} className="scp2">
                {' '}
                <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'oklch(0.52 0.012 265)',
                    textTransform: 'uppercase',
                  }}>
                  {show(day?.dow)}
                </span>
                {' '}
                <span style={inlineStyle(`font-size:17px;font-weight:600;color:${attr(day?.fg)}`)}>
                  {show(day?.num)}
                </span>
                {' '}
                <span style={inlineStyle(`font-size:11px;font-weight:600;color:${attr(day?.nColor)};min-height:14px`)}>
                  {show(day?.n)}
                </span>
                {' '}
              </button>
              {' '}
            </Fragment>))}
            {' '}
          </div>
          {' '}
          {vm.br?.hasDay ? (<>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                borderTop: '1px solid oklch(0.94 0.005 85)',
                paddingTop: '6px',
              }}>
              {' '}
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.52 0.012 265)', padding: '4px 0' }}>
                {show(vm.br?.dayLabel)}
              </div>
              {' '}
              {asList(vm.br?.dayItems).map((item, index) => (<Fragment key={index}>
                <button onClick={item?.go} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '0',
                    background: 'none',
                    padding: '6px 0',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13.5px',
                  }}>
                  <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(item?.dot)};flex-shrink:0`)} />
                  <span style={{
                      flex: '1',
                      minWidth: '0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {show(item?.title)}
                  </span>
                  <TeamMark item={item} />
                  <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;white-space:nowrap;background:${attr(item?.tint)};color:${attr(item?.ink)}`)}>
                    {show(item?.chip)}
                  </span>
                </button>
              </Fragment>))}
              {' '}
              {vm.br?.dayEmpty ? (<>
                <div style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)', padding: '4px 0 6px' }}>
                  {'Nothing due.'}
                </div>
              </>) : null}
              {' '}
            </div>
          </>) : null}
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
              padding: '14px 16px',
              borderBottom: '1px solid oklch(0.94 0.005 85)',
              fontSize: '15px',
              fontWeight: '600',
            }}>
            {'What changed'}
          </div>
          {' '}
          {asList(vm.br?.feed).map((activity, index) => (<Fragment key={index}>
            {' '}
            <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                padding: '9px 16px',
                borderBottom: '1px solid oklch(0.96 0.004 85)',
              }}>
              <span style={inlineStyle(`width:22px;height:22px;border-radius:50%;background:${attr(activity?.bg)};color:#fff;font-size:8.5px;font-weight:600;display:grid;place-items:center;flex-shrink:0`)}>
                {show(activity?.ini)}
              </span>
              <div style={{ flex: '1', minWidth: '0', fontSize: '13px', lineHeight: '1.45' }}>
                <span style={{ fontWeight: '600' }}>
                  {show(activity?.name)}
                </span>
                {' '}{show(activity?.text)}
                <div style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)', marginTop: '1px' }}>
                  {show(activity?.when)}
                </div>
              </div>
            </div>
            {' '}
          </Fragment>))}
          {' '}
          {vm.br?.noFeed ? (<>
            <div style={{ padding: '22px 16px', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
              {'Changes either founder makes will show up here.'}
            </div>
          </>) : null}
          {' '}
        </div>
        {' '}
      </div>
      {' '}
    </div>
    {' '}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '6px' }}>
      <div style={{ fontSize: '17px', fontWeight: '600', letterSpacing: '-0.01em' }}>
        {'Companies'}
      </div>
      <button onClick={vm.goReview} style={{
          border: '0',
          background: 'none',
          color: 'var(--acc, oklch(0.5 0.17 265))',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
        {'Weekly review →'}
      </button>
    </div>
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: '14px' }}>
      {' '}
      {asList(vm.br?.cos).map((company, index) => (<Fragment key={index}>
        {' '}
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
          {' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {' '}
            <div style={inlineStyle(`width:40px;height:40px;border-radius:10px;background:${attr(company?.bg)};display:grid;place-items:center;font-weight:700;color:#fff;font-size:18px;flex-shrink:0`)}>
              {show(company?.ini)}
            </div>
            {' '}
            <div style={{ minWidth: '0', flex: '1' }}>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>
                {show(company?.full)}
              </div>
              <div style={inlineStyle(`font-size:12.5px;font-weight:500;color:${attr(company?.healthColor)};margin-top:2px;display:flex;align-items:center;gap:6px`)}>
                <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(company?.healthColor)}`)} />
                {show(company?.health)}
              </div>
            </div>
            {' '}
          </div>
          {' '}
          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
              gap: '12px 8px',
              padding: '12px 0',
              borderTop: '1px solid oklch(0.94 0.005 85)',
              borderBottom: '1px solid oklch(0.94 0.005 85)',
            }}>
            {' '}
            {asList(company?.stats).map((stat, index) => (<Fragment key={index}>
              <button onClick={stat?.go} style={{
                  border: '0',
                  background: 'none',
                  padding: '0',
                  textAlign: 'left',
                  cursor: 'pointer',
                  minWidth: '0',
                }}>
                <div style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
                  {show(stat?.label)}
                </div>
                <div style={inlineStyle(`font-size:15px;font-weight:600;margin-top:2px;color:${attr(stat?.color)};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>
                  {show(stat?.value)}
                </div>
              </button>
            </Fragment>))}
            {' '}
          </div>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {' '}
            {asList(company?.goals).map((goal, index) => (<Fragment key={index}>
              <button onClick={goal?.go} style={{
                  border: '0',
                  background: 'none',
                  padding: '0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                <span style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px',
                    fontSize: '12.5px',
                    width: '100%',
                  }}>
                  <span style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {show(goal?.title)}
                  </span>
                  <span style={inlineStyle(`color:${attr(goal?.color)};font-weight:600;white-space:nowrap`)}>
                    {show(goal?.pctText)}
                  </span>
                </span>
                <span style={{
                    height: '5px',
                    width: '100%',
                    background: 'oklch(0.94 0.005 85)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    display: 'block',
                  }}>
                  <span style={inlineStyle(`display:block;height:100%;width:${attr(goal?.pct)};background:${attr(goal?.color)}`)} />
                </span>
              </button>
            </Fragment>))}
            {' '}
            {company?.noGoals ? (<>
              <button onClick={company?.addGoal} style={{
                  border: '1px dashed oklch(0.85 0.008 85)',
                  background: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  fontSize: '12.5px',
                  color: 'oklch(0.52 0.012 265)',
                  cursor: 'pointer',
                }}>
                {'+ Set a goal for '}{show(company?.name)}
              </button>
            </>) : null}
            {' '}
          </div>
          {' '}
          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
            {' '}
            <button onClick={company?.goTasks} style={{
                height: '34px',
                border: '1px solid oklch(0.88 0.008 85)',
                background: '#fff',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'oklch(0.3 0.012 265)',
                flex: '1',
              }}>
              {'Tasks'}
            </button>
            {' '}
            {/* Mariox runs two portals (sidebar → Mariox), so its card has no single "Open portal" link. */}
            {company?.live && company?.id !== 'mariox' ? (<>
              <a href={company?.href} style={{
                  flex: '1.4',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'var(--acc, oklch(0.5 0.17 265))',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }} className="scp14">
                <span style={{ whiteSpace: 'nowrap' }}>
                  {'Open portal →'}
                </span>
              </a>
            </>) : null}
            {' '}
            {company?.soon ? (<>
              <button onClick={company?.go} style={{
                  height: '34px',
                  border: '1px solid oklch(0.88 0.008 85)',
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: 'oklch(0.3 0.012 265)',
                  flex: '1.4',
                }}>
                <span style={{ whiteSpace: 'nowrap' }}>
                  {'Portal coming soon'}
                </span>
              </button>
            </>) : null}
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </Fragment>))}
      {' '}
    </div>
    {' '}
  </>);
}
