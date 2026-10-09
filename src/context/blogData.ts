import { createContext, useContext } from 'react';
import type { Author, Category, Post } from '../types';

export type Status = 'loading' | 'success' | 'error';

export interface BlogDataState {
  posts: Post[];
  authors: Author[];
  categories: Category[];
  status: Status;
  error: string | null;
  reload: () => void;
  getPostById: (id: string) => Post | undefined;
}

export const BlogDataContext = createContext<BlogDataState | null>(null);

export function useBlogData() {
  const ctx = useContext(BlogDataContext);
  if (!ctx) throw new Error('useBlogData must be used within BlogDataProvider');
  return ctx;
}
