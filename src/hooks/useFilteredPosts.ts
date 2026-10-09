import { useMemo } from 'react';
import { useBlogData } from '../context/blogData';
import { useFilters } from '../context/filters';
import type { Post, SortOrder } from '../types';
import { normalize } from '../utils/format';

export const sortPosts = (posts: Post[], order: SortOrder): Post[] =>
  [...posts].sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return order === 'newest' ? diff : -diff;
  });

export const matchesSearch = (post: Post, term: string): boolean => {
  const q = normalize(term.trim());
  if (!q) return true;
  return [post.title, post.author?.name ?? '', ...post.categories.map((c) => c.name)].some((field) =>
    normalize(field).includes(q),
  );
};

export function useFilteredPosts(): Post[] {
  const { posts } = useBlogData();
  const { search, sort, filters } = useFilters();

  return useMemo(() => {
    const { categoryIds, authorIds } = filters;
    const filtered = posts.filter(
      (post) =>
        matchesSearch(post, search) &&
        (!categoryIds.length || post.categories.some((c) => categoryIds.includes(c.id))) &&
        (!authorIds.length || authorIds.includes(post.authorId ?? post.author?.id)),
    );
    return sortPosts(filtered, sort);
  }, [posts, search, sort, filters]);
}
