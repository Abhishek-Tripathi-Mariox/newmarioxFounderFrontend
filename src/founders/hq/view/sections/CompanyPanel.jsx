/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function CompanyPanel({ vm }) {
  return (<>
    {' '}
    <div onClick={vm.cp?.close} style={{ position: 'fixed', inset: '0', background: 'oklch(0.2 0.02 265 / 0.25)', zIndex: '38' }} />
    {' '}
    <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        width: 'min(780px,100%)',
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
          flexWrap: 'wrap',
        }}>
        {' '}
        <span style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
          {'Companies / '}{show(vm.cp?.name)}
        </span>
        {' '}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {vm.cp?.isLive ? (<>
            <a href={vm.cp?.href} style={{
                height: '30px',
                border: '1px solid oklch(0.9 0.006 85)',
                background: '#fff',
                borderRadius: '7px',
                padding: '0 11px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                color: 'oklch(0.35 0.012 265)',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}>
              {'Open portal ↗'}
            </a>
          </>) : null}
          <button onClick={vm.cp?.goTasks} style={{
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
            {'Tasks'}
          </button>
          <button onClick={vm.cp?.goFin} style={{
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
            {'Finance'}
          </button>
          <button onClick={vm.cp?.goDocs} style={{
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
            {'Docs'}
          </button>
          <button onClick={vm.cp?.togglePin} style={{
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
            {show(vm.cp?.pin)}
          </button>
          <button onClick={vm.cp?.close} style={{
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
        </div>
        {' '}
      </div>
      {' '}
      <div style={{ flex: '1', overflowY: 'auto' }}>
        <div style={{
            maxWidth: '660px',
            margin: '0 auto',
            padding: '26px 30px 80px',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          }}>
          {' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <input value={inputValue(vm.cp?.iniVal)} onChange={vm.cp?.onIni} title="Initials" style={inlineStyle(`width:48px;height:48px;border-radius:12px;background:${attr(vm.cp?.bg)};color:#fff;font-size:19px;font-weight:700;text-align:center;border:0;outline:none`)} />
            <input value={inputValue(vm.cp?.name)} onChange={vm.cp?.onName} placeholder="Company name" style={{
                flex: '1',
                minWidth: '0',
                border: '0',
                outline: 'none',
                fontSize: '28px',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                background: 'transparent',
              }} />
          </div>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '8px' }}>
            {asList(vm.cp?.stats).map((stat, index) => (<Fragment key={index}>
              <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'oklch(0.975 0.004 85)' }}>
                <div style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
                  {show(stat?.l)}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '2px' }}>
                  {show(stat?.v)}
                </div>
              </div>
            </Fragment>))}
          </div>
          {' '}
          <div style={{
              display: 'grid',
              gridTemplateColumns: '150px minmax(0,1fr)',
              gap: '8px 12px',
              alignItems: 'center',
            }}>
            {' '}
            <span style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
              {'Status'}
            </span>
            <div style={{
                display: 'flex',
                gap: '2px',
                padding: '3px',
                background: 'oklch(0.94 0.005 85)',
                borderRadius: '9px',
                flexWrap: 'wrap',
                width: 'fit-content',
              }}>
              {asList(vm.cp?.statusSeg).map((option, index) => (<Fragment key={index}>
                <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                  {show(option?.label)}
                </button>
              </Fragment>))}
            </div>
            {' '}
            <span style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
              {'Owner'}
            </span>
            <div style={{
                display: 'flex',
                gap: '2px',
                padding: '3px',
                background: 'oklch(0.94 0.005 85)',
                borderRadius: '9px',
                flexWrap: 'wrap',
                width: 'fit-content',
              }}>
              {asList(vm.cp?.ownerSeg).map((option, index) => (<Fragment key={index}>
                <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
                  {show(option?.label)}
                </button>
              </Fragment>))}
            </div>
            {' '}
            <span style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
              {'Country & entity'}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select value={inputValue(vm.cp?.country)} onChange={vm.cp?.onCountry} style={{
                  height: '32px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '7px',
                  background: '#fff',
                  fontSize: '12.5px',
                  padding: '0 6px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}>
                {asList(vm.cp?.countryOpts).map((option, index) => (<Fragment key={index}>
                  <option value={inputValue(option?.v)}>
                    {show(option?.l)}
                  </option>
                </Fragment>))}
              </select>
              <select value={inputValue(vm.cp?.entity)} onChange={vm.cp?.onEntity} style={{
                  height: '32px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '7px',
                  background: '#fff',
                  fontSize: '12.5px',
                  padding: '0 6px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}>
                {asList(vm.cp?.entityOpts).map((option, index) => (<Fragment key={index}>
                  <option value={inputValue(option?.v)}>
                    {show(option?.l)}
                  </option>
                </Fragment>))}
              </select>
            </div>
            {' '}
            {asList(vm.cp?.fields).map((field, index) => (<Fragment key={index}>
              <span style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
                {show(field?.label)}
              </span>
              <input type={field?.type} value={inputValue(field?.value)} onChange={field?.onChange} placeholder={field?.ph} style={{
                  height: '32px',
                  padding: '0 10px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  outline: 'none',
                  minWidth: '0',
                  background: '#fff',
                  width: '100%',
                  fontFamily: 'inherit',
                }} />
            </Fragment>))}
            {' '}
            <span style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
              {'Colour'}
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {asList(vm.cp?.hues).map((swatch, index) => (<Fragment key={index}>
                <button onClick={swatch?.go} style={inlineStyle(`width:22px;height:22px;border-radius:50%;border:0;background:${attr(swatch?.sw)};box-shadow:${attr(swatch?.ring)};cursor:pointer`)} />
              </Fragment>))}
            </div>
            {' '}
          </div>
          {' '}
          <div style={{ border: '1px solid oklch(0.92 0.005 85)', borderRadius: '12px', overflow: 'hidden' }}>
            {' '}
            <div style={{
                padding: '12px 14px',
                borderBottom: '1px solid oklch(0.94 0.005 85)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
              <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}>
                <span style={{ fontSize: '14.5px', fontWeight: '600' }}>
                  {'Setup checklist'}
                </span>
                <select value={inputValue(vm.cp?.applyV)} onChange={vm.cp?.onApply} style={{
                    height: '30px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '7px',
                    background: '#fff',
                    fontSize: '12.5px',
                    padding: '0 6px',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}>
                  {asList(vm.cp?.applyOpts).map((option, index) => (<Fragment key={index}>
                    <option value={inputValue(option?.v)}>
                      {show(option?.l)}
                    </option>
                  </Fragment>))}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ flex: '1' }}>
                  <span style={{
                      display: 'block',
                      height: '6px',
                      background: 'oklch(0.94 0.005 85)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                    <span style={inlineStyle(`display:block;height:100%;width:${attr(vm.cp?.w)};background:${attr(vm.cp?.pcol)};border-radius:3px`)} />
                  </span>
                </span>
                <span style={inlineStyle(`font-size:13px;font-weight:700;color:${attr(vm.cp?.pcol)}`)}>
                  {show(vm.cp?.pct)}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                {show(vm.cp?.setupTxt)}
              </span>
            </div>
            {' '}
            {asList(vm.cp?.runs).map((run, index) => (<Fragment key={index}>
              <div style={{ borderBottom: '1px solid oklch(0.95 0.004 85)' }}>
                {' '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px' }}>
                  <button onClick={run?.toggle} style={{
                      flex: '1',
                      minWidth: '0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      border: '0',
                      background: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: '0',
                    }}>
                    <span style={{ fontSize: '10px', color: 'oklch(0.52 0.012 265)', width: '12px' }}>
                      {show(run?.caret)}
                    </span>
                    <span style={{ flex: '1', minWidth: '0' }}>
                      <span style={{ display: 'block', fontSize: '13.5px', fontWeight: '600' }}>
                        {show(run?.name)}
                      </span>
                      <span style={{ display: 'block', fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                        {show(run?.txt)}
                      </span>
                    </span>
                    <span style={{ width: '90px' }}>
                      <span style={{
                          display: 'block',
                          height: '6px',
                          background: 'oklch(0.94 0.005 85)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}>
                        <span style={inlineStyle(`display:block;height:100%;width:${attr(run?.w)};background:${attr(run?.pcol)};border-radius:3px`)} />
                      </span>
                    </span>
                    <span style={inlineStyle(`font-size:12.5px;font-weight:700;color:${attr(run?.pcol)};min-width:36px;text-align:right`)}>
                      {show(run?.pct)}
                    </span>
                  </button>
                  <button onClick={run?.openPb} title="Open in Constitution" style={{
                      height: '26px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      background: '#fff',
                      borderRadius: '7px',
                      padding: '0 11px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      color: 'oklch(0.35 0.012 265)',
                    }}>
                    {'Open'}
                  </button>
                  <button onClick={run?.remove} title="Remove playbook" style={{
                      border: '0',
                      background: 'none',
                      color: 'oklch(0.7 0.01 265)',
                      fontSize: '15px',
                      cursor: 'pointer',
                    }}>
                    {'×'}
                  </button>
                </div>
                {' '}
                {run?.open ? (<>
                  <div style={{ padding: '0 14px 10px 36px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {asList(run?.secs).map((section, index) => (<Fragment key={index}>
                      <div>
                        <div style={{
                            fontSize: '11.5px',
                            fontWeight: '600',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: 'oklch(0.55 0.012 265)',
                            padding: '6px 0 2px',
                          }}>
                          {show(section?.title)}
                        </div>
                        {asList(section?.steps).map((step, index) => (<Fragment key={index}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0' }}>
                            <button onClick={step?.tick} style={inlineStyle(`width:18px;height:18px;border-radius:5px;border:1.5px solid ${attr(step?.bd)};background:${attr(step?.bg)};color:#fff;font-size:11px;cursor:pointer;padding:0;flex-shrink:0`)}>
                              {show(step?.mark)}
                            </button>
                            <span style={inlineStyle(`flex:1;font-size:13.5px;text-decoration:${attr(step?.deco)};color:${attr(step?.col)}`)}>
                              {show(step?.text)}
                            </span>
                            <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)', whiteSpace: 'nowrap' }}>
                              {show(step?.meta)}
                            </span>
                            <button onClick={step?.na} style={{
                                border: '0',
                                background: 'none',
                                fontSize: '11.5px',
                                color: 'oklch(0.55 0.012 265)',
                                cursor: 'pointer',
                              }}>
                              {show(step?.naLbl)}
                            </button>
                          </div>
                        </Fragment>))}
                      </div>
                    </Fragment>))}
                  </div>
                </>) : null}
                {' '}
              </div>
            </Fragment>))}
            {' '}
          </div>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'oklch(0.52 0.012 265)',
              }}>
              {'Notes'}
            </span>
            <textarea value={inputValue(vm.cp?.notes)} onChange={vm.cp?.onNotes} placeholder="Shareholders, key contacts, bank details, anything to remember" style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '1.55',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                fieldSizing: 'content',
                minHeight: '80px',
              }} />
          </div>
          {' '}
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              paddingTop: '14px',
              borderTop: '1px solid oklch(0.94 0.005 85)',
              flexWrap: 'wrap',
            }}>
            <span style={{ fontSize: '12px', color: 'oklch(0.6 0.01 265)' }}>
              {show(vm.cp?.created)}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={vm.cp?.archive} style={{
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
                {'Mark closed'}
              </button>
              <button onClick={vm.cp?.remove} style={{
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
                {'Delete company'}
              </button>
            </div>
          </div>
          {' '}
        </div>
      </div>
      {' '}
    </div>
    {' '}
  </>);
}
