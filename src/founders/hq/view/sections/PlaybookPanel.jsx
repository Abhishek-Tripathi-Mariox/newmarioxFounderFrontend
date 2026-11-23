/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function PlaybookPanel({ vm }) {
  return (<>
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        minWidth: '0',
      }}>
      {' '}
      {vm.cn?.notEdit ? (<>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.01em' }}>
            {show(vm.cn?.pb?.name)}
          </div>
          <div style={{ fontSize: '13.5px', color: 'oklch(0.42 0.012 265)', marginTop: '4px', lineHeight: '1.5' }}>
            {show(vm.cn?.pb?.desc)}
          </div>
          <div style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)', marginTop: '6px' }}>
            {show(vm.cn?.pb?.meta)}
          </div>
        </div>
      </>) : null}
      {' '}
      {vm.cn?.isEdit ? (<>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input value={inputValue(vm.cn?.pb?.name)} onChange={vm.cn?.pb?.onName} style={{
              height: '34px',
              padding: '0 10px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              fontSize: '17px',
              outline: 'none',
              minWidth: '0',
              background: '#fff',
              width: '100%',
              fontWeight: '700',
            }} />
          <textarea value={inputValue(vm.cn?.pb?.desc)} onChange={vm.cn?.pb?.onDesc} placeholder="What is this playbook for?" style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '8px',
              fontSize: '13.5px',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              fieldSizing: 'content',
              minHeight: '44px',
            }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <select value={inputValue(vm.cn?.pb?.cat)} onChange={vm.cn?.pb?.onCat} style={{
                height: '30px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                background: '#fff',
                fontSize: '12.5px',
                padding: '0 6px',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}>
              {asList(vm.cn?.pb?.catOpts).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
            <select value={inputValue(vm.cn?.pb?.country)} onChange={vm.cn?.pb?.onCountry} style={{
                height: '30px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                background: '#fff',
                fontSize: '12.5px',
                padding: '0 6px',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}>
              {asList(vm.cn?.pb?.countryOpts).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
          </div>
        </div>
      </>) : null}
      {' '}
      <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          padding: '10px 12px',
          borderRadius: '10px',
          background: 'oklch(0.975 0.004 85)',
        }}>
        <span style={{ fontSize: '13px', fontWeight: '600' }}>
          {'Company'}
        </span>
        <select value={inputValue(vm.cn?.pb?.co)} onChange={vm.cn?.pb?.onCo} style={{
            height: '32px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '7px',
            background: '#fff',
            fontSize: '12.5px',
            padding: '0 6px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            minWidth: '220px',
          }}>
          {asList(vm.cn?.pb?.coOpts).map((option, index) => (<Fragment key={index}>
            <option value={inputValue(option?.v)}>
              {show(option?.l)}
            </option>
          </Fragment>))}
        </select>
        {vm.cn?.pb?.needApply ? (<>
          <button onClick={vm.cn?.pb?.apply} style={{
              height: '32px',
              border: '0',
              background: 'var(--acc, oklch(0.5 0.17 265))',
              color: '#fff',
              borderRadius: '8px',
              padding: '0 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            {'Start for '}{show(vm.cn?.pb?.coName)}
          </button>
        </>) : null}
        <div style={{ flex: '1' }} />
        <button onClick={vm.cn?.pb?.applyAll} title="Apply to every open company in a matching country" style={{
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
          {'Apply to all matching'}
        </button>
        <button onClick={vm.cn?.pb?.copy} style={{
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
          {'Copy'}
        </button>
        <button onClick={vm.cn?.pb?.dup} style={{
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
        {vm.cn?.isEdit ? (<>
          <button onClick={vm.cn?.pb?.remove} style={{
              border: '0',
              background: 'none',
              color: 'oklch(0.5 0.18 25)',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            {'Delete'}
          </button>
        </>) : null}
      </div>
      {' '}
      {vm.cn?.pb?.hasRun ? (<>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ fontWeight: '600' }}>
              {show(vm.cn?.pb?.coName)}
            </span>
            <span style={inlineStyle(`font-weight:700;color:${attr(vm.cn?.pb?.pcol)}`)}>
              {show(vm.cn?.pb?.pct)}
            </span>
          </div>
          <span style={{
              display: 'block',
              height: '6px',
              background: 'oklch(0.94 0.005 85)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}>
            <span style={inlineStyle(`display:block;height:100%;width:${attr(vm.cn?.pb?.w)};background:${attr(vm.cn?.pb?.pcol)};border-radius:3px`)} />
          </span>
          <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
            {show(vm.cn?.pb?.prog)}
          </span>
        </div>
      </>) : null}
      {' '}
      {asList(vm.cn?.pb?.secs).map((section, index) => (<Fragment key={index}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {' '}
          <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 0 4px',
              borderBottom: '1px solid oklch(0.94 0.005 85)',
            }}>
            {vm.cn?.notEdit ? (<>
              <span style={{
                  flex: '1',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'oklch(0.45 0.012 265)',
                }}>
                {show(section?.title)}
              </span>
            </>) : null}
            {vm.cn?.isEdit ? (<>
              <input value={inputValue(section?.title)} onChange={section?.onTitle} style={{
                  flex: '1',
                  height: '30px',
                  border: '1px solid oklch(0.9 0.006 85)',
                  borderRadius: '7px',
                  padding: '0 8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  outline: 'none',
                }} />
              <button onClick={section?.removeSec} style={{
                  border: '0',
                  background: 'none',
                  color: 'oklch(0.5 0.18 25)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}>
                {'Remove section'}
              </button>
            </>) : null}
            <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
              {show(section?.n)}
            </span>
          </div>
          {' '}
          {asList(section?.steps).map((step, index) => (<Fragment key={index}>
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '7px 0',
                borderBottom: '1px solid oklch(0.965 0.004 85)',
              }}>
              {' '}
              {step?.canTick ? (<>
                <button onClick={step?.tick} style={inlineStyle(`width:19px;height:19px;margin-top:1px;border-radius:5px;border:1.5px solid ${attr(step?.cbd)};background:${attr(step?.cbg)};color:#fff;font-size:11px;cursor:pointer;padding:0;flex-shrink:0`)}>
                  {show(step?.mark)}
                </button>
              </>) : null}
              {' '}
              <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {' '}
                {vm.cn?.notEdit ? (<>
                  <span style={inlineStyle(`font-size:14px;text-decoration:${attr(step?.deco)};color:${attr(step?.col)};line-height:1.4`)}>
                    {show(step?.text)}
                  </span>
                  {step?.hasHelp ? (<>
                    <span style={{ fontSize: '12px', color: 'oklch(0.5 0.12 65)' }}>
                      {show(step?.help)}
                    </span>
                  </>) : null}
                </>) : null}
                {' '}
                {vm.cn?.isEdit ? (<>
                  <input data-step={step?.id} value={inputValue(step?.text)} onChange={step?.onText} placeholder="Step" style={{
                      height: '30px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      borderRadius: '7px',
                      padding: '0 8px',
                      fontSize: '13.5px',
                      outline: 'none',
                    }} />
                  <input value={inputValue(step?.help)} onChange={step?.onHelp} placeholder="Tip or warning (optional)" style={{
                      height: '28px',
                      border: '1px solid oklch(0.93 0.005 85)',
                      borderRadius: '7px',
                      padding: '0 8px',
                      fontSize: '12.5px',
                      outline: 'none',
                      color: 'oklch(0.45 0.012 265)',
                    }} />
                </>) : null}
                {' '}
                <span style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    fontSize: '11.5px',
                    color: 'oklch(0.52 0.012 265)',
                    flexWrap: 'wrap',
                  }}>
                  <button onClick={step?.toggleMust} style={inlineStyle(`border:0;background:none;padding:0;font-size:11.5px;font-weight:700;color:${attr(step?.mustFg)};cursor:pointer`)}>
                    {show(step?.mustLbl)}
                  </button>
                  {vm.cn?.notEdit ? (<>
                    <span>
                      {show(step?.ownerTxt)}
                    </span>
                    <span>
                      {show(step?.daysTxt)}
                    </span>
                  </>) : null}
                  {vm.cn?.isEdit ? (<>
                    <select value={inputValue(step?.owner)} onChange={step?.onOwner} style={{
                        height: '26px',
                        border: '1px solid oklch(0.9 0.006 85)',
                        borderRadius: '7px',
                        background: '#fff',
                        fontSize: '11.5px',
                        padding: '0 6px',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}>
                      {asList(step?.ownerOpts).map((option, index) => (<Fragment key={index}>
                        <option value={inputValue(option?.v)}>
                          {show(option?.l)}
                        </option>
                      </Fragment>))}
                    </select>
                    <input type="number" value={inputValue(step?.days)} onChange={step?.onDays} placeholder="days" style={{
                        width: '64px',
                        height: '26px',
                        border: '1px solid oklch(0.9 0.006 85)',
                        borderRadius: '6px',
                        padding: '0 6px',
                        fontSize: '11.5px',
                      }} />
                  </>) : null}
                  {step?.hasDone ? (<>
                    <span style={{ color: 'oklch(0.45 0.12 150)', fontWeight: '600' }}>
                      {'✓ '}{show(step?.doneTxt)}
                    </span>
                  </>) : null}
                </span>
                {' '}
              </div>
              {' '}
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: '0' }}>
                {step?.canTick ? (<>
                  <button onClick={step?.na} title="Not applicable for this company" style={{
                      border: '0',
                      background: 'none',
                      fontSize: '11.5px',
                      color: 'oklch(0.55 0.012 265)',
                      cursor: 'pointer',
                    }}>
                    {show(step?.naLbl)}
                  </button>
                </>) : null}
                <button onClick={step?.makeTask} title="Create a task from this step" style={{
                    height: '24px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    background: '#fff',
                    borderRadius: '7px',
                    padding: '0 8px',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: 'oklch(0.35 0.012 265)',
                  }}>
                  {'→ Task'}
                </button>
                {vm.cn?.isEdit ? (<>
                  <button onClick={step?.up} style={{ border: '0', background: 'none', cursor: 'pointer', color: 'oklch(0.6 0.01 265)' }}>
                    {'↑'}
                  </button>
                  <button onClick={step?.remove} style={{
                      border: '0',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'oklch(0.7 0.01 265)',
                      fontSize: '15px',
                    }}>
                    {'×'}
                  </button>
                </>) : null}
              </div>
              {' '}
            </div>
          </Fragment>))}
          {' '}
          {vm.cn?.isEdit ? (<>
            <button onClick={section?.addStep} style={{
                border: '0',
                background: 'none',
                textAlign: 'left',
                padding: '7px 0',
                fontSize: '12.5px',
                fontWeight: '600',
                color: 'var(--acc, oklch(0.5 0.17 265))',
                cursor: 'pointer',
              }}>
              {'+ Add step'}
            </button>
          </>) : null}
          {' '}
        </div>
      </Fragment>))}
      {' '}
      {vm.cn?.isEdit ? (<>
        <button onClick={vm.cn?.pb?.addSec} style={{
            border: '1px dashed oklch(0.85 0.008 85)',
            background: 'none',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'oklch(0.45 0.012 265)',
            cursor: 'pointer',
          }}>
          {'+ Add section'}
        </button>
      </>) : null}
      {' '}
      {vm.cn?.notEdit ? (<>
        <div style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
          {'Switch to Edit at the top to change steps. Steps marked with a tip are worth double-checking with your CA or lawyer.'}
        </div>
      </>) : null}
      {' '}
    </div>
  </>);
}
