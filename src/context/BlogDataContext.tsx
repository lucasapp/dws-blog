import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authorsApi, categoriesApi, postsApi } from '../api/endpoints';
import type { Author, Category, Post } from '../types';
import { BlogDataContext, type Status } from './blogData';

export function BlogDataProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      postsApi.list(controller.signal),
      authorsApi.list(controller.signal),
      categoriesApi.list(controller.signal),
    ])
      .then(([postsData, authorsData, categoriesData]) => {
        setPosts(postsData);
        setAuthors(authorsData);
        setCategories(categoriesData);
        setStatus('success');
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setStatus('error');
      });

    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setStatus('loading');
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  const postsById = useMemo(() => new Map(posts.map((p) => [p.id, p])), [posts]);
  const getPostById = useCallback((id: string) => postsById.get(id), [postsById]);

  const value = useMemo(
    () => ({ posts, authors, categories, status, error, reload, getPostById }),
    [posts, authors, categories, status, error, reload, getPostById],
  );

  return <BlogDataContext.Provider value={value}>{children}</BlogDataContext.Provider>;
}
