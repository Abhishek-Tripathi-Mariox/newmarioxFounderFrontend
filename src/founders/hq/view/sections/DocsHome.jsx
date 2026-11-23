/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function DocsHome({ vm }) {
  return (<>
    {' '}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
            {'Docs & files'}
          </div>
          <div style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)', marginTop: '3px' }}>
            {'Notes, SOPs, proposals and every file for all three companies.'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <label style={{
              height: '34px',
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
            }}>
            <span>
              {'Upload files'}
            </span>
            <input type="file" multiple={true} onChange={vm.dc?.onUpload} style={{ display: 'none' }} />
          </label>
          <button onClick={vm.dc?.addPage} style={{
              height: '34px',
              border: '0',
              background: 'var(--acc, oklch(0.5 0.17 265))',
              color: '#fff',
              borderRadius: '8px',
              padding: '0 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            {'+ New page'}
          </button>
        </div>
      </div>
      {' '}
      {vm.dc?.searching ? (<>
        <div style={{ fontSize: '15px', fontWeight: '600' }}>
          {show(vm.dc?.searchTxt)}
        </div>
      </>) : null}
      {' '}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'oklch(0.52 0.012 265)',
          }}>
          {'Start from a template'}
        </div>
        {' '}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '8px' }}>
          {asList(vm.dc?.tpls).map((template, index) => (<Fragment key={index}>
            <button onClick={template?.go} style={{
                border: '1px solid oklch(0.915 0.006 85)',
                background: '#fff',
                borderRadius: '10px',
                padding: '11px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
              }} className="scpa">
              <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                {show(template?.name)}
              </span>
              <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)', lineHeight: '1.4' }}>
                {show(template?.desc)}
              </span>
            </button>
          </Fragment>))}
        </div>
        {' '}
      </div>
      {' '}
      {vm.dc?.hasStarred ? (<>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'oklch(0.52 0.012 265)',
            }}>
            {'★ Starred'}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {asList(vm.dc?.starred).map((starredDoc, index) => (<Fragment key={index}>
              <button onClick={starredDoc?.go} style={{
                  height: '34px',
                  border: '1px solid oklch(0.915 0.006 85)',
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '0 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                <span style={inlineStyle(`font-size:11px;font-weight:600;padding:1px 6px;border-radius:4px;background:${attr(starredDoc?.coTint)};color:${attr(starredDoc?.coInk)}`)}>
                  {show(starredDoc?.coName)}
                </span>
                {show(starredDoc?.title)}
              </button>
            </Fragment>))}
          </div>
        </div>
      </>) : null}
      {' '}
      <div style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '1px solid oklch(0.915 0.006 85)',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}>
        {asList(vm.dc?.coTabs).map((companyTab, index) => (<Fragment key={index}>
          <button onClick={companyTab?.go} style={inlineStyle(`display:flex;align-items:center;gap:8px;border:0;background:none;padding:9px 11px;margin-bottom:-1px;border-bottom:2px solid ${attr(companyTab?.bd)};font-size:13.5px;font-weight:600;color:${attr(companyTab?.fg)};cursor:pointer;white-space:nowrap`)}>
            {companyTab?.hasTile ? (<>
              <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(companyTab?.tile)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center`)}>
                {show(companyTab?.ini)}
              </span>
            </>) : null}
            {show(companyTab?.label)}
          </button>
        </Fragment>))}
        {vm.dc?.coMore?.has ? (<>
          <input list={vm.dc?.coMore?.id} onChange={vm.dc?.coMore?.on} placeholder={vm.dc?.coMore?.ph} style={{
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
          <datalist id={vm.dc?.coMore?.id}>
            {asList(vm.dc?.coMore?.opts).map((option, index) => (<Fragment key={index}>
              <option value={inputValue(option?.l)} />
            </Fragment>))}
          </datalist>
        </>) : null}
      </div>
      {' '}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{
            display: 'flex',
            gap: '2px',
            padding: '3px',
            background: 'oklch(0.94 0.005 85)',
            borderRadius: '9px',
            flexWrap: 'wrap',
            width: 'fit-content',
          }}>
          {asList(vm.dc?.kindSeg).map((kindOption, index) => (<Fragment key={index}>
            <button onClick={kindOption?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(kindOption?.bg)};color:${attr(kindOption?.fg)};box-shadow:${attr(kindOption?.sh)}`)}>
              {show(kindOption?.label)}
            </button>
          </Fragment>))}
        </div>
        {asList(vm.dc?.filters).map((filter, index) => (<Fragment key={index}>
          <select value={inputValue(filter?.value)} onChange={filter?.onChange} style={inlineStyle(`height:32px;border:1px solid ${attr(filter?.bd)};background:${attr(filter?.bg)};color:${attr(filter?.fg)};border-radius:8px;padding:0 8px;font-size:13px;font-weight:500;cursor:pointer;outline:none;font-family:inherit`)}>
            {asList(filter?.opts).map((option, optionIndex) => (<Fragment key={optionIndex}>
              <option value={inputValue(option?.v)}>
                {show(option?.l)}
              </option>
            </Fragment>))}
          </select>
        </Fragment>))}
        {vm.dc?.anyFilter ? (<>
          <button onClick={vm.dc?.clear} style={{
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
        <div style={{ flex: '1' }} />
        <select value={inputValue(vm.dc?.sortSel?.value)} onChange={vm.dc?.sortSel?.onChange} style={{
            height: '32px',
            border: '1px solid oklch(0.9 0.006 85)',
            borderRadius: '7px',
            background: '#fff',
            fontSize: '12.5px',
            padding: '0 6px',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}>
          {asList(vm.dc?.sortSel?.opts).map((sortOption, index) => (<Fragment key={index}>
            <option value={inputValue(sortOption?.v)}>
              {show(sortOption?.l)}
            </option>
          </Fragment>))}
        </select>
        <div style={{
            display: 'flex',
            gap: '2px',
            padding: '3px',
            background: 'oklch(0.94 0.005 85)',
            borderRadius: '9px',
            flexWrap: 'wrap',
            width: 'fit-content',
          }}>
          {asList(vm.dc?.viewSeg).map((viewOption, index) => (<Fragment key={index}>
            <button onClick={viewOption?.go} style={inlineStyle(`border:0;padding:4px 11px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(viewOption?.bg)};color:${attr(viewOption?.fg)};box-shadow:${attr(viewOption?.sh)}`)}>
              {show(viewOption?.label)}
            </button>
          </Fragment>))}
        </div>
      </div>
      {' '}
      <div style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
        {show(vm.dc?.shown)}
      </div>
      {' '}
      {vm.dc?.isGrid ? (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: '12px' }}>
          {asList(vm.dc?.items).map((item, index) => (<Fragment key={index}>
            <div style={{
                border: '1px solid oklch(0.915 0.006 85)',
                borderRadius: '12px',
                background: '#fff',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }} className="scp2a">
              {' '}
              {item?.isFile ? (<>
                <button onClick={item?.toggleSel} title="Select" style={inlineStyle(`position:absolute;top:8px;left:8px;z-index:2;width:20px;height:20px;border-radius:6px;border:1.5px solid ${attr(item?.selBd)};background:${attr(item?.selBg)};color:#fff;font-size:11px;cursor:pointer;padding:0`)}>
                  {show(item?.selMark)}
                </button>
              </>) : null}
              {' '}
              {item?.isPage ? (<>
                <button onClick={item?.toggleStar} title="Star" style={inlineStyle(`position:absolute;top:6px;right:8px;z-index:2;border:0;background:none;font-size:17px;cursor:pointer;color:${attr(item?.starC)}`)}>
                  {show(item?.star)}
                </button>
              </>) : null}
              {' '}
              <button onClick={item?.go} style={{
                  border: '0',
                  background: 'none',
                  padding: '0',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1',
                }}>
                {' '}
                <span style={inlineStyle(`height:96px;width:100%;background:${attr(item?.iconBg)};display:flex;align-items:center;justify-content:center;overflow:hidden`)}>
                  {item?.hasThumb ? (<>
                    <span style={inlineStyle(`display:block;width:100%;height:100%;background-image:url(${attr(item?.thumb)});background-size:cover;background-position:center`)} />
                  </>) : null}
                  {item?.isPage ? (<>
                    <span style={{
                        padding: '14px 16px',
                        fontSize: '11.5px',
                        lineHeight: '1.45',
                        color: 'oklch(0.5 0.012 265)',
                        alignSelf: 'stretch',
                        overflow: 'hidden',
                        textAlign: 'left',
                        width: '100%',
                      }}>
                      {show(item?.preview)}
                    </span>
                  </>) : null}
                  {item?.noThumb ? (<>
                    <span style={inlineStyle(`font-size:15px;font-weight:700;letter-spacing:0.04em;color:${attr(item?.iconFg)};font-family:'JetBrains Mono',monospace`)}>
                      {show(item?.icon)}
                    </span>
                  </>) : null}
                </span>
                {' '}
                <span style={{
                    padding: '10px 12px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    minWidth: '0',
                  }}>
                  <span style={inlineStyle(`font-size:13.5px;font-weight:600;color:${attr(item?.titleColor)};overflow:hidden;text-overflow:ellipsis;white-space:nowrap`)}>
                    {show(item?.title)}
                  </span>
                  <span style={{
                      fontSize: '11.5px',
                      color: 'oklch(0.52 0.012 265)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {show(item?.meta)}
                  </span>
                </span>
                {' '}
              </button>
              {' '}
              <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px 10px',
                  flexWrap: 'wrap',
                }}>
                <span style={inlineStyle(`font-size:11px;font-weight:600;padding:1px 7px;border-radius:5px;background:${attr(item?.coTint)};color:${attr(item?.coInk)}`)}>
                  {show(item?.coName)}
                </span>
                {item?.isPage ? (<>
                  <span style={inlineStyle(`font-size:11px;font-weight:600;padding:1px 7px;border-radius:5px;background:${attr(item?.stBg)};color:${attr(item?.stFg)}`)}>
                    {show(item?.status)}
                  </span>
                </>) : null}
                <span style={{ flex: '1' }} />
                <span title={item?.who} style={inlineStyle(`width:18px;height:18px;border-radius:50%;background:${attr(item?.pbg)};color:#fff;font-size:7.5px;font-weight:600;display:grid;place-items:center`)}>
                  {show(item?.ini)}
                </span>
                <span style={{ fontSize: '11px', color: 'oklch(0.55 0.012 265)' }}>
                  {show(item?.when)}
                </span>
              </div>
              {' '}
            </div>
          </Fragment>))}
        </div>
      </>) : null}
      {' '}
      {vm.dc?.isList ? (<>
        <div style={{
            border: '1px solid oklch(0.915 0.006 85)',
            borderRadius: '12px',
            background: '#fff',
            overflow: 'hidden',
          }}>
          {asList(vm.dc?.items).map((item, index) => (<Fragment key={index}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderBottom: '1px solid oklch(0.95 0.004 85)',
                flexWrap: 'wrap',
              }} className="scp4">
              {item?.isFile ? (<>
                <button onClick={item?.toggleSel} style={inlineStyle(`width:18px;height:18px;border-radius:5px;border:1.5px solid ${attr(item?.selBd)};background:${attr(item?.selBg)};color:#fff;font-size:10px;cursor:pointer;padding:0;flex-shrink:0`)}>
                  {show(item?.selMark)}
                </button>
              </>) : null}
              {item?.isPage ? (<>
                <button onClick={item?.toggleStar} style={inlineStyle(`border:0;background:none;font-size:15px;cursor:pointer;color:${attr(item?.starC)};width:18px;padding:0`)}>
                  {show(item?.star)}
                </button>
              </>) : null}
              <span style={inlineStyle(`width:34px;height:34px;border-radius:7px;background:${attr(item?.iconBg)};display:grid;place-items:center;font-size:9.5px;font-weight:700;color:${attr(item?.iconFg)};font-family:'JetBrains Mono',monospace;flex-shrink:0;overflow:hidden`)}>
                {item?.hasThumb ? (<>
                  <span style={inlineStyle(`display:block;width:100%;height:100%;background-image:url(${attr(item?.thumb)});background-size:cover;background-position:center`)} />
                </>) : null}
                {item?.noThumb ? (<>
                  {show(item?.icon)}
                </>) : null}
                {item?.isPage ? (<>
                  {show(item?.icon)}
                </>) : null}
              </span>
              <button onClick={item?.go} style={{
                  flex: '1 1 200px',
                  minWidth: '0',
                  border: '0',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '0',
                }}>
                <span style={inlineStyle(`display:block;font-size:14px;font-weight:600;color:${attr(item?.titleColor)};overflow:hidden;text-overflow:ellipsis;white-space:nowrap`)}>
                  {show(item?.title)}
                </span>
                <span style={{ display: 'block', fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                  {show(item?.meta)}
                </span>
              </button>
              <span style={inlineStyle(`font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(item?.coTint)};color:${attr(item?.coInk)}`)}>
                {show(item?.coName)}
              </span>
              <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)', minWidth: '110px', textAlign: 'right' }}>
                {show(item?.when)}
              </span>
              {item?.isFile ? (<>
                <button onClick={item?.open} style={{
                    height: '28px',
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
                <button onClick={item?.remove} title="Move to Trash" style={{
                    border: '0',
                    background: 'none',
                    color: 'oklch(0.65 0.01 265)',
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}>
                  {'×'}
                </button>
              </>) : null}
            </div>
          </Fragment>))}
        </div>
      </>) : null}
      {' '}
      {vm.dc?.noItems ? (<>
        <div style={{
            padding: '40px 16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
          }}>
          <span style={{ fontSize: '15px', fontWeight: '600' }}>
            {'Nothing here yet'}
          </span>
          <span style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', maxWidth: '440px', lineHeight: '1.5' }}>
            {'Create a page, pick a template above, or upload files. Moving from Notion? Export as Markdown & CSV and use Import from Notion on the left.'}
          </span>
          {vm.dc?.anyFilter ? (<>
            <button onClick={vm.dc?.clear} style={{
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
  </>);
}
