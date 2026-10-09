import { useCallback, useId, useRef, useState } from 'react';
import { Icon } from '../../../components/ui/Icon/Icon';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { cx } from '../../../utils/cx';
import styles from './FilterDropdown.module.scss';

interface Option {
  id: string;
  name: string;
}

interface Props {
  label: string;
  options: Option[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

export function FilterDropdown({ label, options, selectedIds, onToggle, onClear }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  const selectedNames = options.filter((o) => selectedIds.includes(o.id)).map((o) => o.name);
  const hasSelection = selectedNames.length > 0;

  return (
    <div className={styles.dropdown} ref={ref}>
      <div className={cx(styles.trigger, (open || hasSelection) && styles.active)}>
        <button
          type="button"
          className={styles.toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={styles.label}>{hasSelection ? selectedNames.join(', ') : label}</span>
          {!hasSelection && <Icon name="chevron-down" size={24} className={cx(styles.chevron, open && styles.up)} />}
        </button>

        {hasSelection && (
          <button type="button" className={styles.clear} onClick={onClear} aria-label={`Clear ${label} filter`}>
            <Icon name="close" size={16} />
          </button>
        )}
      </div>

      {open && (
        <ul id={listId} role="listbox" aria-multiselectable="true" aria-label={label} className={styles.menu}>
          {options.map((option) => {
            const selected = selectedIds.includes(option.id);
            return (
              <li
                key={option.id}
                role="option"
                aria-selected={selected}
                tabIndex={0}
                className={cx(styles.option, selected && styles.optionSelected)}
                onClick={() => onToggle(option.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggle(option.id);
                  }
                }}
              >
                {option.name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
