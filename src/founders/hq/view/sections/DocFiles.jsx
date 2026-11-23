/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';

export default function DocFiles({ vm }) {
  return (<>
    {' '}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
            {'Files'}
          </div>
          <div style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)', marginTop: '3px' }}>
            {show(vm.dc?.fileShown)}
          </div>
        </div>
        <label style={{
            height: '34px',
            border: '0',
            background: 'var(--acc, oklch(0.5 0.17 265))',
            color: '#fff',
            borderRadius: '8px',
            padding: '0 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}>
          <span>
            {'Upload files'}
          </span>
          <input type="file" multiple={true} onChange={vm.dc?.onUpload} style={{ display: 'none' }} />
        </label>
      </div>
      {' '}
      <div onDragOver={vm.dc?.onDragOver} onDragLeave={vm.dc?.onDragLeave} onDrop={vm.dc?.onDrop} style={inlineStyle(`border:1.5px dashed ${attr(vm.dc?.dragBd)};background:${attr(vm.dc?.dragBg)};border-radius:12px;padding:22px;text-align:center;font-size:13.5px;color:oklch(0.45 0.012 265)`)}>
        {'Drag files here to upload · agreements, invoices, ID copies, decks, photos'}
      </div>
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
      {vm.dc?.hasSel ? (<>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            padding: '8px 12px',
            borderRadius: '10px',
            background: 'color-mix(in oklch, var(--acc) 7%, #fff)',
            border: '1px solid var(--acc, oklch(0.5 0.17 265))',
          }}>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {show(vm.dc?.selTxt)}
          </span>
          <button onClick={vm.dc?.bulkDl} style={{
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
          <select value="" onChange={vm.dc?.bulkCo} style={{
              height: '30px',
              border: '1px solid oklch(0.9 0.006 85)',
              borderRadius: '7px',
              background: '#fff',
              fontSize: '12.5px',
              padding: '0 6px',
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}>
            {asList(vm.dc?.bulkCoOpts).map((companyOption, index) => (<Fragment key={index}>
              <option value={inputValue(companyOption?.v)}>
                {show(companyOption?.l)}
              </option>
            </Fragment>))}
          </select>
          <button onClick={vm.dc?.bulkDel} style={{
              height: '30px',
              border: '1px solid oklch(0.88 0.05 25)',
              background: '#fff',
              color: 'oklch(0.5 0.18 25)',
              borderRadius: '7px',
              padding: '0 11px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            {'Move to Trash'}
          </button>
          <div style={{ flex: '1' }} />
          <button onClick={vm.dc?.allSel} style={{
              border: '0',
              background: 'none',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'var(--acc, oklch(0.5 0.17 265))',
            }}>
            {'Select all'}
          </button>
          <button onClick={vm.dc?.noneSel} style={{
              border: '0',
              background: 'none',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'oklch(0.45 0.012 265)',
            }}>
            {'Clear'}
          </button>
        </div>
      </>) : null}
      {' '}
      {vm.dc?.isGrid ? (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: '12px' }}>
          {asList(vm.dc?.files).map((file, index) => (<Fragment key={index}>
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
              {file?.isFile ? (<>
                <button onClick={file?.toggleSel} title="Select" style={inlineStyle(`position:absolute;top:8px;left:8px;z-index:2;width:20px;height:20px;border-radius:6px;border:1.5px solid ${attr(file?.selBd)};background:${attr(file?.selBg)};color:#fff;font-size:11px;cursor:pointer;padding:0`)}>
                  {show(file?.selMark)}
                </button>
              </>) : null}
              {' '}
              {file?.isPage ? (<>
                <button onClick={file?.toggleStar} title="Star" style={inlineStyle(`position:absolute;top:6px;right:8px;z-index:2;border:0;background:none;font-size:17px;cursor:pointer;color:${attr(file?.starC)}`)}>
                  {show(file?.star)}
                </button>
              </>) : null}
              {' '}
              <button onClick={file?.go} style={{
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
                <span style={inlineStyle(`height:96px;width:100%;background:${attr(file?.iconBg)};display:flex;align-items:center;justify-content:center;overflow:hidden`)}>
                  {file?.hasThumb ? (<>
                    <span style={inlineStyle(`display:block;width:100%;height:100%;background-image:url(${attr(file?.thumb)});background-size:cover;background-position:center`)} />
                  </>) : null}
                  {file?.isPage ? (<>
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
                      {show(file?.preview)}
                    </span>
                  </>) : null}
                  {file?.noThumb ? (<>
                    <span style={inlineStyle(`font-size:15px;font-weight:700;letter-spacing:0.04em;color:${attr(file?.iconFg)};font-family:'JetBrains Mono',monospace`)}>
                      {show(file?.icon)}
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
                  <span style={inlineStyle(`font-size:13.5px;font-weight:600;color:${attr(file?.titleColor)};overflow:hidden;text-overflow:ellipsis;white-space:nowrap`)}>
                    {show(file?.title)}
                  </span>
                  <span style={{
                      fontSize: '11.5px',
                      color: 'oklch(0.52 0.012 265)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {show(file?.meta)}
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
                <span style={inlineStyle(`font-size:11px;font-weight:600;padding:1px 7px;border-radius:5px;background:${attr(file?.coTint)};color:${attr(file?.coInk)}`)}>
                  {show(file?.coName)}
                </span>
                {file?.isPage ? (<>
                  <span style={inlineStyle(`font-size:11px;font-weight:600;padding:1px 7px;border-radius:5px;background:${attr(file?.stBg)};color:${attr(file?.stFg)}`)}>
                    {show(file?.status)}
                  </span>
                </>) : null}
                <span style={{ flex: '1' }} />
                <span title={file?.who} style={inlineStyle(`width:18px;height:18px;border-radius:50%;background:${attr(file?.pbg)};color:#fff;font-size:7.5px;font-weight:600;display:grid;place-items:center`)}>
                  {show(file?.ini)}
                </span>
                <span style={{ fontSize: '11px', color: 'oklch(0.55 0.012 265)' }}>
                  {show(file?.when)}
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
            overflowX: 'auto',
          }}>
          <div style={{ minWidth: '820px' }}>
            {asList(vm.dc?.files).map((file, index) => (<Fragment key={index}>
              <div style={{
                  display: 'grid',
                  gridTemplateColumns: '22px 34px minmax(0,1fr) 120px 170px 150px auto auto 22px',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 12px',
                  borderBottom: '1px solid oklch(0.95 0.004 85)',
                }}>
                <button onClick={file?.toggleSel} style={inlineStyle(`width:18px;height:18px;border-radius:5px;border:1.5px solid ${attr(file?.selBd)};background:${attr(file?.selBg)};color:#fff;font-size:10px;cursor:pointer;padding:0`)}>
                  {show(file?.selMark)}
                </button>
                <span style={inlineStyle(`width:32px;height:32px;border-radius:6px;background:${attr(file?.iconBg)};display:grid;place-items:center;font-size:9px;font-weight:700;color:${attr(file?.iconFg)};font-family:'JetBrains Mono',monospace;overflow:hidden`)}>
                  {file?.hasThumb ? (<>
                    <span style={inlineStyle(`display:block;width:100%;height:100%;background-image:url(${attr(file?.thumb)});background-size:cover;background-position:center`)} />
                  </>) : null}
                  {file?.noThumb ? (<>
                    {show(file?.icon)}
                  </>) : null}
                </span>
                <div style={{ minWidth: '0' }}>
                  <input value={inputValue(file?.rename)} onChange={file?.onRename} title="Click to rename" style={{
                      width: '100%',
                      height: '28px',
                      border: '1px solid transparent',
                      borderRadius: '6px',
                      padding: '0 6px',
                      fontSize: '13.5px',
                      fontWeight: '600',
                      outline: 'none',
                      background: 'transparent',
                    }} className="scp11" />
                  <div style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)', paddingLeft: '6px' }}>
                    {show(file?.meta)}{' · '}{show(file?.when)}{' · '}{show(file?.who)}
                  </div>
                </div>
                <select value={inputValue(file?.co)} onChange={file?.onCo} style={inlineStyle(`height:30px;border:1px solid oklch(0.9 0.006 85);border-radius:7px;background:#fff;font-size:12.5px;padding:0 6px;font-family:inherit;cursor:pointer;font-weight:600;background:${attr(file?.coTint)};color:${attr(file?.coInk)};border-color:transparent`)}>
                  {asList(file?.coOpts).map((companyOption, optionIndex) => (<Fragment key={optionIndex}>
                    <option value={inputValue(companyOption?.v)}>
                      {show(companyOption?.l)}
                    </option>
                  </Fragment>))}
                </select>
                <select value={inputValue(file?.page)} onChange={file?.onPage} title="Attach to a page" style={{
                    height: '30px',
                    border: '1px solid oklch(0.9 0.006 85)',
                    borderRadius: '7px',
                    background: '#fff',
                    fontSize: '12.5px',
                    padding: '0 6px',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    maxWidth: '170px',
                  }}>
                  {asList(file?.pageOpts).map((pageOption, optionIndex) => (<Fragment key={optionIndex}>
                    <option value={inputValue(pageOption?.v)}>
                      {show(pageOption?.l)}
                    </option>
                  </Fragment>))}
                </select>
                <span />
                {file?.canPreview ? (<>
                  <button onClick={file?.preview2} style={{
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
                    {'Preview'}
                  </button>
                </>) : null}
                <button onClick={file?.open} style={{
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
                <button onClick={file?.remove} title="Move to Trash" style={{
                    border: '0',
                    background: 'none',
                    color: 'oklch(0.65 0.01 265)',
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}>
                  {'×'}
                </button>
              </div>
            </Fragment>))}
          </div>
        </div>
      </>) : null}
      {' '}
      {vm.dc?.noFiles ? (<>
        <div style={{ padding: '30px 16px', textAlign: 'center', fontSize: '13px', color: 'oklch(0.52 0.012 265)' }}>
          {'No files match. Upload or drag files above.'}
        </div>
      </>) : null}
      {' '}
    </div>
    {' '}
  </>);
}
