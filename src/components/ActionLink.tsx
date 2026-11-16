import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import './ActionLink.css';

type Props = {
  children: ReactNode;
  className?: string;
  direction?: 'right' | 'down';
} & ({ to: string; href?: never } | { href: string; to?: never });

/** The duplicate label/icon is decorative and hidden from assistive technology. */
export default function ActionLink({ children, className = '', direction = 'right', to, href }: Props) {
  const Icon = direction === 'down' ? ArrowDownRight : ArrowRight;
  const content = <>
    <span className="action-link__label">
      <span>{children}</span><span aria-hidden="true">{children}</span>
    </span>
    <span className="action-link__arrow" aria-hidden="true"><Icon /><Icon /></span>
  </>;
  const classes = `action-link action-link--${direction} ${className}`;
  return to !== undefined ? <Link to={to} className={classes}>{content}</Link> : <a href={href} className={classes}>{content}</a>;
}
