import { createContext, useContext } from 'react';
import type { Filters, SortOrder } from '../types';

export const EMPTY_FILTERS: Filters = { categoryIds: [], authorIds: [] };

export interface FiltersState {
  search: string;
  sort: SortOrder;
  filters: Filters;
  activeCount: number;
  setSearch: (value: string) => void;
  toggleSort: () => void;
  setFilters: (filters: Filters) => void;
  toggleCategory: (id: string) => void;
  toggleAuthor: (id: string) => void;
  clearCategories: () => void;
  clearAuthors: () => void;
  resetAll: () => void;
}

export const FiltersContext = createContext<FiltersState | null>(null);

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used within FiltersProvider');
  return ctx;
}
