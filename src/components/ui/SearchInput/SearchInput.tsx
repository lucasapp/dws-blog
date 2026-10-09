import { forwardRef, type FormEvent, type InputHTMLAttributes } from 'react';
import { Icon } from '../../../components/ui/Icon/Icon';
import { cx } from '../../../utils/cx';
import styles from './SearchInput.module.scss';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSubmit'> {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  variant?: 'button' | 'back';
  onBack?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, Props>(function SearchInput(
  { value, onChange, onSubmit, variant = 'button', onBack, className, ...rest },
  ref,
) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form role="search" className={cx(styles.search, styles[variant], className)} onSubmit={handleSubmit}>
      {variant === 'back' && (
        <button type="button" className={styles.iconBtn} onClick={onBack} aria-label="Close search">
          <Icon name="arrow-left" size={20} />
        </button>
      )}

      <label className="sr-only" htmlFor={rest.id ?? 'search'}>
        Search posts
      </label>
      <input
        ref={ref}
        id={rest.id ?? 'search'}
        type="search"
        autoComplete="off"
        placeholder={variant === 'button' ? 'Search' : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
        {...rest}
      />

      {variant === 'back' && value && (
        <button type="button" className={styles.iconBtn} onClick={() => onChange('')} aria-label="Clear search">
          <Icon name="close" size={20} />
        </button>
      )}

      {variant === 'button' && <SearchButton type="submit" />}
    </form>
  );
});

export function SearchButton({
  type = 'button',
  onClick,
}: {
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  return (
    <button type={type} className={styles.searchButton} onClick={onClick} aria-label="Search">
      <Icon name="search" size={24} />
    </button>
  );
}
