/* Converted from the Founders HQ prototype (CEO Portal/netlify-site/index.html). */
import { show, inputValue } from '../rt';
import VaultItems from './VaultItems';

export default function Vault({ vm }) {
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
          {'Vault'}
        </h1>
        <div style={{ fontSize: '13.5px', color: 'oklch(0.52 0.012 265)', marginTop: '4px' }}>
          {'Logins and passwords, encrypted with your master password before they\'re saved.'}
        </div>
      </div>
      {' '}
      {vm.vt?.isOpen ? (<>
        <div style={{ display: 'flex', gap: '8px' }}>
          {' '}
          <button onClick={vm.vt?.startAdd} style={{
              height: '36px',
              border: '0',
              background: 'var(--acc, oklch(0.5 0.17 265))',
              color: '#fff',
              borderRadius: '8px',
              padding: '0 16px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }} className="scp15">
            {'Add credential'}
          </button>
          {' '}
          <button onClick={vm.vt?.lock} style={{
              height: '36px',
              border: '1px solid oklch(0.88 0.008 85)',
              background: '#fff',
              borderRadius: '8px',
              padding: '0 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
            {'Lock'}
          </button>
          {' '}
        </div>
      </>) : null}
      {' '}
    </div>
    {' '}
    {vm.vt?.isSetup ? (<>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '440px',
        }}>
        {' '}
        <div style={{ fontSize: '16px', fontWeight: '600' }}>
          {'Create a master password'}
        </div>
        {' '}
        <div style={{ fontSize: '13px', color: 'oklch(0.52 0.012 265)', lineHeight: '1.5' }}>
          {'Share it only with your fellow founders. If it\'s forgotten, saved credentials can\'t be recovered.'}
        </div>
        {' '}
        <input type="password" value={inputValue(vm.vt?.pw)} onChange={vm.vt?.onPw} placeholder="Master password (8+ characters)" style={{
            height: '40px',
            padding: '0 12px',
            border: '1px solid oklch(0.88 0.008 85)',
            borderRadius: '9px',
            fontSize: '14px',
            outline: 'none',
          }} />
        {' '}
        <input type="password" value={inputValue(vm.vt?.pw2)} onChange={vm.vt?.onPw2} onKeyDown={vm.vt?.onSetupKey} placeholder="Repeat master password" style={{
            height: '40px',
            padding: '0 12px',
            border: '1px solid oklch(0.88 0.008 85)',
            borderRadius: '9px',
            fontSize: '14px',
            outline: 'none',
          }} />
        {' '}
        {vm.vt?.hasErr ? (<>
          <div style={{ fontSize: '12.5px', color: 'oklch(0.5 0.18 25)' }}>
            {show(vm.vt?.err)}
          </div>
        </>) : null}
        {' '}
        <button onClick={vm.vt?.create} style={{
            height: '40px',
            border: '0',
            borderRadius: '9px',
            background: 'var(--acc, oklch(0.5 0.17 265))',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
          {'Create vault'}
        </button>
        {' '}
      </div>
      {' '}
    </>) : null}
    {' '}
    {vm.vt?.isLocked ? (<>
      {' '}
      <div style={{
          background: '#fff',
          border: '1px solid oklch(0.915 0.006 85)',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '440px',
        }}>
        {' '}
        <div style={{ fontSize: '16px', fontWeight: '600' }}>
          {'Vault is locked'}
        </div>
        {' '}
        <input type="password" value={inputValue(vm.vt?.pw)} onChange={vm.vt?.onPw} onKeyDown={vm.vt?.onUnlockKey} placeholder="Master password" style={{
            height: '40px',
            padding: '0 12px',
            border: '1px solid oklch(0.88 0.008 85)',
            borderRadius: '9px',
            fontSize: '14px',
            outline: 'none',
          }} />
        {' '}
        {vm.vt?.hasErr ? (<>
          <div style={{ fontSize: '12.5px', color: 'oklch(0.5 0.18 25)' }}>
            {show(vm.vt?.err)}
          </div>
        </>) : null}
        {' '}
        <button onClick={vm.vt?.unlock} style={{
            height: '40px',
            border: '0',
            borderRadius: '9px',
            background: 'var(--acc, oklch(0.5 0.17 265))',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
          {show(vm.vt?.unlockLabel)}
        </button>
        {' '}
      </div>
      {' '}
    </>) : null}
    {' '}
    {vm.vt?.isOpen ? <VaultItems vm={vm} /> : null}
    {' '}
  </>);
}
