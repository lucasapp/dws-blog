import { cx } from '../../../utils/cx';
import styles from './FilterItem.module.scss';

interface Props {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export function FilterItem({ label, selected, onToggle }: Props) {
  return (
    <li className={styles.wrapper}>
      <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        className={cx(styles.item, selected && styles.selected)}
        onClick={onToggle}
      >
        {label}
      </button>
    </li>
  );
}
