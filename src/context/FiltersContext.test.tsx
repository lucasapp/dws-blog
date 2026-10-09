import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EMPTY_FILTERS, useFilters } from './filters';
import { FiltersProvider } from './FiltersContext';

const renderFilters = () => renderHook(() => useFilters(), { wrapper: FiltersProvider });

describe('FiltersProvider', () => {
  it('starts with no search, newest first and no filters', () => {
    const { result } = renderFilters();

    expect(result.current.search).toBe('');
    expect(result.current.sort).toBe('newest');
    expect(result.current.filters).toEqual(EMPTY_FILTERS);
    expect(result.current.activeCount).toBe(0);
  });

  it('updates the search term', () => {
    const { result } = renderFilters();
    act(() => result.current.setSearch('tech'));
    expect(result.current.search).toBe('tech');
  });

  it('toggles the sort order back and forth', () => {
    const { result } = renderFilters();

    act(() => result.current.toggleSort());
    expect(result.current.sort).toBe('oldest');
    act(() => result.current.toggleSort());
    expect(result.current.sort).toBe('newest');
  });

  it('toggles categories and authors independently and counts them', () => {
    const { result } = renderFilters();

    act(() => {
      result.current.toggleCategory('c1');
      result.current.toggleCategory('c2');
      result.current.toggleAuthor('a1');
    });
    expect(result.current.filters).toEqual({ categoryIds: ['c1', 'c2'], authorIds: ['a1'] });
    expect(result.current.activeCount).toBe(3);

    act(() => result.current.toggleCategory('c1'));
    expect(result.current.filters.categoryIds).toEqual(['c2']);
  });

  it('clears categories or authors separately', () => {
    const { result } = renderFilters();
    act(() => {
      result.current.toggleCategory('c1');
      result.current.toggleAuthor('a1');
    });

    act(() => result.current.clearCategories());
    expect(result.current.filters).toEqual({ categoryIds: [], authorIds: ['a1'] });

    act(() => result.current.clearAuthors());
    expect(result.current.filters).toEqual(EMPTY_FILTERS);
  });

  it('replaces all filters at once with setFilters', () => {
    const { result } = renderFilters();
    act(() => result.current.setFilters({ categoryIds: ['c2'], authorIds: ['a2'] }));
    expect(result.current.filters).toEqual({ categoryIds: ['c2'], authorIds: ['a2'] });
  });

  it('resetAll clears search and filters but keeps the sort order', () => {
    const { result } = renderFilters();
    act(() => {
      result.current.setSearch('tech');
      result.current.toggleCategory('c1');
      result.current.toggleSort();
    });

    act(() => result.current.resetAll());
    expect(result.current.search).toBe('');
    expect(result.current.filters).toEqual(EMPTY_FILTERS);
    expect(result.current.sort).toBe('oldest');
  });

  it('keeps the same context value between renders when nothing changed', () => {
    const { result, rerender } = renderFilters();
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

describe('useFilters', () => {
  it('throws when used outside FiltersProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useFilters())).toThrow('useFilters must be used within FiltersProvider');
  });
});
