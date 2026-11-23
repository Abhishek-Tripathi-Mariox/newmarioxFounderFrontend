/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';
import Playbooks from './Playbooks';
import RulePanel from './RulePanel';
import VenturePanel from './VenturePanel';
import ConstitutionAmendments from './ConstitutionAmendments';
import ConstitutionAuthority from './ConstitutionAuthority';
import ConstitutionOverview from './ConstitutionOverview';
import ConstitutionRules from './ConstitutionRules';
import ConstitutionVentures from './ConstitutionVentures';

export default function Constitution({ vm }) {
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
        <div style={{
            fontSize: '11.5px',
            fontWeight: '700',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--acc, oklch(0.5 0.17 265))',
          }}>
          {'Core governance · Version '}{show(vm.cx?.version)}
        </div>
        <h1 style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: '600', letterSpacing: '-0.015em' }}>
          {'Constitution'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {show(vm.cx?.sub)}
        </div>
      </div>
      {' '}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {vm.aiOn ? (<><button onClick={vm.cx?.goAi} style={{
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
          {'✦ Ask the constitution'}
        </button></>) : null}
        <button onClick={vm.cx?.copyAll} style={{
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
          {'Copy as text'}
        </button>
        <button onClick={vm.cx?.newAmd} style={{
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
          {'Propose amendment'}
        </button>
      </div>
      {' '}
    </div>
    {' '}
    <div style={{
        display: 'flex',
        gap: '2px',
        borderBottom: '1px solid oklch(0.915 0.006 85)',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}>
      {asList(vm.cx?.tabs).map((tab, index) => (<Fragment key={index}>
        <button onClick={tab?.go} style={inlineStyle(`display:flex;align-items:center;gap:7px;border:0;background:none;padding:10px 11px;margin-bottom:-1px;border-bottom:2px solid ${attr(tab?.bd)};font-size:13.5px;font-weight:600;color:${attr(tab?.fg)};cursor:pointer;white-space:nowrap`)}>
          {show(tab?.label)}
          {tab?.hasN ? (<>
            <span style={inlineStyle(`font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;background:${attr(tab?.nBg)};color:${attr(tab?.nFg)}`)}>
              {show(tab?.n)}
            </span>
          </>) : null}
        </button>
      </Fragment>))}
    </div>
    {' '}
    {vm.cx?.showFilters ? (<>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <input value={inputValue(vm.cn?.q)} onChange={vm.cn?.onQ} placeholder="Search playbooks, steps, companies" style={{
            height: '32px',
            padding: '0 10px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '8px',
            fontSize: '13.5px',
            outline: 'none',
            background: '#fff',
            minWidth: '0',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            flex: '0 1 280px',
          }} />
        <select value={inputValue(vm.cn?.catSel?.value)} onChange={vm.cn?.catSel?.onChange} style={{
            height: '32px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '8px',
            background: '#fff',
            fontSize: '12.5px',
            padding: '0 6px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            minWidth: '0',
            maxWidth: '100%',
          }}>
          {asList(vm.cn?.catSel?.opts).map((option, index) => (<Fragment key={index}>
            <option value={inputValue(option?.v)}>
              {show(option?.l)}
            </option>
          </Fragment>))}
        </select>
        {vm.cn?.isPlaybooks ? (<>
          <select value={inputValue(vm.cn?.countrySel?.value)} onChange={vm.cn?.countrySel?.onChange} style={{
              height: '32px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              minWidth: '0',
              maxWidth: '100%',
            }}>
            {asList(vm.cn?.countrySel?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
        </>) : null}
        <span style={{ flex: '1' }} />
        {vm.cn?.isPlaybooks ? (<>
          <div style={{
              display: 'flex',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              width: 'fit-content',
              flexWrap: 'wrap',
            }}>
            {asList(vm.cn?.editSeg).map((option, index) => (<Fragment key={index}>
              <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                {show(option?.label)}
              </button>
            </Fragment>))}
          </div>
        </>) : null}
      </div>
    </>) : null}
    {' '}
    {vm.cx?.isOverview ? <ConstitutionOverview vm={vm} /> : null}
    {' '}
    {vm.cx?.isRules ? <ConstitutionRules vm={vm} /> : null}
    {' '}
    {vm.cx?.isVen ? <ConstitutionVentures vm={vm} /> : null}
    {' '}
    {vm.cx?.isAuth ? <ConstitutionAuthority vm={vm} /> : null}
    {' '}
    {vm.cx?.isAmd ? <ConstitutionAmendments vm={vm} /> : null}
    {' '}
    {vm.cx?.isExc ? (<>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {' '}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '13px', color: 'oklch(0.48 0.012 265)', flex: '1', minWidth: '240px' }}>
            {'A temporary deviation from a rule, approved by both founders, with an expiry date.'}
          </div>
          <div style={{
              display: 'flex',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              width: 'fit-content',
              flexWrap: 'wrap',
            }}>
            {asList(vm.cx?.excSeg).map((option, index) => (<Fragment key={index}>
              <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                {show(option?.label)}
              </button>
            </Fragment>))}
          </div>
          <button onClick={vm.cx?.newExc} style={{
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
            {'+ Request exception'}
          </button>
        </div>
        {' '}
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            overflow: 'auto',
          }}>
          <div style={{ minWidth: '860px' }}>
            {' '}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1.4fr) 120px minmax(0,1.4fr) 110px 70px 90px 170px',
                gap: '12px',
                padding: '9px 16px',
                background: 'oklch(0.975 0.004 85)',
                fontSize: '12px',
                fontWeight: '600',
                color: 'oklch(0.5 0.012 265)',
              }}>
              <span>
                {'Rule'}
              </span>
              <span>
                {'Company'}
              </span>
              <span>
                {'Reason'}
              </span>
              <span>
                {'Valid until'}
              </span>
              <span>
                {'Approved'}
              </span>
              <span>
                {'Status'}
              </span>
              <span />
            </div>
            {' '}
            {asList(vm.cx?.excs).map((exception, index) => (<Fragment key={index}>
              <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,1.4fr) 120px minmax(0,1.4fr) 110px 70px 90px 170px',
                  gap: '12px',
                  padding: '11px 16px',
                  borderBottom: '1px solid oklch(0.95 0.004 85)',
                  alignItems: 'center',
                  fontSize: '13px',
                }}>
                {' '}
                <button onClick={exception?.openRule} style={{
                    border: '0',
                    background: 'none',
                    padding: '0',
                    textAlign: 'left',
                    cursor: 'pointer',
                    minWidth: '0',
                  }}>
                  <span style={{
                      fontFamily: '\'JetBrains Mono\',monospace',
                      fontSize: '11.5px',
                      color: 'oklch(0.5 0.012 265)',
                    }}>
                    {show(exception?.code)}
                  </span>
                  <span style={{
                      display: 'block',
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {show(exception?.rule)}
                  </span>
                </button>
                {' '}
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '0' }}>
                  <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(exception?.coBg)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center;flex-shrink:0`)}>
                    {show(exception?.coIni)}
                  </span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {show(exception?.co)}
                  </span>
                </span>
                {' '}
                <span style={{ color: 'oklch(0.38 0.012 265)', lineHeight: '1.4' }}>
                  {show(exception?.reason)}
                  <span style={{ display: 'block', fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
                    {'by '}{show(exception?.by)}
                  </span>
                </span>
                {' '}
                <span>
                  <span style={{ display: 'block' }}>
                    {show(exception?.until)}
                  </span>
                  <span style={inlineStyle(`font-size:11.5px;color:${attr(exception?.leftC)}`)}>
                    {show(exception?.left)}
                  </span>
                </span>
                {' '}
                <span style={{ display: 'flex', gap: '3px' }}>
                  {asList(exception?.signs).map((signature, index) => (<Fragment key={index}>
                    <span title={signature?.tip} style={inlineStyle(`width:22px;height:22px;border-radius:50%;background:${attr(signature?.bg)};color:${attr(signature?.fg)};border:1.5px solid ${attr(signature?.bd)};display:grid;place-items:center;font-size:9px;font-weight:700;box-sizing:border-box`)}>
                      {show(signature?.ini)}
                    </span>
                  </Fragment>))}
                </span>
                {' '}
                <span>
                  <span style={inlineStyle(`font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;background:${attr(exception?.sBg)};color:${attr(exception?.sFg)}`)}>
                    {show(exception?.st)}
                  </span>
                </span>
                {' '}
                <span style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                  {exception?.canApprove ? (<>
                    <button onClick={exception?.approve} style={{
                        height: '28px',
                        border: '1px solid oklch(0.9 0.006 85)',
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '0 9px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        color: 'oklch(0.35 0.012 265)',
                        whiteSpace: 'nowrap',
                      }}>
                      {'Approve'}
                    </button>
                  </>) : null}
                  {exception?.canExtend ? (<>
                    <button onClick={exception?.extend} style={{
                        height: '28px',
                        border: '1px solid oklch(0.9 0.006 85)',
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '0 9px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        color: 'oklch(0.35 0.012 265)',
                        whiteSpace: 'nowrap',
                      }}>
                      {'+30 days'}
                    </button>
                  </>) : null}
                  {exception?.canRevoke ? (<>
                    <button onClick={exception?.revoke} style={{
                        border: '0',
                        background: 'none',
                        color: 'oklch(0.5 0.18 25)',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}>
                      {show(exception?.revokeLbl)}
                    </button>
                  </>) : null}
                </span>
                {' '}
              </div>
            </Fragment>))}
            {' '}
            {vm.cx?.noExc ? (<>
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '13.5px', color: 'oklch(0.5 0.012 265)' }}>
                {'No exceptions here.'}
              </div>
            </>) : null}
            {' '}
          </div>
        </div>
        {' '}
      </div>
    </>) : null}
    {' '}
    {vm.cx?.isAi ? (<>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(220px,290px)',
          gap: '14px',
          alignItems: 'start',
        }}>
        {' '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '0' }}>
          {' '}
          <div style={{
              background: '#fff',
              border: '1px solid oklch(0.915 0.006 85)',
              borderRadius: '12px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>
              {'Ask the constitution'}
            </div>
            <div style={{ fontSize: '13px', color: 'oklch(0.5 0.012 265)', lineHeight: '1.5' }}>
              {'Answers use only your rules, pending proposals and authority limits. When nothing covers the question, it says a rule is missing.'}
            </div>
            <textarea value={inputValue(vm.cx?.ai?.q)} onChange={vm.cx?.ai?.onQ} onKeyDown={vm.cx?.ai?.onKey} placeholder="e.g. Can the co-founder independently approve a ₹3 L marketing spend for HROO?" style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                fieldSizing: 'content',
                minHeight: '72px',
                boxSizing: 'border-box',
              }} />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {asList(vm.cx?.ai?.sugg).map((suggestion, index) => (<Fragment key={index}>
                <button onClick={suggestion?.go} style={{
                    border: '1px solid oklch(0.9 0.006 85)',
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '5px 11px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: 'oklch(0.38 0.012 265)',
                    textAlign: 'left',
                  }} className="scpa">
                  {show(suggestion?.t)}
                </button>
              </Fragment>))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={vm.cx?.ai?.ask} style={{
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
                {show(vm.cx?.ai?.btn)}
              </button>
              <span style={{ fontSize: '12.5px', color: 'oklch(0.5 0.012 265)' }}>
                {show(vm.cx?.ai?.note)}
              </span>
            </div>
          </div>
          {' '}
          {asList(vm.cx?.ai?.items).map((answer, index) => (<Fragment key={index}>
            <div style={{
                background: '#fff',
                border: '1px solid oklch(0.915 0.006 85)',
                borderRadius: '12px',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={inlineStyle(`width:26px;height:26px;border-radius:50%;background:${attr(answer?.bg)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center;flex-shrink:0`)}>
                  {show(answer?.ini)}
                </span>
                <div style={{ flex: '1', fontSize: '14px', fontWeight: '600', lineHeight: '1.4' }}>
                  {show(answer?.q)}
                </div>
                <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)', whiteSpace: 'nowrap' }}>
                  {show(answer?.when)}
                </span>
                <button onClick={answer?.remove} title="Delete" style={{
                    border: '0',
                    background: 'none',
                    color: 'oklch(0.65 0.01 265)',
                    cursor: 'pointer',
                    fontSize: '15px',
                  }}>
                  {'×'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', paddingLeft: '36px' }}>
                {asList(answer?.lines).map((line, index) => (<Fragment key={index}>
                  <div style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'flex-start',
                      fontSize: '13.5px',
                      lineHeight: '1.55',
                      color: 'oklch(0.3 0.012 265)',
                    }}>
                    {line?.hasTag ? (<>
                      <span style={inlineStyle(`font-size:9.5px;font-weight:700;letter-spacing:0.03em;padding:3px 7px;border-radius:5px;background:${attr(line?.bg)};color:${attr(line?.fg)};white-space:nowrap;margin-top:2px`)}>
                        {show(line?.tag)}
                      </span>
                    </>) : null}
                    <span style={{ flex: '1', minWidth: '0', whiteSpace: 'pre-wrap' }}>
                      {show(line?.text)}
                    </span>
                  </div>
                </Fragment>))}
              </div>
              <div style={{ display: 'flex', gap: '6px', paddingLeft: '36px' }}>
                <button onClick={answer?.copy} style={{
                    height: '26px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '0 9px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: 'oklch(0.35 0.012 265)',
                    whiteSpace: 'nowrap',
                  }}>
                  {'Copy'}
                </button>
                {answer?.missing ? (<>
                  <button onClick={answer?.draftRule} style={{
                      height: '26px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      background: '#fff',
                      borderRadius: '8px',
                      padding: '0 9px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      color: 'oklch(0.35 0.012 265)',
                      whiteSpace: 'nowrap',
                    }}>
                    {'Propose the missing rule'}
                  </button>
                </>) : null}
              </div>
            </div>
          </Fragment>))}
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
            position: 'sticky',
            top: '12px',
          }}>
          <div style={{ fontSize: '13.5px', fontWeight: '600' }}>
            {'How answers are labelled'}
          </div>
          {asList(vm.cx?.ai?.legend).map((legendItem, index) => (<Fragment key={index}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={inlineStyle(`font-size:9.5px;font-weight:700;letter-spacing:0.03em;padding:3px 7px;border-radius:5px;background:${attr(legendItem?.bg)};color:${attr(legendItem?.fg)};width:fit-content`)}>
                {show(legendItem?.tag)}
              </span>
              <span style={{ fontSize: '12.5px', color: 'oklch(0.45 0.012 265)', lineHeight: '1.4' }}>
                {show(legendItem?.d)}
              </span>
            </div>
          </Fragment>))}
          <div style={{
              fontSize: '11.5px',
              color: 'oklch(0.55 0.012 265)',
              lineHeight: '1.45',
              borderTop: '1px solid oklch(0.94 0.005 85)',
              paddingTop: '10px',
            }}>
            {'It never presents a draft or pending rule as approved. Check legal questions with your CA or lawyer.'}
          </div>
        </div>
        {' '}
      </div>
    </>) : null}
    {' '}
    {vm.cn?.isPlaybooks ? <Playbooks vm={vm} /> : null}
    {' '}
    {vm.cn?.isRollout ? (<>
      {' '}
      <div style={{ fontSize: '13px', color: 'oklch(0.48 0.012 265)' }}>
        {'Every company against every playbook. Click a % to tick steps, or "Apply" to start a playbook.'}
      </div>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          overflow: 'auto',
          maxHeight: 'calc(100vh - 300px)',
        }}>
        <div style={{ minWidth: 'max-content' }}>
          {' '}
          <div style={inlineStyle(`display:grid;grid-template-columns:${attr(vm.cn?.rgrid)};gap:0;position:sticky;top:0;z-index:2;background:oklch(0.975 0.004 85);border-bottom:1px solid oklch(0.93 0.005 85)`)}>
            <span style={{
                padding: '10px 14px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'oklch(0.48 0.012 265)',
                position: 'sticky',
                left: '0',
                background: 'oklch(0.975 0.004 85)',
              }}>
              {'Company'}
            </span>
            {asList(vm.cn?.rcols).map((column, index) => (<Fragment key={index}>
              <button onClick={column?.go} title={column?.name} style={{
                  border: '0',
                  background: 'none',
                  padding: '10px 8px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  color: 'oklch(0.42 0.012 265)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  lineHeight: '1.3',
                }}>
                {show(column?.name)}
              </button>
            </Fragment>))}
            <span style={{
                padding: '10px 8px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'oklch(0.48 0.012 265)',
                textAlign: 'center',
              }}>
              {'Total'}
            </span>
          </div>
          {' '}
          {asList(vm.cn?.rrows).map((row, index) => (<Fragment key={index}>
            <div style={inlineStyle(`display:grid;grid-template-columns:${attr(vm.cn?.rgrid)};border-bottom:1px solid oklch(0.95 0.004 85);align-items:center`)}>
              {' '}
              <button onClick={row?.open} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  border: '0',
                  background: '#fff',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'sticky',
                  left: '0',
                  minWidth: '0',
                }}>
                <span style={inlineStyle(`width:24px;height:24px;border-radius:6px;background:${attr(row?.bg)};color:#fff;font-size:11px;font-weight:700;display:grid;place-items:center;flex-shrink:0`)}>
                  {show(row?.ini)}
                </span>
                <span style={{ minWidth: '0' }}>
                  <span style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {show(row?.name)}
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: 'oklch(0.55 0.012 265)' }}>
                    {show(row?.sub)}
                  </span>
                </span>
              </button>
              {' '}
              {asList(row?.cells).map((cell, index) => (<Fragment key={index}>
                <div style={{ padding: '4px 6px', display: 'flex', justifyContent: 'center' }}>
                  {cell?.has ? (<>
                    <button onClick={cell?.go} style={inlineStyle(`width:100%;height:30px;border:0;border-radius:7px;background:${attr(cell?.bg)};color:${attr(cell?.fg)};font-size:12.5px;font-weight:700;cursor:pointer`)}>
                      {show(cell?.txt)}
                    </button>
                  </>) : null}
                  {cell?.none ? (<>
                    <button onClick={cell?.apply} style={{
                        width: '100%',
                        height: '30px',
                        border: '1px dashed oklch(0.88 0.008 85)',
                        borderRadius: '7px',
                        background: 'none',
                        color: 'oklch(0.6 0.01 265)',
                        fontSize: '11.5px',
                        cursor: 'pointer',
                      }} className="scpb">
                      {'Apply'}
                    </button>
                  </>) : null}
                </div>
              </Fragment>))}
              {' '}
              <span style={inlineStyle(`text-align:center;font-size:13px;font-weight:700;color:${attr(row?.tcol)}`)}>
                {show(row?.total)}
              </span>
              {' '}
            </div>
          </Fragment>))}
          {' '}
          {vm.cn?.noRows ? (<>
            <div style={{ padding: '24px', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
              {'No companies match.'}
            </div>
          </>) : null}
          {' '}
        </div>
      </div>
      {' '}
    </>) : null}
    {' '}
    {vm.cx?.hasR ? <RulePanel vm={vm} /> : null}
    {' '}
    {vm.cx?.hasA ? (<>
      <div onClick={vm.cx?.A?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.3)', zIndex: '47' }} />
      <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: '14px',
          zIndex: '48',
          boxShadow: '0 24px 60px oklch(0.2 0.02 265 / 0.25)',
          width: 'min(640px,calc(100% - 32px))',
        }}>
        {' '}
        <div style={{
            padding: '18px 22px',
            borderBottom: '1px solid oklch(0.94 0.005 85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '600' }}>
              {'Propose an amendment'}
            </div>
            <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {show(vm.cx?.A?.otherTxt)}
            </div>
          </div>
          <button onClick={vm.cx?.A?.close} style={{
              border: '0',
              background: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'oklch(0.5 0.012 265)',
            }}>
            {'×'}
          </button>
        </div>
        {' '}
        <div style={{
            padding: '18px 22px',
            display: 'grid',
            gridTemplateColumns: '110px minmax(0,1fr)',
            gap: '12px 14px',
            alignItems: 'center',
          }}>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Type'}
          </span>
          <div style={{
              display: 'flex',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              width: 'fit-content',
              flexWrap: 'wrap',
            }}>
            {asList(vm.cx?.A?.typeSeg).map((option, index) => (<Fragment key={index}>
              <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                {show(option?.label)}
              </button>
            </Fragment>))}
          </div>
          {' '}
          {vm.cx?.A?.needRule ? (<>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              {'Rule'}
            </span>
            <select value={inputValue(vm.cx?.A?.rule?.value)} onChange={vm.cx?.A?.rule?.onChange} style={{
                height: '32px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                background: '#fff',
                fontSize: '12.5px',
                padding: '0 6px',
                fontFamily: 'inherit',
                cursor: 'pointer',
                minWidth: '0',
                maxWidth: '100%',
              }}>
              {asList(vm.cx?.A?.rule?.opts).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
          </>) : null}
          {' '}
          {vm.cx?.A?.isNew ? (<>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              {'Chapter'}
            </span>
            <select value={inputValue(vm.cx?.A?.ch?.value)} onChange={vm.cx?.A?.ch?.onChange} style={{
                height: '32px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                background: '#fff',
                fontSize: '12.5px',
                padding: '0 6px',
                fontFamily: 'inherit',
                cursor: 'pointer',
                minWidth: '0',
                maxWidth: '100%',
              }}>
              {asList(vm.cx?.A?.ch?.opts).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
          </>) : null}
          {' '}
          {vm.cx?.A?.hasText ? (<>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>
              {'Title'}
            </span>
            <input value={inputValue(vm.cx?.A?.title)} onChange={vm.cx?.A?.onTitle} style={{
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
                width: '100%',
              }} />
            <span style={{ fontSize: '13px', fontWeight: '600', alignSelf: 'start', paddingTop: '8px' }}>
              {'Wording'}
            </span>
            <textarea value={inputValue(vm.cx?.A?.text)} onChange={vm.cx?.A?.onText} style={{
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
          </>) : null}
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600', alignSelf: 'start', paddingTop: '8px' }}>
            {'Reason'}
          </span>
          <textarea value={inputValue(vm.cx?.A?.reason)} onChange={vm.cx?.A?.onReason} placeholder="Why should this change? What problem does it solve?" style={{
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
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Effective from'}
          </span>
          <input type="date" value={inputValue(vm.cx?.A?.eff)} onChange={vm.cx?.A?.onEff} style={{
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
              width: 'fit-content',
            }} />
          {' '}
        </div>
        {' '}
        <div style={{
            padding: '14px 22px',
            borderTop: '1px solid oklch(0.94 0.005 85)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
          <span style={{ flex: '1', fontSize: '12.5px', color: 'oklch(0.5 0.18 25)' }}>
            {show(vm.cx?.A?.err)}
          </span>
          <button onClick={vm.cx?.A?.close} style={{
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
            {'Cancel'}
          </button>
          <button onClick={vm.cx?.A?.submit} style={{
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
            {'Send for review'}
          </button>
        </div>
        {' '}
      </div>
    </>) : null}
    {' '}
    {vm.cx?.hasE ? (<>
      <div onClick={vm.cx?.E?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.3)', zIndex: '47' }} />
      <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: '14px',
          zIndex: '48',
          boxShadow: '0 24px 60px oklch(0.2 0.02 265 / 0.25)',
          width: 'min(560px,calc(100% - 32px))',
        }}>
        {' '}
        <div style={{
            padding: '18px 22px',
            borderBottom: '1px solid oklch(0.94 0.005 85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '600' }}>
              {'Request an exception'}
            </div>
            <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)', marginTop: '2px' }}>
              {show(vm.cx?.E?.otherTxt)}
            </div>
          </div>
          <button onClick={vm.cx?.E?.close} style={{
              border: '0',
              background: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'oklch(0.5 0.012 265)',
            }}>
            {'×'}
          </button>
        </div>
        {' '}
        <div style={{
            padding: '18px 22px',
            display: 'grid',
            gridTemplateColumns: '100px minmax(0,1fr)',
            gap: '12px 14px',
            alignItems: 'center',
          }}>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Rule'}
          </span>
          <select value={inputValue(vm.cx?.E?.rule?.value)} onChange={vm.cx?.E?.rule?.onChange} style={{
              height: '32px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              minWidth: '0',
              maxWidth: '100%',
            }}>
            {asList(vm.cx?.E?.rule?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Company'}
          </span>
          <select value={inputValue(vm.cx?.E?.co?.value)} onChange={vm.cx?.E?.co?.onChange} style={{
              height: '32px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              minWidth: '0',
              maxWidth: '100%',
            }}>
            {asList(vm.cx?.E?.co?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600', alignSelf: 'start', paddingTop: '8px' }}>
            {'Reason'}
          </span>
          <textarea value={inputValue(vm.cx?.E?.reason)} onChange={vm.cx?.E?.onReason} placeholder="Why this company needs to deviate, and what it does instead" style={{
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
          {' '}
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {'Valid until'}
          </span>
          <input type="date" value={inputValue(vm.cx?.E?.until)} onChange={vm.cx?.E?.onUntil} style={{
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
              width: 'fit-content',
            }} />
          {' '}
        </div>
        {' '}
        <div style={{
            padding: '14px 22px',
            borderTop: '1px solid oklch(0.94 0.005 85)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
          <span style={{ flex: '1', fontSize: '12.5px', color: 'oklch(0.5 0.18 25)' }}>
            {show(vm.cx?.E?.err)}
          </span>
          <button onClick={vm.cx?.E?.close} style={{
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
            {'Cancel'}
          </button>
          <button onClick={vm.cx?.E?.submit} style={{
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
            {'Send for approval'}
          </button>
        </div>
        {' '}
      </div>
    </>) : null}
    {' '}
    {vm.cx?.hasV ? <VenturePanel vm={vm} /> : null}
    {' '}
    {vm.cn?.isHistory ? (<>
      {' '}
      {vm.cx?.hasArch ? (<>
        <div style={{
            background: '#fff',
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '12px',
          }}>
          <div style={{
              padding: '12px 18px',
              borderBottom: '1px solid oklch(0.94 0.005 85)',
              fontSize: '14px',
              fontWeight: '600',
            }}>
            {'Archived versions · '}{show(vm.cx?.archN)}
          </div>
          {asList(vm.cx?.archive).map((version, index) => (<Fragment key={index}>
            <button onClick={version?.open} style={{
                width: '100%',
                display: 'flex',
                gap: '10px',
                alignItems: 'baseline',
                border: '0',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
                background: '#fff',
                padding: '9px 18px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '13px',
              }} className="scp7">
              <span style={{
                  fontFamily: '\'JetBrains Mono\',monospace',
                  fontSize: '11.5px',
                  color: 'oklch(0.5 0.012 265)',
                }}>
                {show(version?.code)}
              </span>
              <span style={{ fontWeight: '600' }}>
                {show(version?.v)}
              </span>
              <span style={{
                  flex: '1',
                  minWidth: '0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'oklch(0.38 0.012 265)',
                }}>
                {show(version?.title)}
              </span>
              <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
                {show(version?.when)}
              </span>
            </button>
          </Fragment>))}
        </div>
      </>) : null}
      {' '}
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
        {'Activity'}
      </div>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          padding: '8px 0',
        }}>
        {asList(vm.cn?.log).map((entry, index) => (<Fragment key={index}>
          <div style={{
              display: 'flex',
              gap: '10px',
              padding: '8px 18px',
              fontSize: '13px',
              color: 'oklch(0.38 0.012 265)',
            }}>
            <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'oklch(0.75 0.01 265)',
                marginTop: '6px',
                flexShrink: '0',
              }} />
            <span style={{ flex: '1' }}>
              <span style={{ fontWeight: '600' }}>
                {show(entry?.who)}
              </span>
              {' · '}{show(entry?.text)}
            </span>
            <span style={{ color: 'oklch(0.58 0.01 265)', whiteSpace: 'nowrap' }}>
              {show(entry?.when)}
            </span>
          </div>
        </Fragment>))}
        {vm.cn?.noLog ? (<>
          <div style={{ padding: '16px 18px', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
            {'No changes yet.'}
          </div>
        </>) : null}
      </div>
      {' '}
    </>) : null}
    {' '}
  </>);
}
