/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';
import DocFiles from './DocFiles';
import DocsHome from './DocsHome';
import DocPage from './DocPage';

export default function Docs({ vm }) {
  return (<>
    {' '}
    {vm.dc?.hasNote ? (<>
      <div style={{
          background: 'oklch(0.96 0.03 150)',
          border: '1px solid oklch(0.88 0.06 150)',
          color: 'oklch(0.35 0.08 150)',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '13px',
        }}>
        {show(vm.dc?.note)}
      </div>
    </>) : null}
    {' '}
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px,250px) minmax(0,1fr)',
        background: '#fff',
        border: '1px solid oklch(0.915 0.006 85)',
        borderRadius: '12px',
        minHeight: 'calc(100vh - 150px)',
      }}>
      {' '}
      <div style={{
          background: 'oklch(0.975 0.004 85)',
          borderRight: '1px solid oklch(0.93 0.005 85)',
          borderRadius: '12px 0 0 12px',
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
        }}>
        {' '}
        <input value={inputValue(vm.dc?.q)} onChange={vm.dc?.onQ} placeholder="Search pages and files" style={{
            height: '32px',
            padding: '0 10px',
            border: '1px solid oklch(0.91 0.006 85)',
            borderRadius: '7px',
            background: '#fff',
            fontSize: '13px',
            outline: 'none',
            margin: '0 2px 10px',
          }} />
        {' '}
        <button onClick={vm.dc?.goHome} style={inlineStyle(`display:flex;justify-content:space-between;align-items:center;border:0;background:${attr(vm.dc?.homeBg)};text-align:left;padding:6px 8px;border-radius:6px;font-size:13.5px;cursor:pointer`)} className="scp28">
          <span>
            {'Home'}
          </span>
          <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
            {show(vm.dc?.pageCount)}{' pages'}
          </span>
        </button>
        {' '}
        <button onClick={vm.dc?.goFiles} style={inlineStyle(`display:flex;justify-content:space-between;align-items:center;border:0;background:${attr(vm.dc?.filesBg)};text-align:left;padding:6px 8px;border-radius:6px;font-size:13.5px;cursor:pointer`)} className="scp28">
          <span>
            {'Files'}
          </span>
          <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
            {show(vm.dc?.fileCount)}
          </span>
        </button>
        {' '}
        <button onClick={vm.dc?.goTrash} style={inlineStyle(`display:flex;justify-content:space-between;align-items:center;border:0;background:${attr(vm.dc?.trashBg)};text-align:left;padding:6px 8px;border-radius:6px;font-size:13.5px;cursor:pointer`)} className="scp28">
          <span>
            {'Trash'}
          </span>
          <span style={{ fontSize: '12px', color: 'oklch(0.55 0.012 265)' }}>
            {show(vm.dc?.trashCount)}
          </span>
        </button>
        {' '}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11.5px',
            fontWeight: '600',
            color: 'oklch(0.55 0.012 265)',
            padding: '16px 8px 4px',
          }}>
          <span>
            {'Pages'}
          </span>
          <button onClick={vm.dc?.addPage} title="New page" style={{
              border: '0',
              background: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              color: 'oklch(0.55 0.012 265)',
              padding: '0 2px',
            }}>
            {'+'}
          </button>
        </div>
        {' '}
        {asList(vm.dc?.tree).map((node, index) => (<Fragment key={index}>
          {' '}
          <div style={inlineStyle(`display:flex;align-items:center;gap:1px;border-radius:6px;padding-left:${attr(node?.pad)};background:${attr(node?.bg)}`)} className="scp28">
            {' '}
            <button onClick={node?.toggleExp} style={{
                width: '20px',
                height: '24px',
                flexShrink: '0',
                border: '0',
                background: 'none',
                color: 'oklch(0.55 0.012 265)',
                fontSize: '10px',
                cursor: 'pointer',
                padding: '0',
              }}>
              {show(node?.caret)}
            </button>
            {' '}
            <button onClick={node?.go} style={inlineStyle(`flex:1;min-width:0;border:0;background:none;text-align:left;padding:5px 2px;font-size:13.5px;font-weight:${attr(node?.fw)};color:${attr(node?.fg)};cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`)}>
              {show(node?.title)}
            </button>
            {' '}
            <span style={{ fontSize: '11px', color: 'oklch(0.7 0.15 75)' }}>
              {show(node?.star)}
            </span>
            {' '}
            <button onClick={node?.addSub} title="Add a page inside" style={{
                width: '22px',
                height: '22px',
                flexShrink: '0',
                border: '0',
                background: 'none',
                borderRadius: '5px',
                color: 'oklch(0.65 0.01 265)',
                fontSize: '15px',
                cursor: 'pointer',
                padding: '0',
              }} className="scp29">
              {'+'}
            </button>
            {' '}
          </div>
          {' '}
        </Fragment>))}
        {' '}
        <button onClick={vm.dc?.addPage} style={{
            border: '0',
            background: 'none',
            textAlign: 'left',
            padding: '6px 8px',
            borderRadius: '6px',
            fontSize: '13px',
            color: 'oklch(0.52 0.012 265)',
            cursor: 'pointer',
          }} className="scp28">
          {'+ New page'}
        </button>
        {' '}
        <label style={{
            marginTop: '10px',
            padding: '6px 8px',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'block',
            color: 'oklch(0.42 0.012 265)',
          }} className="scp28">
          <span>
            {'Import from Notion'}
          </span>
          <input type="file" multiple={true} accept=".md,.markdown,.txt,.csv" onChange={vm.dc?.onImport} style={{ display: 'none' }} />
        </label>
        {' '}
        <div style={{
            marginTop: 'auto',
            padding: '12px 8px 0',
            fontSize: '11.5px',
            color: 'oklch(0.55 0.012 265)',
            lineHeight: '1.45',
          }}>
          {show(vm.dc?.storage)}
        </div>
        {' '}
      </div>
      {' '}
      <div style={{ minWidth: '0', padding: '28px clamp(20px,4vw,48px) 80px' }}>
        {' '}
        {vm.dc?.isHome ? <DocsHome vm={vm} /> : null}
        {' '}
        {vm.dc?.isPage ? <DocPage vm={vm} /> : null}
        {' '}
        {vm.dc?.isFiles ? <DocFiles vm={vm} /> : null}
        {' '}
        {vm.dc?.isTrash ? (<>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '820px' }}>
            {' '}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
              <div>
                <div style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                  {'Trash'}
                </div>
                <div style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)', marginTop: '3px' }}>
                  {'Deleted pages and files stay here until you remove them for good.'}
                </div>
              </div>
              {vm.dc?.hasTrash ? (<>
                <button onClick={vm.dc?.emptyTrash} style={{
                    height: '34px',
                    border: '1px solid oklch(0.88 0.05 25)',
                    background: '#fff',
                    color: 'oklch(0.5 0.18 25)',
                    borderRadius: '8px',
                    padding: '0 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}>
                  {'Empty trash'}
                </button>
              </>) : null}
            </div>
            {' '}
            <div style={{ border: '1px solid oklch(0.915 0.006 85)', borderRadius: '12px', overflow: 'hidden' }}>
              {asList(vm.dc?.trash).map((trashedPage, index) => (<Fragment key={index}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderBottom: '1px solid oklch(0.95 0.004 85)',
                    flexWrap: 'wrap',
                  }}>
                  <div style={{ flex: '1 1 220px', minWidth: '0' }}>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                      {show(trashedPage?.title)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                      {show(trashedPage?.kind)}{' · '}{show(trashedPage?.when)}
                    </div>
                  </div>
                  <button onClick={trashedPage?.restore} style={{
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
                    {'Restore'}
                  </button>
                  <button onClick={trashedPage?.purge} style={{
                      border: '0',
                      background: 'none',
                      color: 'oklch(0.5 0.18 25)',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}>
                    {'Delete forever'}
                  </button>
                </div>
              </Fragment>))}
              {vm.dc?.noTrash ? (<>
                <div style={{
                    padding: '30px 16px',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: 'oklch(0.52 0.012 265)',
                  }}>
                  {'Trash is empty.'}
                </div>
              </>) : null}
            </div>
            {' '}
          </div>
          {' '}
        </>) : null}
        {' '}
      </div>
      {' '}
    </div>
    {' '}
  </>);
}
