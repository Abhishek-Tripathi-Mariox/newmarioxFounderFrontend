/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function Settings({ vm }) {
  return (<>
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
          {'Settings'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {'Changes save instantly and apply only to '}{show(vm.sx?.who)}{'\'s view.'}
        </div>
      </div>
      <button onClick={vm.sx?.reset} style={{
          height: '34px',
          border: '1px solid oklch(0.88 0.008 85)',
          background: '#fff',
          borderRadius: '8px',
          padding: '0 14px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          color: 'oklch(0.4 0.012 265)',
        }} className="scp10">
        {'Reset to default'}
      </button>
    </div>
    {' '}
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
      <div style={{ padding: '14px 20px', fontSize: '15px', fontWeight: '600' }}>
        {'Look & feel'}
      </div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '10px 24px',
          padding: '16px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          alignItems: 'start',
        }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {'Accent colour'}
          </div>
          <div style={{
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              marginTop: '3px',
              lineHeight: '1.45',
              textWrap: 'pretty',
            }}>
            {'Buttons, links and highlights.'}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            {asList(vm.sx?.accents).map((accent, index) => (<Fragment key={index}>
              <button onClick={accent?.go} title={accent?.label} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '7px',
                  border: '0',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '4px 0 0',
                  fontSize: '12px',
                  color: 'oklch(0.42 0.012 265)',
                }}>
                <span style={inlineStyle(`width:34px;height:34px;border-radius:50%;background:${attr(accent?.sw)};box-shadow:${attr(accent?.ring)}`)} />
                {show(accent?.label)}
              </button>
            </Fragment>))}
          </div>
        </div>
      </div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '10px 24px',
          padding: '16px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          alignItems: 'start',
        }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {'Sidebar colour'}
          </div>
          <div style={{
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              marginTop: '3px',
              lineHeight: '1.45',
              textWrap: 'pretty',
            }}>
            {'The dark panel on the left.'}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            {asList(vm.sx?.sides).map((side, index) => (<Fragment key={index}>
              <button onClick={side?.go} title={side?.label} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '7px',
                  border: '0',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '4px 0 0',
                  fontSize: '12px',
                  color: 'oklch(0.42 0.012 265)',
                }}>
                <span style={inlineStyle(`width:34px;height:34px;border-radius:50%;background:${attr(side?.sw)};box-shadow:${attr(side?.ring)}`)} />
                {show(side?.label)}
              </button>
            </Fragment>))}
          </div>
        </div>
      </div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '10px 24px',
          padding: '16px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          alignItems: 'start',
        }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {'Text size'}
          </div>
          <div style={{
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              marginTop: '3px',
              lineHeight: '1.45',
              textWrap: 'pretty',
            }}>
            {'Makes the whole portal bigger or smaller.'}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              width: 'fit-content',
            }}>
            {asList(vm.sx?.sizeSeg).map((segment, index) => (<Fragment key={index}>
              <button onClick={segment?.go} style={inlineStyle(`border:0;padding:6px 14px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
                {show(segment?.label)}
              </button>
            </Fragment>))}
          </div>
        </div>
      </div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '10px 24px',
          padding: '16px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          alignItems: 'start',
        }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {'Portal name'}
          </div>
          <div style={{
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              marginTop: '3px',
              lineHeight: '1.45',
              textWrap: 'pretty',
            }}>
            {'Shown at the top of the sidebar and in the page title bar.'}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input value={inputValue(vm.sx?.name)} onChange={vm.sx?.onName} placeholder="Founders HQ" style={{
                height: '36px',
                width: '100%',
                maxWidth: '320px',
                border: '1px solid oklch(0.88 0.008 85)',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '14px',
                outline: 'none',
                background: '#fff',
              }} />
            <input value={inputValue(vm.sx?.sub)} onChange={vm.sx?.onSub} placeholder="Subtitle, e.g. the founders' names" style={{
                height: '36px',
                width: '100%',
                maxWidth: '320px',
                border: '1px solid oklch(0.88 0.008 85)',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '14px',
                outline: 'none',
                background: '#fff',
              }} />
          </div>
        </div>
      </div>
    </div>
    {' '}
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
      <div style={{ padding: '14px 20px', fontSize: '15px', fontWeight: '600' }}>
        {'Sidebar pages'}
      </div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '10px 24px',
          padding: '16px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          alignItems: 'start',
        }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {'Show, hide, rename, reorder'}
          </div>
          <div style={{
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              marginTop: '3px',
              lineHeight: '1.45',
              textWrap: 'pretty',
            }}>
            {'Untick a page to hide it from the sidebar. Type a new name to rename it. Use the arrows to move it.'}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid oklch(0.92 0.005 85)',
              borderRadius: '10px',
              maxWidth: '520px',
            }}>
            {asList(vm.sx?.pages).map((page, index) => (<Fragment key={index}>
              <div style={inlineStyle(`display:grid;grid-template-columns:28px minmax(0,1fr) 64px;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid oklch(0.95 0.004 85);opacity:${attr(page?.rowOp)}`)}>
                {page?.canHide ? (<>
                  <button onClick={page?.toggle} title="Show or hide in sidebar" style={inlineStyle(`width:18px;height:18px;border-radius:5px;border:1.5px solid ${attr(page?.boxBd)};background:${attr(page?.boxBg)};color:#fff;font-size:11px;line-height:1;cursor:pointer;padding:0`)}>
                    {show(page?.mark)}
                  </button>
                </>) : null}
                {page?.locked ? (<>
                  <span title="Today is always shown" style={{ fontSize: '12px', color: 'oklch(0.6 0.01 265)', textAlign: 'center' }}>
                    {'●'}
                  </span>
                </>) : null}
                <input value={inputValue(page?.label)} onChange={page?.onLabel} placeholder={page?.def} style={{
                    height: '32px',
                    minWidth: '0',
                    border: '1px solid transparent',
                    borderRadius: '6px',
                    padding: '0 8px',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'transparent',
                  }} className="scp11 scp12" />
                <div style={{ display: 'flex', gap: '2px', justifyContent: 'flex-end' }}>
                  <button onClick={page?.up} title="Move up" style={inlineStyle(`width:28px;height:28px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:6px;cursor:pointer;font-size:12px;opacity:${attr(page?.upOp)}`)}>
                    {'↑'}
                  </button>
                  <button onClick={page?.down} title="Move down" style={inlineStyle(`width:28px;height:28px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:6px;cursor:pointer;font-size:12px;opacity:${attr(page?.downOp)}`)}>
                    {'↓'}
                  </button>
                </div>
              </div>
            </Fragment>))}
          </div>
        </div>
      </div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '10px 24px',
          padding: '16px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          alignItems: 'start',
        }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {'Open on start'}
          </div>
          <div style={{
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              marginTop: '3px',
              lineHeight: '1.45',
              textWrap: 'pretty',
            }}>
            {'The page you see when you open the portal.'}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <select value={inputValue(vm.sx?.start)} onChange={vm.sx?.onStart} style={{
              height: '36px',
              minWidth: '220px',
              border: '1px solid oklch(0.88 0.008 85)',
              borderRadius: '8px',
              padding: '0 10px',
              fontSize: '14px',
              background: '#fff',
              cursor: 'pointer',
            }}>
            {asList(vm.sx?.startOpts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
        </div>
      </div>
    </div>
    {' '}
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
      <div style={{ padding: '14px 20px', fontSize: '15px', fontWeight: '600' }}>
        {'My tasks'}
      </div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '10px 24px',
          padding: '16px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          alignItems: 'start',
        }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {'Default view'}
          </div>
          <div style={{
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              marginTop: '3px',
              lineHeight: '1.45',
              textWrap: 'pretty',
            }}>
            {'How the My tasks page opens.'}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              width: 'fit-content',
            }}>
            {asList(vm.sx?.viewSeg).map((segment, index) => (<Fragment key={index}>
              <button onClick={segment?.go} style={inlineStyle(`border:0;padding:6px 14px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
                {show(segment?.label)}
              </button>
            </Fragment>))}
          </div>
        </div>
      </div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '10px 24px',
          padding: '16px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          alignItems: 'start',
        }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {'Group by'}
          </div>
          <div style={{
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              marginTop: '3px',
              lineHeight: '1.45',
              textWrap: 'pretty',
            }}>
            {'Sections in the task list.'}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              width: 'fit-content',
            }}>
            {asList(vm.sx?.groupSeg).map((segment, index) => (<Fragment key={index}>
              <button onClick={segment?.go} style={inlineStyle(`border:0;padding:6px 14px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
                {show(segment?.label)}
              </button>
            </Fragment>))}
          </div>
        </div>
      </div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '10px 24px',
          padding: '16px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          alignItems: 'start',
        }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {'Sort by'}
          </div>
          <div style={{
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              marginTop: '3px',
              lineHeight: '1.45',
              textWrap: 'pretty',
            }}>
            {'Order inside each section.'}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              width: 'fit-content',
            }}>
            {asList(vm.sx?.sortSeg).map((segment, index) => (<Fragment key={index}>
              <button onClick={segment?.go} style={inlineStyle(`border:0;padding:6px 14px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
                {show(segment?.label)}
              </button>
            </Fragment>))}
          </div>
        </div>
      </div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '10px 24px',
          padding: '16px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          alignItems: 'start',
        }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {'Columns in list view'}
          </div>
          <div style={{
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              marginTop: '3px',
              lineHeight: '1.45',
              textWrap: 'pretty',
            }}>
            {'Turn off columns you don’t use to keep the list clean.'}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {asList(vm.sx?.cols).map((column, index) => (<Fragment key={index}>
              <button onClick={column?.go} style={inlineStyle(`height:34px;border:1px solid ${attr(column?.bd)};background:${attr(column?.bg)};color:${attr(column?.fg)};border-radius:17px;padding:0 14px 0 11px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:7px`)}>
                <span style={{ fontSize: '12px' }}>
                  {show(column?.mark)}
                </span>
                {show(column?.label)}
              </button>
            </Fragment>))}
          </div>
        </div>
      </div>
    </div>
    {' '}
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
      <div style={{ padding: '14px 20px', fontSize: '15px', fontWeight: '600' }}>
        {'Numbers'}
      </div>
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '10px 24px',
          padding: '16px 20px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          alignItems: 'start',
        }}>
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>
            {'Money format'}
          </div>
          <div style={{
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              marginTop: '3px',
              lineHeight: '1.45',
              textWrap: 'pretty',
            }}>
            {'How cash, revenue and costs are written.'}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2px',
              padding: '3px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '9px',
              width: 'fit-content',
            }}>
            {asList(vm.sx?.moneySeg).map((segment, index) => (<Fragment key={index}>
              <button onClick={segment?.go} style={inlineStyle(`border:0;padding:6px 14px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;background:${attr(segment?.bg)};color:${attr(segment?.fg)};box-shadow:${attr(segment?.sh)}`)}>
                {show(segment?.label)}
              </button>
            </Fragment>))}
          </div>
        </div>
      </div>
    </div>
    {' '}
  </>);
}
