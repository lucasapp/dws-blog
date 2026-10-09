import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { BlogDataProvider } from '../context/BlogDataContext';
import { useFilters } from '../context/filters';
import { FiltersProvider } from '../context/FiltersContext';
import { posts } from '../test/fixtures';
import { mockApi } from '../test/utils';
import type { Post } from '../types';
import { matchesSearch, sortPosts, useFilteredPosts } from './useFilteredPosts';

const ids = (list: Post[]) => list.map((p) => p.id);

describe('sortPosts', () => {
  it('sorts newest first or oldest first by createdAt', () => {
    expect(ids(sortPosts(posts, 'newest'))).toEqual(['p2', 'p4', 'p1', 'p3']);
    expect(ids(sortPosts(posts, 'oldest'))).toEqual(['p3', 'p1', 'p4', 'p2']);
  });

  it('does not mutate the original array', () => {
    const copy = [...posts];
    sortPosts(posts, 'oldest');
    expect(posts).toEqual(copy);
  });
});

describe('matchesSearch', () => {
  const post = posts[3];

  it('matches everything for an empty or blank term', () => {
    expect(matchesSearch(post, '')).toBe(true);
    expect(matchesSearch(post, '   ')).toBe(true);
  });

  it('matches title, author and category names', () => {
    expect(matchesSearch(post, 'culture')).toBe(true);
    expect(matchesSearch(post, 'smith')).toBe(true);
    expect(matchesSearch(posts[0], 'tech')).toBe(true);
    expect(matchesSearch(post, 'tech')).toBe(false);
  });

  it('ignores case, accents and surrounding spaces', () => {
    expect(matchesSearch(post, '  CAFE ')).toBe(true);
    expect(matchesSearch(posts[0], 'healthcáre')).toBe(true);
  });

  it('tolerates a post without author', () => {
    const noAuthor = { ...post, author: undefined } as unknown as Post;
    expect(matchesSearch(noAuthor, 'smith')).toBe(false);
  });
});

describe('useFilteredPosts', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <BlogDataProvider>
      <FiltersProvider>{children}</FiltersProvider>
    </BlogDataProvider>
  );

  const setup = async () => {
    mockApi();
    const hook = renderHook(() => ({ posts: useFilteredPosts(), filters: useFilters() }), { wrapper });
    await waitFor(() => expect(hook.result.current.posts).toHaveLength(4));
    return hook.result;
  };

  it('returns all posts newest first by default', async () => {
    const result = await setup();
    expect(ids(result.current.posts)).toEqual(['p2', 'p4', 'p1', 'p3']);
  });

  it('follows the sort order from the context', async () => {
    const result = await setup();
    act(() => result.current.filters.toggleSort());
    expect(ids(result.current.posts)).toEqual(['p3', 'p1', 'p4', 'p2']);
  });

  it('applies the search term', async () => {
    const result = await setup();
    act(() => result.current.filters.setSearch('jane'));
    expect(ids(result.current.posts)).toEqual(['p1', 'p3']);
  });

  it('keeps posts with any of the selected categories', async () => {
    const result = await setup();
    act(() => result.current.filters.toggleCategory('c2'));
    expect(ids(result.current.posts)).toEqual(['p2', 'p3']);
  });

  it('keeps posts by any of the selected authors', async () => {
    const result = await setup();
    act(() => result.current.filters.toggleAuthor('a2'));
    expect(ids(result.current.posts)).toEqual(['p2', 'p4']);
  });

  it('combines search, categories and authors', async () => {
    const result = await setup();
    act(() => {
      result.current.filters.toggleCategory('c1');
      result.current.filters.toggleAuthor('a1');
      result.current.filters.setSearch('remote');
    });
    expect(ids(result.current.posts)).toEqual(['p3']);
  });
});
