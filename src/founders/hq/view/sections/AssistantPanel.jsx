/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function AssistantPanel({ vm }) {
  return (<>
    <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        bottom: '0',
        width: 'min(460px,100%)',
        zIndex: '60',
        background: '#fff',
        boxShadow: '-16px 0 48px oklch(0.2 0.03 265 / 0.18)',
        display: 'flex',
        flexDirection: 'column',
      }}>
      {' '}
      <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid oklch(0.94 0.005 85)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
        <span style={{
            width: '30px',
            height: '30px',
            borderRadius: '9px',
            background: 'oklch(0.24 0.035 265)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontSize: '14px',
          }}>
          {'✦'}
        </span>
        <div style={{ flex: '1', minWidth: '0' }}>
          <div style={{ fontSize: '15px', fontWeight: '600' }}>
            {'Founders AI'}
          </div>
          <div style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
            {'Knows every company, task, deal and rule · on '}{show(vm.ai7?.page)}
          </div>
        </div>
        {vm.ai7?.hasMsgs ? (<>
          <button onClick={vm.ai7?.clear} style={{
              height: '28px',
              border: '1px solid oklch(0.9 0.006 85)',
              background: '#fff',
              borderRadius: '7px',
              padding: '0 9px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.4 0.012 265)',
            }}>
            {'New chat'}
          </button>
        </>) : null}
        <button onClick={vm.ai7?.close} style={{
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
      {vm.ai7?.hasItem ? (<>
        <div style={{
            padding: '9px 18px',
            background: 'oklch(0.97 0.015 265)',
            borderBottom: '1px solid oklch(0.93 0.01 265)',
            fontSize: '12.5px',
            color: 'oklch(0.38 0.06 265)',
          }}>
          {'Looking at the '}{show(vm.ai7?.itemLbl)}
        </div>
      </>) : null}
      {' '}
      <div style={{
          flex: '1',
          overflowY: 'auto',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '14px',
        }}>
        {' '}
        {vm.ai7?.busy ? (<>
          <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              fontSize: '13px',
              color: 'oklch(0.5 0.012 265)',
            }}>
            <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'oklch(0.95 0.03 265)',
                color: 'var(--acc, oklch(0.5 0.17 265))',
                display: 'grid',
                placeItems: 'center',
                fontSize: '12px',
              }}>
              {'✦'}
            </span>
            {'Thinking…'}
          </div>
        </>) : null}
        {' '}
        {asList(vm.ai7?.msgs).map((message, index) => (<Fragment key={index}>
          <div style={inlineStyle(`display:flex;flex-direction:column;gap:8px;align-items:${attr(message?.align)}`)}>
            {' '}
            <div style={inlineStyle(`max-width:92%;padding:10px 13px;border-radius:12px;background:${attr(message?.bg)};color:${attr(message?.fg)};font-size:13.5px;line-height:1.55;white-space:pre-wrap;text-wrap:pretty`)}>
              {show(message?.text)}
            </div>
            {' '}
            {message?.hasActs ? (<>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {asList(message?.acts).map((action, index) => (<Fragment key={index}>
                  <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 11px',
                      border: '1px solid oklch(0.92 0.005 85)',
                      borderRadius: '10px',
                      background: 'oklch(0.985 0.003 85)',
                    }}>
                    <span style={inlineStyle(`font-size:10px;font-weight:700;letter-spacing:0.03em;padding:2px 7px;border-radius:5px;background:${attr(action?.tBg)};color:${attr(action?.tFg)};white-space:nowrap`)}>
                      {show(action?.tag)}
                    </span>
                    <span style={{ flex: '1', minWidth: '0' }}>
                      <span style={{
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontSize: '13px',
                          fontWeight: '600',
                          lineHeight: '1.35',
                        }}>
                        {show(action?.title)}
                      </span>
                      {action?.hasMeta ? (<>
                        <span style={{
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: '11.5px',
                            color: 'oklch(0.52 0.012 265)',
                          }}>
                          {show(action?.meta)}
                        </span>
                      </>) : null}
                    </span>
                    {action?.pending ? (<>
                      <button onClick={action?.run} style={{
                          height: '28px',
                          border: '0',
                          background: 'var(--acc, oklch(0.5 0.17 265))',
                          color: '#fff',
                          borderRadius: '7px',
                          padding: '0 10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}>
                        {show(action?.btn)}
                      </button>
                      <button onClick={action?.skip} title="Skip" style={{
                          border: '0',
                          background: 'none',
                          color: 'oklch(0.6 0.01 265)',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}>
                        {'×'}
                      </button>
                    </>) : null}
                    {action?.isDone ? (<>
                      <span style={inlineStyle(`font-size:12px;font-weight:600;color:${attr(action?.doneC)};white-space:nowrap`)}>
                        {show(action?.doneTxt)}
                      </span>
                    </>) : null}
                  </div>
                </Fragment>))}
                {message?.multi ? (<>
                  <button onClick={message?.runAll} style={{
                      alignSelf: 'flex-start',
                      height: '28px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      background: '#fff',
                      borderRadius: '7px',
                      padding: '0 10px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      color: 'oklch(0.35 0.012 265)',
                    }}>
                    {'Do all '}{show(message?.nPending)}
                  </button>
                </>) : null}
              </div>
            </>) : null}
            {' '}
          </div>
        </Fragment>))}
        {' '}
        {vm.ai7?.empty ? (<>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '19px', fontWeight: '600', letterSpacing: '-0.01em', lineHeight: '1.3' }}>
              {'Hi '}{show(vm.ai7?.me)}{'. What do you need?'}
            </div>
            <div style={{ fontSize: '13.5px', color: 'oklch(0.48 0.012 265)', lineHeight: '1.55' }}>
              {'Ask a question about any company, or tell me what to do. I suggest tasks, decisions, deals and goals, and you approve each one before it is saved.'}
            </div>
            <div style={{
                fontSize: '11.5px',
                fontWeight: '700',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'oklch(0.5 0.012 265)',
              }}>
              {'Suggested for '}{show(vm.ai7?.page)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {asList(vm.ai7?.sugg).map((suggestion, index) => (<Fragment key={index}>
                <button onClick={suggestion?.go} style={{
                    textAlign: 'left',
                    border: '1px solid oklch(0.91 0.006 85)',
                    background: '#fff',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    cursor: 'pointer',
                    color: 'oklch(0.3 0.012 265)',
                  }} className="scpf">
                  {show(suggestion?.t)}
                </button>
              </Fragment>))}
            </div>
          </div>
        </>) : null}
        {' '}
      </div>
      {' '}
      <div style={{
          padding: '12px 14px',
          borderTop: '1px solid oklch(0.94 0.005 85)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
        {vm.ai7?.hasQuick ? (<>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {asList(vm.ai7?.quick).map((quickPrompt, index) => (<Fragment key={index}>
              <button onClick={quickPrompt?.go} style={{
                  flexShrink: '0',
                  border: '1px solid oklch(0.9 0.006 85)',
                  background: '#fff',
                  borderRadius: '14px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: 'oklch(0.38 0.012 265)',
                  whiteSpace: 'nowrap',
                }} className="scpa">
                {show(quickPrompt?.t)}
              </button>
            </Fragment>))}
          </div>
        </>) : null}
        {vm.ai7?.hasErr ? (<>
          <span style={{ fontSize: '12px', color: 'oklch(0.5 0.18 25)' }}>
            {show(vm.ai7?.err)}
          </span>
        </>) : null}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <textarea data-ai7="" value={inputValue(vm.ai7?.q)} onChange={vm.ai7?.onQ} onKeyDown={vm.ai7?.onKey} placeholder="Ask anything, or paste meeting notes to turn into tasks" style={{
              flex: '1',
              minHeight: '44px',
              maxHeight: '180px',
              padding: '10px 12px',
              border: '1px solid oklch(0.88 0.008 85)',
              borderRadius: '10px',
              fontSize: '13.5px',
              lineHeight: '1.5',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              fieldSizing: 'content',
              boxSizing: 'border-box',
            }} className="scpc" />
          <button onClick={vm.ai7?.mic} title={vm.ai7?.micTip} style={inlineStyle(`height:44px;width:44px;border:1px solid oklch(0.88 0.008 85);border-radius:10px;background:${attr(vm.ai7?.micBg)};color:${attr(vm.ai7?.micFg)};font-size:16px;cursor:pointer;flex-shrink:0`)}>
            {'🎙'}
          </button>
          <button onClick={vm.ai7?.send} style={inlineStyle(`height:44px;width:44px;flex-shrink:0;border:0;border-radius:10px;background:var(--acc, oklch(0.5 0.17 265));color:#fff;font-size:17px;cursor:pointer;opacity:${attr(vm.ai7?.sendOp)}`)}>
            {'↑'}
          </button>
        </div>
        <span style={{ fontSize: '11px', color: 'oklch(0.58 0.01 265)' }}>
          {'Enter to send · Shift+Enter for a new line · AI can be wrong, so check numbers before deciding'}
        </span>
      </div>
      {' '}
    </div>
  </>);
}
