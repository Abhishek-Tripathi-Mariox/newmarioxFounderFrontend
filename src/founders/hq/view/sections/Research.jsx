/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';
import ResearchPanel from './ResearchPanel';

export default function Research({ vm }) {
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
          {'Research'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {show(vm.rs?.sub)}{' · One page per question: ask, collect, conclude.'}
        </div>
      </div>
      {' '}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={vm.rs?.copyList} title="Copy the items shown below as text" style={{
            height: '36px',
            border: '1px solid oklch(0.88 0.008 85)',
            background: '#fff',
            borderRadius: '8px',
            padding: '0 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'oklch(0.35 0.012 265)',
          }}>
          {'Copy list'}
        </button>
        <button onClick={vm.rs?.add} style={{
            height: '36px',
            border: '0',
            background: 'var(--acc, oklch(0.5 0.17 265))',
            color: '#fff',
            borderRadius: '8px',
            padding: '0 16px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
          {'+ New research'}
        </button>
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
      {asList(vm.rs?.coTabs).map((companyTab, index) => (<Fragment key={index}>
        <button onClick={companyTab?.go} style={inlineStyle(`display:flex;align-items:center;gap:8px;border:0;background:none;padding:10px 12px;margin-bottom:-1px;border-bottom:2px solid ${attr(companyTab?.bd)};font-size:13.5px;font-weight:600;color:${attr(companyTab?.fg)};cursor:pointer;white-space:nowrap`)}>
          {companyTab?.hasTile ? (<>
            <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(companyTab?.tile)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center`)}>
              {show(companyTab?.ini)}
            </span>
          </>) : null}
          {show(companyTab?.label)}
          <span title="Open questions" style={{
              fontSize: '11.5px',
              fontWeight: '600',
              padding: '1px 7px',
              borderRadius: '9px',
              background: 'oklch(0.95 0.005 85)',
              color: 'oklch(0.45 0.012 265)',
            }}>
            {show(companyTab?.n)}
          </span>
        </button>
      </Fragment>))}
      {vm.rs?.coMore?.has ? (<>
        <input list={vm.rs?.coMore?.id} onChange={vm.rs?.coMore?.on} placeholder={vm.rs?.coMore?.ph} style={{
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
        <datalist id={vm.rs?.coMore?.id}>
          {asList(vm.rs?.coMore?.opts).map((option, index) => (<Fragment key={index}>
            <option value={inputValue(option?.l)} />
          </Fragment>))}
        </datalist>
      </>) : null}
      {' '}
    </div>
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(118px,1fr))', gap: '10px' }}>
      {' '}
      {asList(vm.rs?.tiles).map((tile, index) => (<Fragment key={index}>
        <button onClick={tile?.go} title={tile?.tip} style={inlineStyle(`text-align:left;background:${attr(tile?.bg)};border:1.5px solid ${attr(tile?.bd)};border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:3px;cursor:pointer`)} className="scp1b">
          <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '12.5px',
              fontWeight: '500',
              color: 'oklch(0.42 0.012 265)',
            }}>
            <span style={inlineStyle(`width:8px;height:8px;border-radius:50%;background:${attr(tile?.dot)}`)} />
            {show(tile?.label)}
          </span>
          <span style={inlineStyle(`font-size:22px;font-weight:600;letter-spacing:-0.01em;color:${attr(tile?.color)}`)}>
            {show(tile?.n)}
          </span>
        </button>
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
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          padding: '10px 12px',
          borderBottom: '1px solid oklch(0.94 0.005 85)',
        }}>
        {' '}
        <input value={inputValue(vm.rs?.q)} onChange={vm.rs?.onQ} placeholder="Search questions, findings, sources, tags" style={{
            flex: '0 1 270px',
            minWidth: '160px',
            height: '32px',
            padding: '0 12px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '8px',
            fontSize: '13px',
            outline: 'none',
          }} />
        {' '}
        {asList(vm.rs?.filters).map((filter, index) => (<Fragment key={index}>
          <select value={inputValue(filter?.value)} onChange={filter?.onChange} style={inlineStyle(`height:32px;border:1px solid ${attr(filter?.bd)};background:${attr(filter?.bg)};color:${attr(filter?.fg)};border-radius:8px;padding:0 8px;font-size:13px;font-weight:500;cursor:pointer;outline:none;font-family:inherit`)}>
            {asList(filter?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
        </Fragment>))}
        {' '}
        {vm.rs?.anyFilter ? (<>
          <button onClick={vm.rs?.clear} style={{
              height: '32px',
              border: '0',
              background: 'none',
              padding: '0 6px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--acc, oklch(0.5 0.17 265))',
              cursor: 'pointer',
            }}>
            {'Clear filters'}
          </button>
        </>) : null}
        {' '}
        <div style={{ flex: '1' }} />
        {' '}
        {vm.rs?.isList ? (<>
          {asList(vm.rs?.viewSel).map((filter, index) => (<Fragment key={index}>
            <select value={inputValue(filter?.value)} onChange={filter?.onChange} style={inlineStyle(`height:32px;border:1px solid ${attr(filter?.bd)};background:${attr(filter?.bg)};color:${attr(filter?.fg)};border-radius:8px;padding:0 8px;font-size:13px;font-weight:500;cursor:pointer;outline:none;font-family:inherit`)}>
              {asList(filter?.opts).map((option, index) => (<Fragment key={index}>
                <option value={inputValue(option?.v)}>
                  {show(option?.l)}
                </option>
              </Fragment>))}
            </select>
          </Fragment>))}
        </>) : null}
        {' '}
        <div style={{
            display: 'flex',
            gap: '2px',
            padding: '3px',
            background: 'oklch(0.94 0.005 85)',
            borderRadius: '9px',
          }}>
          {asList(vm.rs?.viewSeg).map((option, index) => (<Fragment key={index}>
            <button onClick={option?.go} style={inlineStyle(`border:0;padding:4px 12px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(option?.bg)};color:${attr(option?.fg)};box-shadow:${attr(option?.sh)}`)}>
              {show(option?.label)}
            </button>
          </Fragment>))}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{
          padding: '8px 16px',
          fontSize: '12.5px',
          color: 'oklch(0.52 0.012 265)',
          borderBottom: '1px solid oklch(0.95 0.004 85)',
        }}>
        {show(vm.rs?.shown)}
      </div>
      {' '}
      {vm.rs?.isList ? (<>
        {' '}
        {asList(vm.rs?.groups).map((group, index) => (<Fragment key={index}>
          {' '}
          {group?.showHead ? (<>
            <button onClick={group?.toggle} style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '0',
                background: 'oklch(0.975 0.004 85)',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
                cursor: 'pointer',
                padding: '9px 16px',
                fontSize: '13.5px',
                fontWeight: '600',
                textAlign: 'left',
              }}>
              <span style={{ fontSize: '10px', color: 'oklch(0.52 0.012 265)', width: '12px' }}>
                {show(group?.caret)}
              </span>
              <span style={inlineStyle(`width:9px;height:9px;border-radius:50%;background:${attr(group?.dot)}`)} />
              {show(group?.label)}
              <span style={{ fontWeight: '500', color: 'oklch(0.52 0.012 265)' }}>
                {show(group?.count)}
              </span>
            </button>
          </>) : null}
          {' '}
          {group?.open ? (<>
            {asList(group?.rows).map((row, index) => (<Fragment key={index}>
              {' '}
              <button onClick={row?.go} style={inlineStyle(`width:100%;border:0;border-bottom:1px solid oklch(0.95 0.004 85);background:${attr(row?.selBg)};padding:12px 16px;display:flex;flex-direction:column;gap:6px;cursor:pointer;text-align:left`)} className="scp4">
                {' '}
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', width: '100%' }}>
                  <span style={inlineStyle(`display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:3px 9px;border-radius:7px;white-space:nowrap;background:${attr(row?.stTint)};color:${attr(row?.stInk)}`)}>
                    <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(row?.stDot)}`)} />
                    {show(row?.stLabel)}
                  </span>
                  <span style={inlineStyle(`flex:1 1 240px;min-width:0;font-size:14.5px;font-weight:600;color:${attr(row?.titleColor)}`)}>
                    {show(row?.title)}
                  </span>
                  <span title="Priority" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12px',
                      color: 'oklch(0.45 0.012 265)',
                    }}>
                    <span style={inlineStyle(`width:8px;height:8px;border-radius:2px;background:${attr(row?.priDot)}`)} />
                    {show(row?.pri)}
                  </span>
                  <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(row?.coTint)};color:${attr(row?.coInk)}`)}>
                    {show(row?.coName)}
                  </span>
                  <span title={row?.pname} style={inlineStyle(`width:22px;height:22px;border-radius:50%;background:${attr(row?.pbg)};color:#fff;font-size:8.5px;font-weight:600;display:grid;place-items:center`)}>
                    {show(row?.ini)}
                  </span>
                  <span style={inlineStyle(`font-size:12.5px;min-width:120px;text-align:right;white-space:nowrap;color:${attr(row?.whenColor)};font-weight:${attr(row?.whenW)}`)}>
                    {show(row?.when)}
                  </span>
                </span>
                {' '}
                {row?.hasQ ? (<>
                  <span style={{
                      fontSize: '13px',
                      color: 'oklch(0.42 0.012 265)',
                      lineHeight: '1.45',
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                    {show(row?.question)}
                  </span>
                </>) : null}
                {' '}
                {row?.hasConc ? (<>
                  <span style={{
                      fontSize: '13px',
                      color: 'oklch(0.38 0.1 150)',
                      lineHeight: '1.45',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                    {'Answer: '}{show(row?.conc)}
                  </span>
                </>) : null}
                {' '}
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    fontSize: '12px',
                    color: 'oklch(0.52 0.012 265)',
                  }}>
                  {asList(row?.tags).map((tag, index) => (<Fragment key={index}>
                    <span style={{
                        padding: '1px 8px',
                        borderRadius: '10px',
                        background: 'oklch(0.95 0.005 85)',
                        color: 'oklch(0.4 0.012 265)',
                        fontWeight: '600',
                      }}>
                      {'#'}{show(tag?.t)}
                    </span>
                  </Fragment>))}
                  <span>
                    {show(row?.meta)}
                  </span>
                  {row?.stale ? (<>
                    <span style={{ color: 'oklch(0.5 0.1 300)', fontWeight: '600' }}>
                      {'Stale'}
                    </span>
                  </>) : null}
                </span>
                {' '}
              </button>
              {' '}
            </Fragment>))}
          </>) : null}
          {' '}
        </Fragment>))}
        {' '}
      </>) : null}
      {' '}
      {vm.rs?.isCards ? (<>
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
            gap: '12px',
            padding: '12px',
          }}>
          {' '}
          {asList(vm.rs?.cards).map((card, index) => (<Fragment key={index}>
            <button onClick={card?.go} style={inlineStyle(`border:1px solid oklch(0.915 0.006 85);background:${attr(card?.selBg)};border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px;cursor:pointer;text-align:left;min-height:150px`)} className="scp3">
              <span style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <span style={inlineStyle(`display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:3px 9px;border-radius:7px;white-space:nowrap;background:${attr(card?.stTint)};color:${attr(card?.stInk)}`)}>
                  <span style={inlineStyle(`width:7px;height:7px;border-radius:50%;background:${attr(card?.stDot)}`)} />
                  {show(card?.stLabel)}
                </span>
                <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(card?.coTint)};color:${attr(card?.coInk)}`)}>
                  {show(card?.coName)}
                </span>
              </span>
              <span style={inlineStyle(`font-size:15px;font-weight:600;line-height:1.35;color:${attr(card?.titleColor)}`)}>
                {show(card?.title)}
              </span>
              {card?.hasQ ? (<>
                <span style={{
                    fontSize: '13px',
                    color: 'oklch(0.45 0.012 265)',
                    lineHeight: '1.45',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                  {show(card?.question)}
                </span>
              </>) : null}
              <span style={{ flex: '1' }} />
              <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  fontSize: '12px',
                  color: 'oklch(0.52 0.012 265)',
                }}>
                <span style={inlineStyle(`width:20px;height:20px;border-radius:50%;background:${attr(card?.pbg)};color:#fff;font-size:8px;font-weight:600;display:grid;place-items:center`)}>
                  {show(card?.ini)}
                </span>
                <span style={inlineStyle(`flex:1;color:${attr(card?.whenColor)};font-weight:${attr(card?.whenW)}`)}>
                  {show(card?.when)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={inlineStyle(`width:7px;height:7px;border-radius:2px;background:${attr(card?.priDot)}`)} />
                  {show(card?.pri)}
                </span>
              </span>
            </button>
          </Fragment>))}
          {' '}
        </div>
        {' '}
      </>) : null}
      {' '}
      {vm.rs?.empty ? (<>
        <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
          }}>
          <span style={{ fontSize: '15px', fontWeight: '600' }}>
            {show(vm.rs?.emptyTitle)}
          </span>
          <span style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', maxWidth: '440px', lineHeight: '1.5' }}>
            {'Start with a question you need answered, like "What do similar agencies charge?" Collect findings and sources, then write the answer.'}
          </span>
          {vm.rs?.emptyFilter ? (<>
            <button onClick={vm.rs?.clear} style={{
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
              {'Clear filters'}
            </button>
          </>) : null}
        </div>
      </>) : null}
      {' '}
    </div>
    {' '}
    {vm.rs?.has ? <ResearchPanel vm={vm} /> : null}
    {' '}
  </>);
}
