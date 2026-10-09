import { Icon } from '../../../components/ui/Icon/Icon';
import { useFilters } from '../../../context/filters';
import styles from './SortToggle.module.scss';

const labels = { newest: 'Newest first', oldest: 'Oldest first' } as const;

export function SortToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { sort, toggleSort } = useFilters();
  const next = sort === 'newest' ? 'oldest' : 'newest';

  return (
    <div className={styles.wrapper}>
      {showLabel && <span className={styles.label}>Sort by:</span>}
      <button
        type="button"
        className={styles.sort}
        onClick={toggleSort}
        aria-label={`Sorted by ${labels[sort].toLowerCase()}. Change to ${labels[next].toLowerCase()}`}
      >
        <span>{labels[sort]}</span>
        <Icon name="sort" size={20} />
      </button>
    </div>
  );
}
