import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { Filters, SortOrder } from '../types';
import { toggleItem } from '../utils/format';
import { EMPTY_FILTERS, FiltersContext, type FiltersState } from './filters';

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOrder>('newest');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const toggleSort = useCallback(() => setSort((s) => (s === 'newest' ? 'oldest' : 'newest')), []);

  const toggleCategory = useCallback(
    (id: string) => setFilters((f) => ({ ...f, categoryIds: toggleItem(f.categoryIds, id) })),
    [],
  );
  const toggleAuthor = useCallback(
    (id: string) => setFilters((f) => ({ ...f, authorIds: toggleItem(f.authorIds, id) })),
    [],
  );
  const clearCategories = useCallback(() => setFilters((f) => ({ ...f, categoryIds: [] })), []);
  const clearAuthors = useCallback(() => setFilters((f) => ({ ...f, authorIds: [] })), []);

  const resetAll = useCallback(() => {
    setSearch('');
    setFilters(EMPTY_FILTERS);
  }, []);

  const value = useMemo<FiltersState>(
    () => ({
      search,
      sort,
      filters,
      activeCount: filters.categoryIds.length + filters.authorIds.length,
      setSearch,
      toggleSort,
      setFilters,
      toggleCategory,
      toggleAuthor,
      clearCategories,
      clearAuthors,
      resetAll,
    }),
    [search, sort, filters, toggleSort, toggleCategory, toggleAuthor, clearCategories, clearAuthors, resetAll],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}
