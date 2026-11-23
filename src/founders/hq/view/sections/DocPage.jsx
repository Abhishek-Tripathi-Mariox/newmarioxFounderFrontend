/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function DocPage({ vm }) {
  return (<>
    {' '}
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,740px) minmax(0,200px)',
        gap: '32px',
        justifyContent: 'center',
      }}>
      {' '}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: '0' }}>
        {' '}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '18px',
          }}>
          {' '}
          <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              color: 'oklch(0.52 0.012 265)',
              flexWrap: 'wrap',
            }}>
            <button onClick={vm.dc?.goHome} style={{
                border: '0',
                background: 'none',
                padding: '2px 4px',
                cursor: 'pointer',
                color: 'inherit',
                fontSize: '12.5px',
              }} className="scp2b">
              {'Docs'}
            </button>
            {asList(vm.dc?.path).map((crumb, index) => (<Fragment key={index}>
              <span>
                {'/'}
              </span>
              <button onClick={crumb?.go} style={{
                  border: '0',
                  background: 'none',
                  padding: '2px 4px',
                  cursor: 'pointer',
                  color: 'inherit',
                  fontSize: '12.5px',
                }} className="scp2b">
                {show(crumb?.title)}
              </button>
            </Fragment>))}
          </div>
          {' '}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={vm.dc?.toggleStar} style={inlineStyle(`height:30px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:7px;padding:0 11px;font-size:13px;font-weight:600;cursor:pointer;color:oklch(0.35 0.012 265);color:${attr(vm.dc?.pstarC)}`)}>
              {show(vm.dc?.pstar)}
            </button>
            <button onClick={vm.dc?.dupPage} style={{
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
            <button onClick={vm.dc?.copyPage} title="Copy as text" style={{
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
            <button onClick={vm.dc?.dlPage} title="Download as Markdown (.md)" style={{
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
              {'Download'}
            </button>
            <select value={inputValue(vm.dc?.moveVal)} onChange={vm.dc?.onMove} title="Move this page inside another page" style={{
                height: '30px',
                border: '1px solid oklch(0.9 0.006 85)',
                borderRadius: '7px',
                background: '#fff',
                fontSize: '12.5px',
                padding: '0 6px',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}>
              {asList(vm.dc?.moveOpts).map((moveOption, index) => (<Fragment key={index}>
                <option value={inputValue(moveOption?.v)}>
                  {show(moveOption?.l)}
                </option>
              </Fragment>))}
            </select>
            <button onClick={vm.dc?.removePage} title="Move to Trash (you can undo)" style={{
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
              {'Delete'}
            </button>
          </div>
          {' '}
        </div>
        {' '}
        <input data-ptitle="1" value={inputValue(vm.dc?.title)} onChange={vm.dc?.onTitle} onKeyDown={vm.dc?.onTitleKey} placeholder="Untitled" style={{
            border: '0',
            outline: 'none',
            fontSize: '38px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            padding: '0',
            width: '100%',
            background: 'transparent',
          }} />
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: '90px minmax(0,1fr)',
            gap: '6px 10px',
            margin: '16px 0 22px',
            paddingBottom: '16px',
            borderBottom: '1px solid oklch(0.94 0.005 85)',
            fontSize: '13px',
            color: 'oklch(0.52 0.012 265)',
            alignItems: 'center',
          }}>
          {' '}
          <span>
            {'Company'}
          </span>
          <div>
            <select value={inputValue(vm.dc?.pco)} onChange={vm.dc?.onPco} style={inlineStyle(`height:30px;border:1px solid oklch(0.9 0.006 85);border-radius:7px;background:#fff;font-size:12.5px;padding:0 6px;font-family:inherit;cursor:pointer;font-weight:600;background:${attr(vm.dc?.pcoTint)};color:${attr(vm.dc?.pcoInk)};border-color:transparent`)}>
              {asList(vm.dc?.pcoOpts).map((companyOption, index) => (<Fragment key={index}>
                <option value={inputValue(companyOption?.v)}>
                  {show(companyOption?.l)}
                </option>
              </Fragment>))}
            </select>
          </div>
          {' '}
          <span>
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
            {asList(vm.dc?.pstSeg).map((statusOption, index) => (<Fragment key={index}>
              <button onClick={statusOption?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(statusOption?.bg)};color:${attr(statusOption?.fg)};box-shadow:${attr(statusOption?.sh)}`)}>
                {show(statusOption?.label)}
              </button>
            </Fragment>))}
          </div>
          {' '}
          <span>
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
            {asList(vm.dc?.pbySeg).map((authorOption, index) => (<Fragment key={index}>
              <button onClick={authorOption?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(authorOption?.bg)};color:${attr(authorOption?.fg)};box-shadow:${attr(authorOption?.sh)}`)}>
                {show(authorOption?.label)}
              </button>
            </Fragment>))}
          </div>
          {' '}
          <span>
            {'Tags'}
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {asList(vm.dc?.ptags).map((tag, index) => (<Fragment key={index}>
              <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '26px',
                  padding: '0 4px 0 10px',
                  borderRadius: '13px',
                  background: 'oklch(0.95 0.005 85)',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: 'oklch(0.35 0.012 265)',
                }}>
                {'#'}{show(tag?.t)}
                <button onClick={tag?.remove} style={{
                    border: '0',
                    background: 'none',
                    cursor: 'pointer',
                    color: 'oklch(0.6 0.01 265)',
                    fontSize: '14px',
                    padding: '0 4px',
                  }}>
                  {'×'}
                </button>
              </span>
            </Fragment>))}
            <input value={inputValue(vm.dc?.ptag)} onChange={vm.dc?.onPtag} onKeyDown={vm.dc?.onPtagKey} placeholder="Add tag, press Enter" style={{
                height: '26px',
                width: '150px',
                border: '1px dashed oklch(0.85 0.008 85)',
                borderRadius: '13px',
                padding: '0 10px',
                fontSize: '12.5px',
                outline: 'none',
              }} />
            {asList(vm.dc?.ptagSugg).map((suggestion, index) => (<Fragment key={index}>
              <button onClick={suggestion?.go} style={{
                  border: '0',
                  background: 'none',
                  color: 'oklch(0.52 0.012 265)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '0 3px',
                }}>
                {'+'}{show(suggestion?.t)}
              </button>
            </Fragment>))}
          </div>
          {' '}
          <span>
            {'Info'}
          </span>
          <span>
            {show(vm.dc?.stats)}{' · '}{show(vm.dc?.updated)}{' · '}{show(vm.dc?.created)}
          </span>
          {' '}
        </div>
        {' '}
        {asList(vm.dc?.blocks).map((block, index) => (<Fragment key={index}>
          {' '}
          <div style={inlineStyle(`display:flex;align-items:flex-start;gap:2px;margin-top:${attr(block?.mt)};margin-left:-28px`)}>
            {' '}
            <div style={inlineStyle(`position:relative;width:26px;flex-shrink:0;padding-top:${attr(block?.ht)}`)}>
              {' '}
              <button onClick={block?.openMenu} title="Turn into or delete" style={{
                  width: '22px',
                  height: '22px',
                  border: '0',
                  background: 'none',
                  color: 'oklch(0.82 0.008 265)',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  fontSize: '12px',
                  lineHeight: '1',
                  padding: '0',
                  letterSpacing: '-2px',
                }} className="scp2c">
                {'⋮⋮'}
              </button>
              {' '}
              {block?.menuOpen ? (<>
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: '0',
                    zIndex: '30',
                    minWidth: '170px',
                    background: '#fff',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '10px',
                    boxShadow: '0 10px 28px oklch(0.2 0.02 265 / 0.14)',
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1px',
                  }}>
                  {asList(block?.menu).map((menuItem, menuIndex) => (<Fragment key={menuIndex}>
                    <button onClick={menuItem?.go} style={inlineStyle(`display:flex;align-items:center;justify-content:space-between;gap:10px;border:0;background:${attr(menuItem?.bg)};padding:7px 10px;border-radius:6px;font-size:13px;cursor:pointer;text-align:left;white-space:nowrap`)} className="scp2d">
                      <span>
                        {show(menuItem?.label)}
                      </span>
                      <span style={{ color: 'var(--acc, oklch(0.5 0.17 265))', fontSize: '12px' }}>
                        {show(menuItem?.mark)}
                      </span>
                    </button>
                  </Fragment>))}
                  <div style={{ height: '1px', background: 'oklch(0.93 0.005 85)', margin: '3px 0' }} />
                  <button onClick={block?.del} style={{
                      border: '0',
                      background: 'none',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'oklch(0.5 0.18 25)',
                    }} className="scp2e">
                    {'Delete'}
                  </button>
                </div>
              </>) : null}
              {' '}
            </div>
            {' '}
            {block?.isBullet ? (<>
              <span style={inlineStyle(`width:22px;flex-shrink:0;text-align:center;font-size:${attr(block?.fs)};line-height:${attr(block?.lh)};padding-top:3px`)}>
                {'•'}
              </span>
            </>) : null}
            {' '}
            {block?.isNum ? (<>
              <span style={inlineStyle(`min-width:24px;flex-shrink:0;text-align:right;padding:3px 4px 0 0;font-size:${attr(block?.fs)};line-height:${attr(block?.lh)}`)}>
                {show(block?.num)}{'.'}
              </span>
            </>) : null}
            {' '}
            {block?.isTodo ? (<>
              <span style={inlineStyle(`width:24px;flex-shrink:0;padding-top:${attr(block?.ct)};display:flex;justify-content:center`)}>
                <button onClick={block?.toggleCheck} style={inlineStyle(`width:16px;height:16px;border-radius:4px;border:1.5px solid ${attr(block?.checkBorder)};background:${attr(block?.checkBg)};color:#fff;font-size:10px;line-height:1;padding:0;cursor:pointer`)}>
                  {show(block?.mark)}
                </button>
              </span>
            </>) : null}
            {' '}
            {block?.isDivider ? (<>
              <div style={{ flex: '1', padding: '11px 0' }}>
                <div style={{ height: '1px', background: 'oklch(0.88 0.006 85)' }} />
              </div>
            </>) : null}
            {' '}
            {block?.isText ? (<>
              <div style={{ flex: '1', minWidth: '0', position: 'relative' }}>
                {' '}
                <textarea data-bid={block?.id} rows="1" value={inputValue(block?.text)} onChange={block?.onChange} onKeyDown={block?.onKey} onFocus={block?.onFocus} placeholder={block?.ph} style={inlineStyle(`display:block;width:100%;border:0;outline:none;resize:none;background:transparent;overflow:hidden;field-sizing:content;padding:3px 2px 3px ${attr(block?.pl)};font-size:${attr(block?.fs)};font-weight:${attr(block?.fw)};line-height:${attr(block?.lh)};letter-spacing:${attr(block?.ls)};text-decoration:${attr(block?.deco)};color:${attr(block?.color)};font-style:${attr(block?.fst)};border-left:${attr(block?.bl)}`)} />
                {' '}
                {block?.slashOpen ? (<>
                  <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: '0',
                      zIndex: '30',
                      minWidth: '170px',
                      background: '#fff',
                      border: '1px solid oklch(0.9 0.006 85)',
                      borderRadius: '10px',
                      boxShadow: '0 10px 28px oklch(0.2 0.02 265 / 0.14)',
                      padding: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1px',
                    }}>
                    {asList(block?.slash).map((slashItem, slashIndex) => (<Fragment key={slashIndex}>
                      <button onClick={slashItem?.go} style={inlineStyle(`display:flex;align-items:center;justify-content:space-between;gap:10px;border:0;background:${attr(slashItem?.bg)};padding:7px 10px;border-radius:6px;font-size:13px;cursor:pointer;text-align:left;white-space:nowrap`)} className="scp2d">
                        <span>
                          {show(slashItem?.label)}
                        </span>
                        <span style={{ color: 'var(--acc, oklch(0.5 0.17 265))', fontSize: '12px' }}>
                          {show(slashItem?.mark)}
                        </span>
                      </button>
                    </Fragment>))}
                  </div>
                </>) : null}
                {' '}
              </div>
            </>) : null}
            {' '}
          </div>
          {' '}
        </Fragment>))}
        {' '}
        <div onClick={vm.dc?.addBlockEnd} style={{ minHeight: '90px', cursor: 'text' }} />
        {' '}
        <div style={{ border: '1px solid oklch(0.92 0.005 85)', borderRadius: '10px', marginBottom: '18px' }}>
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderBottom: '1px solid oklch(0.94 0.005 85)',
            }}>
            <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
              {'Attached files'}
            </span>
            <label style={{
                height: '28px',
                border: '1px solid oklch(0.88 0.008 85)',
                background: '#fff',
                borderRadius: '7px',
                padding: '0 12px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}>
              <span>
                {'+ Attach files'}
              </span>
              <input type="file" multiple={true} onChange={vm.dc?.onAttach} style={{ display: 'none' }} />
            </label>
          </div>
          {asList(vm.dc?.attached).map((attachment, index) => (<Fragment key={index}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px',
                borderBottom: '1px solid oklch(0.96 0.004 85)',
              }}>
              <span style={inlineStyle(`width:30px;height:30px;border-radius:6px;background:${attr(attachment?.iconBg)};display:grid;place-items:center;font-size:9px;font-weight:700;color:${attr(attachment?.iconFg)};font-family:'JetBrains Mono',monospace;overflow:hidden`)}>
                {attachment?.hasThumb ? (<>
                  <span style={inlineStyle(`display:block;width:100%;height:100%;background-image:url(${attr(attachment?.thumb)});background-size:cover;background-position:center`)} />
                </>) : null}
                {attachment?.noThumb ? (<>
                  {show(attachment?.icon)}
                </>) : null}
              </span>
              <button onClick={attachment?.preview2} style={{
                  flex: '1',
                  minWidth: '0',
                  border: '0',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {show(attachment?.title)}
              </button>
              <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                {show(attachment?.meta)}
              </span>
              <button onClick={attachment?.open} style={{
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
                {'Download'}
              </button>
            </div>
          </Fragment>))}
        </div>
        {' '}
        {vm.dc?.hasSubs ? (<>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'oklch(0.55 0.012 265)', padding: '4px 0' }}>
              {'Pages inside'}
            </div>
            {asList(vm.dc?.subs).map((subpage, index) => (<Fragment key={index}>
              <button onClick={subpage?.go} style={{
                  border: '0',
                  background: 'none',
                  textAlign: 'left',
                  padding: '6px 6px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textDecorationColor: 'oklch(0.85 0.01 265)',
                  textUnderlineOffset: '3px',
                }} className="scp10">
                {show(subpage?.title)}
              </button>
            </Fragment>))}
          </div>
        </>) : null}
        {' '}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
            paddingTop: '14px',
            borderTop: '1px solid oklch(0.94 0.005 85)',
          }}>
          <button onClick={vm.dc?.addSub} style={{
              border: '0',
              background: 'none',
              fontSize: '13px',
              color: 'var(--acc, oklch(0.5 0.17 265))',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '0',
            }}>
            {'+ Add a page inside'}
          </button>
          <span style={{ fontSize: '12px', color: 'oklch(0.62 0.01 265)' }}>
            {'Type / for blocks, or # heading, - list, 1. numbered, [] to-do, > quote, --- divider'}
          </span>
        </div>
        {' '}
      </div>
      {' '}
      <div style={{
          position: 'sticky',
          top: '90px',
          alignSelf: 'start',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
        {vm.dc?.hasToc ? (<>
          <div style={{
              fontSize: '11.5px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'oklch(0.55 0.012 265)',
              paddingBottom: '4px',
            }}>
            {'On this page'}
          </div>
          {asList(vm.dc?.toc).map((heading, index) => (<Fragment key={index}>
            <button onClick={heading?.go} style={inlineStyle(`border:0;background:none;text-align:left;cursor:pointer;padding:3px 0 3px ${attr(heading?.pad)};font-size:12.5px;font-weight:${attr(heading?.fw)};color:oklch(0.42 0.012 265);line-height:1.4`)} className="scpd">
              {show(heading?.text)}
            </button>
          </Fragment>))}
        </>) : null}
      </div>
      {' '}
    </div>
    {' '}
  </>);
}
