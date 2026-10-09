import { useEffect, useState } from 'react';
import { postsApi } from '../api/endpoints';
import { useBlogData } from '../context/blogData';
import type { Post } from '../types';

interface State {
  post: Post | null;
  loading: boolean;
  error: string | null;
}

interface FetchResult {
  id: string;
  post: Post | null;
  error: string | null;
}

export function usePost(id: string): State {
  const { getPostById } = useBlogData();
  const cached = getPostById(id);
  const [result, setResult] = useState<FetchResult | null>(null);

  useEffect(() => {
    if (cached) return;
    const controller = new AbortController();
    postsApi
      .get(id, controller.signal)
      .then((post) => setResult({ id, post, error: null }))
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setResult({ id, post: null, error: err.message });
      });
    return () => controller.abort();
  }, [id, cached]);

  if (cached) return { post: cached, loading: false, error: null };
  if (result?.id !== id) return { post: null, loading: true, error: null };
  return { post: result.post, loading: false, error: result.error };
}
