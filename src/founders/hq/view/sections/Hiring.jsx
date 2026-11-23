/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { Fragment } from 'react';
import { show, attr, inlineStyle, asList, inputValue } from '../rt';
import RolePanel from './RolePanel';

export default function Hiring({ vm }) {
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
          {'Hiring'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {show(vm.hr?.sub)}
        </div>
      </div>
      {' '}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={vm.hr?.copyList} style={{
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
        <button onClick={vm.hr?.add} style={{
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
          {'+ New role'}
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
      {asList(vm.hr?.coTabs).map((companyTab, index) => (<Fragment key={index}>
        <button onClick={companyTab?.go} style={inlineStyle(`display:flex;align-items:center;gap:8px;border:0;background:none;padding:10px 12px;margin-bottom:-1px;border-bottom:2px solid ${attr(companyTab?.bd)};font-size:13.5px;font-weight:600;color:${attr(companyTab?.fg)};cursor:pointer;white-space:nowrap`)}>
          {companyTab?.hasTile ? (<>
            <span style={inlineStyle(`width:18px;height:18px;border-radius:5px;background:${attr(companyTab?.tile)};color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center`)}>
              {show(companyTab?.ini)}
            </span>
          </>) : null}
          {show(companyTab?.label)}
          <span title="Open roles" style={{
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
      {vm.hr?.coMore?.has ? (<>
        <input list={vm.hr?.coMore?.id} onChange={vm.hr?.coMore?.on} placeholder={vm.hr?.coMore?.ph} style={{
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
        <datalist id={vm.hr?.coMore?.id}>
          {asList(vm.hr?.coMore?.opts).map((option, index) => (<Fragment key={index}>
            <option value={inputValue(option?.l)} />
          </Fragment>))}
        </datalist>
      </>) : null}
      {' '}
    </div>
    {' '}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(118px,1fr))', gap: '10px' }}>
      {' '}
      {asList(vm.hr?.tiles).map((tile, index) => (<Fragment key={index}>
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
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}>
      {' '}
      <input value={inputValue(vm.hr?.q)} onChange={vm.hr?.onQ} placeholder="Search roles, skills, candidates" style={{
          flex: '0 1 250px',
          minWidth: '160px',
          height: '32px',
          padding: '0 12px',
          border: '1px solid oklch(0.9 0.006 85)',
          borderRadius: '8px',
          fontSize: '13px',
          outline: 'none',
        }} />
      {' '}
      {asList(vm.hr?.filters).map((filter, index) => (<Fragment key={index}>
        <select value={inputValue(filter?.value)} onChange={filter?.onChange} style={inlineStyle(`height:32px;border:1px solid ${attr(filter?.bd)};background:${attr(filter?.bg)};color:${attr(filter?.fg)};border-radius:8px;padding:0 8px;font-size:13px;font-weight:500;cursor:pointer;outline:none;font-family:inherit`)}>
          {asList(filter?.opts).map((option, optionIndex) => (<Fragment key={optionIndex}>
            <option value={inputValue(option?.v)}>
              {show(option?.l)}
            </option>
          </Fragment>))}
        </select>
      </Fragment>))}
      {' '}
      {vm.hr?.anyFilter ? (<>
        <button onClick={vm.hr?.clear} style={{
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
      <span style={{ fontSize: '12.5px', color: 'oklch(0.52 0.012 265)' }}>
        {show(vm.hr?.shown)}
      </span>
      {' '}
      {asList(vm.hr?.sortSel).map((sortSelect, index) => (<Fragment key={index}>
        <select value={inputValue(sortSelect?.value)} onChange={sortSelect?.onChange} style={inlineStyle(`height:32px;border:1px solid ${attr(sortSelect?.bd)};background:${attr(sortSelect?.bg)};color:${attr(sortSelect?.fg)};border-radius:8px;padding:0 8px;font-size:13px;font-weight:500;cursor:pointer;outline:none;font-family:inherit`)}>
          {asList(sortSelect?.opts).map((option, optionIndex) => (<Fragment key={optionIndex}>
            <option value={inputValue(option?.v)}>
              {show(option?.l)}
            </option>
          </Fragment>))}
        </select>
      </Fragment>))}
      {' '}
      <div style={{
          display: 'flex',
          gap: '2px',
          padding: '3px',
          background: 'oklch(0.94 0.005 85)',
          borderRadius: '9px',
        }}>
        {asList(vm.hr?.viewSeg).map((viewOption, index) => (<Fragment key={index}>
          <button onClick={viewOption?.go} style={inlineStyle(`border:0;padding:4px 12px;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;background:${attr(viewOption?.bg)};color:${attr(viewOption?.fg)};box-shadow:${attr(viewOption?.sh)}`)}>
            {show(viewOption?.label)}
          </button>
        </Fragment>))}
      </div>
      {' '}
    </div>
    {' '}
    {vm.hr?.isBoard ? (<>
      {' '}
      <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        {' '}
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5,minmax(220px,1fr))',
            gap: '10px',
            minWidth: '1140px',
          }}>
          {' '}
          {asList(vm.hr?.cols).map((column, index) => (<Fragment key={index}>
            {' '}
            <div style={{
                background: 'oklch(0.965 0.004 85)',
                borderRadius: '12px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
              {' '}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 4px' }}>
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'oklch(0.42 0.012 265)',
                  }}>
                  <span style={inlineStyle(`width:8px;height:8px;border-radius:50%;background:${attr(column?.dot)}`)} />
                  {show(column?.label)}
                  <span style={{ fontWeight: '500' }}>
                    {show(column?.n)}
                  </span>
                </span>
                <span style={{ fontSize: '11.5px', color: 'oklch(0.52 0.012 265)' }}>
                  {show(column?.cost)}
                </span>
              </div>
              {' '}
              {asList(column?.items).map((role, roleIndex) => (<Fragment key={roleIndex}>
                <div style={inlineStyle(`background:${attr(role?.selBg)};border:1px solid oklch(0.915 0.006 85);border-radius:10px;display:flex;flex-direction:column`)} className="scp1b">
                  <button onClick={role?.open} style={{
                      border: '0',
                      background: 'none',
                      textAlign: 'left',
                      padding: '11px 12px 6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '7px',
                      cursor: 'pointer',
                    }}>
                    <span style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', width: '100%' }}>
                      <span style={inlineStyle(`flex:1;font-size:13.5px;font-weight:600;line-height:1.35;color:${attr(role?.titleColor)}`)}>
                        {show(role?.role)}
                      </span>
                      {role?.isUrgent ? (<>
                        <span style={{
                            fontSize: '10.5px',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'oklch(0.95 0.035 25)',
                            color: 'oklch(0.48 0.17 25)',
                          }}>
                          {'URGENT'}
                        </span>
                      </>) : null}
                    </span>
                    <span style={{
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        fontSize: '12px',
                        color: 'oklch(0.52 0.012 265)',
                      }}>
                      <span style={inlineStyle(`font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(role?.coTint)};color:${attr(role?.coInk)}`)}>
                        {show(role?.coName)}
                      </span>
                      <span>
                        {show(role?.type)}
                      </span>
                    </span>
                    <span style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '8px',
                        width: '100%',
                        fontSize: '12px',
                      }}>
                      <span style={inlineStyle(`font-weight:600;color:${attr(role?.budgetColor)}`)}>
                        {show(role?.budget)}
                      </span>
                      <span style={inlineStyle(`color:${attr(role?.dueColor)}`)}>
                        {show(role?.due)}
                      </span>
                    </span>
                    <span style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '8px',
                        width: '100%',
                        fontSize: '12px',
                      }}>
                      {role?.hasCand ? (<>
                        <span style={inlineStyle(`color:${attr(role?.candColor)}`)}>
                          {show(role?.cand)}
                        </span>
                      </>) : null}
                      {role?.hasHeads ? (<>
                        <span style={{ fontWeight: '600', color: 'oklch(0.45 0.12 150)' }}>
                          {show(role?.heads)}
                        </span>
                      </>) : null}
                    </span>
                  </button>
                  <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 8px 8px 12px',
                    }}>
                    <span title={role?.owner} style={inlineStyle(`width:20px;height:20px;border-radius:50%;background:${attr(role?.pbg)};color:#fff;font-size:8px;font-weight:600;display:grid;place-items:center`)}>
                      {show(role?.ini)}
                    </span>
                    <span style={{ display: 'flex', gap: '2px' }}>
                      <button onClick={role?.back} title="Move to previous stage" style={inlineStyle(`width:26px;height:24px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:6px;cursor:pointer;font-size:11px;opacity:${attr(role?.backOp)}`)}>
                        {'‹'}
                      </button>
                      <button onClick={role?.fwd} title="Move to next stage" style={inlineStyle(`width:26px;height:24px;border:1px solid oklch(0.9 0.006 85);background:#fff;border-radius:6px;cursor:pointer;font-size:11px;opacity:${attr(role?.fwdOp)}`)}>
                        {'›'}
                      </button>
                    </span>
                  </div>
                </div>
              </Fragment>))}
              {' '}
              <button onClick={column?.add} style={{
                  border: '0',
                  background: 'transparent',
                  borderRadius: '8px',
                  padding: '8px 6px',
                  fontSize: '13px',
                  color: 'oklch(0.52 0.012 265)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }} className="scp25">
                {'+ New'}
              </button>
              {' '}
            </div>
            {' '}
          </Fragment>))}
          {' '}
        </div>
        {' '}
      </div>
      {' '}
    </>) : null}
    {' '}
    {vm.hr?.isList ? (<>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          overflowX: 'auto',
        }}>
        {' '}
        <div style={{ minWidth: '900px' }}>
          {' '}
          <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(220px,1fr) 120px 100px 130px 130px 140px 110px',
              gap: '8px',
              padding: '9px 16px',
              fontSize: '12px',
              fontWeight: '600',
              color: 'oklch(0.48 0.012 265)',
              background: 'oklch(0.975 0.004 85)',
            }}>
            <span>
              {'Role'}
            </span>
            <span>
              {'Stage'}
            </span>
            <span>
              {'Company'}
            </span>
            <span>
              {'Budget'}
            </span>
            <span>
              {'Join by'}
            </span>
            <span>
              {'Candidates'}
            </span>
            <span>
              {'Manager'}
            </span>
          </div>
          {' '}
          {asList(vm.hr?.list).map((role, index) => (<Fragment key={index}>
            <button onClick={role?.open} style={inlineStyle(`width:100%;display:grid;grid-template-columns:minmax(220px,1fr) 120px 100px 130px 130px 140px 110px;gap:8px;align-items:center;padding:10px 16px;border:0;border-top:1px solid oklch(0.95 0.004 85);background:${attr(role?.selBg)};cursor:pointer;text-align:left;font-size:13px`)} className="scp4">
              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                <span style={inlineStyle(`font-size:14px;font-weight:600;color:${attr(role?.titleColor)}`)}>
                  {show(role?.role)}
                </span>
                <span style={{ fontSize: '12px', color: 'oklch(0.52 0.012 265)' }}>
                  {show(role?.type)}
                </span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                <span style={inlineStyle(`width:8px;height:8px;border-radius:50%;background:${attr(role?.stDot)}`)} />
                {show(role?.stage)}
              </span>
              <span>
                <span style={inlineStyle(`font-size:12px;font-weight:600;padding:2px 8px;border-radius:5px;background:${attr(role?.coTint)};color:${attr(role?.coInk)}`)}>
                  {show(role?.coName)}
                </span>
              </span>
              <span style={inlineStyle(`font-weight:600;color:${attr(role?.budgetColor)}`)}>
                {show(role?.budget)}
              </span>
              <span style={inlineStyle(`color:${attr(role?.dueColor)}`)}>
                {show(role?.due)}
              </span>
              <span style={inlineStyle(`color:${attr(role?.candColor)}`)}>
                {show(role?.cand)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={inlineStyle(`width:20px;height:20px;border-radius:50%;background:${attr(role?.pbg)};color:#fff;font-size:8px;font-weight:600;display:grid;place-items:center`)}>
                  {show(role?.ini)}
                </span>
                {show(role?.owner)}
              </span>
            </button>
          </Fragment>))}
          {' '}
        </div>
        {' '}
      </div>
      {' '}
    </>) : null}
    {' '}
    {vm.hr?.empty ? (<>
      <div style={{
          padding: '30px 20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
        }}>
        <span style={{ fontSize: '15px', fontWeight: '600' }}>
          {show(vm.hr?.emptyTitle)}
        </span>
        <span style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', maxWidth: '460px', lineHeight: '1.5' }}>
          {'Plan each role with a budget and join-by date, then track candidates through screening, interviews and offer.'}
        </span>
        {vm.hr?.emptyFilter ? (<>
          <button onClick={vm.hr?.clear} style={{
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
    {vm.hasPeek ? <RolePanel vm={vm} /> : null}
    {' '}
  </>);
}
