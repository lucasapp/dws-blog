import { useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Icon } from '../../../components/ui/Icon/Icon';
import { FilterItem } from '../../../components/filters/FilterItem/FilterItem';
import { useBlogData } from '../../../context/blogData';
import { useFilters } from '../../../context/filters';
import type { Filters } from '../../../types';
import { toggleItem } from '../../../utils/format';
import styles from './FilterSidebar.module.scss';

export function FilterSidebar() {
  const { categories, authors } = useBlogData();
  const { filters, setFilters } = useFilters();
  const [draft, setDraft] = useState<Filters>(filters);
  const [syncedFilters, setSyncedFilters] = useState(filters);

  if (filters !== syncedFilters) {
    setSyncedFilters(filters);
    setDraft(filters);
  }

  const isDirty =
    draft.categoryIds.join() !== filters.categoryIds.join() || draft.authorIds.join() !== filters.authorIds.join();

  const clearSection = (key: keyof Filters) => {
    const next = { ...filters, [key]: [] };
    setSyncedFilters(next);
    setFilters(next);
    setDraft((d) => ({ ...d, [key]: [] }));
  };

  return (
    <aside className={styles.sidebar} aria-labelledby="filters-title">
      <h2 id="filters-title" className={styles.title}>
        <Icon name="filters" size={24} />
        Filters
      </h2>

      <section className={styles.group} aria-labelledby="filter-category">
        <div className={styles.groupHeader}>
          <h3 id="filter-category" className={styles.groupTitle}>
            Category
          </h3>
          {filters.categoryIds.length > 0 && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => clearSection('categoryIds')}
              aria-label="Clear Category filter"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
        <ul className={styles.list}>
          {categories.map((category) => (
            <FilterItem
              key={category.id}
              label={category.name}
              selected={draft.categoryIds.includes(category.id)}
              onToggle={() => setDraft((d) => ({ ...d, categoryIds: toggleItem(d.categoryIds, category.id) }))}
            />
          ))}
        </ul>
      </section>

      <section className={styles.group} aria-labelledby="filter-author">
        <div className={styles.groupHeader}>
          <h3 id="filter-author" className={styles.groupTitle}>
            Author
          </h3>
          {filters.authorIds.length > 0 && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => clearSection('authorIds')}
              aria-label="Clear Author filter"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
        <ul className={styles.list}>
          {authors.map((author) => (
            <FilterItem
              key={author.id}
              label={author.name}
              selected={draft.authorIds.includes(author.id)}
              onToggle={() => setDraft((d) => ({ ...d, authorIds: toggleItem(d.authorIds, author.id) }))}
            />
          ))}
        </ul>
      </section>

      <Button fullWidth onClick={() => setFilters(draft)} aria-disabled={!isDirty}>
        Apply filters
      </Button>
    </aside>
  );
}
