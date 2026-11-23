import AuthGate from './auth/AuthGate';
import FoundersHQApp from './hq/FoundersHQApp';
import './hq/styles/fonts.css';
import './hq/styles/base.css';
import './hq/styles/pseudo.css';
import './hq/styles/responsive.css';

/** Founders HQ as it ran on its own: sign-in gate, then the HQ for that founder. */
export default function FoundersRoot() {
  return (
    <div className="hq-root">
      <AuthGate>{(account, signOut) => <FoundersHQApp key={account.id} account={account} onSignOut={signOut} />}</AuthGate>
    </div>
  );
}
