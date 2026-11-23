import { createContext, useCallback, useContext, useState } from 'react';
import { Icon } from './Icon';

const Ctx = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((text, error) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, text, error }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);

  return (
    <Ctx.Provider value={show}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.error ? 'err' : ''}`}>
            <span className="ico"><Icon name={t.error ? 'alert' : 'check'} size="s" /></span>
            <div><b>{t.text}</b></div>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
