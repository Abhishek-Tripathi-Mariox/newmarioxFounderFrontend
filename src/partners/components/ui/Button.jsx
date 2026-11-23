import { Link } from 'react-router-dom';

import { Icon } from './Icon';

const cls = ({ variant = 'default', size = 'md', block }, extra = '') =>
  ['btn', variant !== 'default' && variant, size !== 'md' && size, block && 'block', extra].filter(Boolean).join(' ');

export function Button({ variant, size, icon, block, loading, className = '', children, disabled, ...rest }) {
  return (
    <button className={cls({ variant, size, block }, className)} disabled={disabled || loading} {...rest}>
      {icon && <Icon name={icon} size={size === 'md' || !size ? undefined : 's'} />}
      {loading ? 'Please wait…' : children}
    </button>
  );
}

export function ButtonLink({ href, variant, size, icon, block, children }) {
  return (
    <Link to={href} className={cls({ variant, size, block })}>
      {icon && <Icon name={icon} size={size === 'md' || !size ? undefined : 's'} />}
      {children}
    </Link>
  );
}
