/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function ScorecardTable({ vm }) {
  return (<>
    <div style={{
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        overflow: 'auto',
      }}>
      <div style={{ minWidth: 'max-content' }}>
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: '290px 96px repeat(13,62px) 130px',
            background: 'oklch(0.975 0.004 85)',
            borderBottom: '1px solid oklch(0.93 0.005 85)',
            fontSize: '11.5px',
            fontWeight: '600',
            color: 'oklch(0.5 0.012 265)',
          }}>
          <span style={{
              padding: '10px 16px',
              position: 'sticky',
              left: '0',
              background: 'oklch(0.975 0.004 85)',
              zIndex: '1',
            }}>
            {'Metric'}
          </span>
          <span style={{ padding: '10px 8px' }}>
            {'Goal'}
          </span>
          {asList(vm.sc?.weeks).map((week, index) => (<Fragment key={index}>
            <span style={inlineStyle(`padding:10px 4px;text-align:center;background:${attr(week?.bg)};font-weight:${attr(week?.fw)}`)}>
              {show(week?.lbl)}
            </span>
          </Fragment>))}
          <span style={{ padding: '10px 8px' }}>
            {'Trend'}
          </span>
        </div>
        {' '}
        {asList(vm.sc?.rows).map((row, index) => (<Fragment key={index}>
          <div style={{
              display: 'grid',
              gridTemplateColumns: '290px 96px repeat(13,62px) 130px',
              borderBottom: '1px solid oklch(0.95 0.004 85)',
              alignItems: 'center',
            }}>
            {' '}
            <div style={{
                padding: '8px 16px',
                position: 'sticky',
                left: '0',
                background: '#fff',
                zIndex: '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                minWidth: '0',
              }}>
              {' '}
              {vm.sc?.notEdit ? (<>
                <span style={{
                    fontSize: '13.5px',
                    fontWeight: '600',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  {show(row?.name)}
                </span>
                <span style={{ fontSize: '11.5px', color: 'oklch(0.55 0.012 265)' }}>
                  {show(row?.sub)}
                </span>
              </>) : null}
              {' '}
              {vm.sc?.isEdit ? (<>
                <input value={inputValue(row?.name)} onChange={row?.onName} style={{
                    height: '30px',
                    padding: '0 10px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    outline: 'none',
                    background: '#fff',
                    minWidth: '0',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    fontWeight: '600',
                    width: '100%',
                  }} />
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <select value={inputValue(row?.unit?.value)} onChange={row?.unit?.onChange} style={{
                      height: '28px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      borderRadius: '7px',
                      background: '#fff',
                      fontSize: '12px',
                      padding: '0 4px',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      minWidth: '0',
                      maxWidth: '100%',
                    }}>
                    {asList(row?.unit?.opts).map((option, index) => (<Fragment key={index}>
                      <option value={inputValue(option?.v)}>
                        {show(option?.l)}
                      </option>
                    </Fragment>))}
                  </select>
                  <select value={inputValue(row?.dir?.value)} onChange={row?.dir?.onChange} style={{
                      height: '28px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      borderRadius: '7px',
                      background: '#fff',
                      fontSize: '12px',
                      padding: '0 4px',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      minWidth: '0',
                      maxWidth: '100%',
                    }}>
                    {asList(row?.dir?.opts).map((option, index) => (<Fragment key={index}>
                      <option value={inputValue(option?.v)}>
                        {show(option?.l)}
                      </option>
                    </Fragment>))}
                  </select>
                  <select value={inputValue(row?.src?.value)} onChange={row?.src?.onChange} style={{
                      height: '28px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      borderRadius: '7px',
                      background: '#fff',
                      fontSize: '12px',
                      padding: '0 4px',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      minWidth: '0',
                      maxWidth: '100%',
                    }}>
                    {asList(row?.src?.opts).map((option, index) => (<Fragment key={index}>
                      <option value={inputValue(option?.v)}>
                        {show(option?.l)}
                      </option>
                    </Fragment>))}
                  </select>
                  <select value={inputValue(row?.owner?.value)} onChange={row?.owner?.onChange} style={{
                      height: '28px',
                      border: '1px solid oklch(0.9 0.006 85)',
                      borderRadius: '7px',
                      background: '#fff',
                      fontSize: '12px',
                      padding: '0 4px',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      minWidth: '0',
                      maxWidth: '100%',
                    }}>
                    {asList(row?.owner?.opts).map((option, index) => (<Fragment key={index}>
                      <option value={inputValue(option?.v)}>
                        {show(option?.l)}
                      </option>
                    </Fragment>))}
                  </select>
                  <button onClick={row?.up} title="Move up" style={{ border: '0', background: 'none', cursor: 'pointer', color: 'oklch(0.55 0.01 265)' }}>
                    {'↑'}
                  </button>
                  <button onClick={row?.remove} title="Remove" style={{
                      border: '0',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'oklch(0.5 0.18 25)',
                      fontSize: '15px',
                    }}>
                    {'×'}
                  </button>
                </div>
              </>) : null}
              {' '}
            </div>
            {' '}
            <div style={{ padding: '6px 8px' }}>
              {vm.sc?.notEdit ? (<>
                <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'oklch(0.4 0.012 265)' }}>
                  {show(row?.goal)}
                </span>
              </>) : null}
              {vm.sc?.isEdit ? (<>
                <input type="number" value={inputValue(row?.goalV)} onChange={row?.onGoal} placeholder="Goal" style={{
                    height: '30px',
                    padding: '0 10px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    outline: 'none',
                    background: '#fff',
                    minWidth: '0',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    width: '80px',
                  }} />
              </>) : null}
            </div>
            {' '}
            {asList(row?.cells).map((cell, index) => (<Fragment key={index}>
              <div style={{ padding: '4px 3px' }}>
                {cell?.manual ? (<>
                  <input type="number" value={inputValue(cell?.v)} onChange={cell?.on} style={inlineStyle(`width:100%;height:30px;border:1px solid oklch(0.92 0.005 85);border-radius:6px;background:${attr(cell?.bg)};color:${attr(cell?.fg)};font-size:12.5px;font-weight:600;text-align:center;outline:none;font-family:inherit;box-sizing:border-box;padding:0 2px`)} className="scpc" />
                </>) : null}
                {cell?.auto ? (<>
                  <span title="Calculated automatically" style={inlineStyle(`display:grid;place-items:center;height:30px;border-radius:6px;background:${attr(cell?.bg)};color:${attr(cell?.fg)};font-size:12.5px;font-weight:600`)}>
                    {show(cell?.txt)}
                  </span>
                </>) : null}
              </div>
            </Fragment>))}
            {' '}
            <div style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '20px' }}>
                {asList(row?.bars).map((bar, index) => (<Fragment key={index}>
                  <span style={inlineStyle(`flex:1;height:${attr(bar?.h)};background:${attr(bar?.c)};border-radius:1px`)} />
                </Fragment>))}
              </span>
              <span style={{ fontSize: '11px', color: 'oklch(0.52 0.012 265)', whiteSpace: 'nowrap' }}>
                {show(row?.hitTxt)}
              </span>
            </div>
            {' '}
          </div>
        </Fragment>))}
        {' '}
      </div>
    </div>
  </>);
}
