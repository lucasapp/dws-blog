import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../../utils/cx';
import styles from './Button.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', icon, fullWidth, className, children, ...rest }: Props) {
  return (
    <button
      type="button"
      className={cx(styles.button, styles[variant], fullWidth && styles.fullWidth, className)}
      {...rest}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
