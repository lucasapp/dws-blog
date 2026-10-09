import type { Author, Category, Post } from '../types';
import { request } from './client';

export const postsApi = {
  list: (signal?: AbortSignal) => request<Post[]>('/posts/', signal),
  get: (id: string, signal?: AbortSignal) => request<Post>(`/posts/${id}`, signal),
};

export const authorsApi = {
  list: (signal?: AbortSignal) => request<Author[]>('/authors/', signal),
  get: (id: string, signal?: AbortSignal) => request<Author>(`/authors/${id}`, signal),
};

export const categoriesApi = {
  list: (signal?: AbortSignal) => request<Category[]>('/categories/', signal),
  get: (id: string, signal?: AbortSignal) => request<Category>(`/categories/${id}`, signal),
};
