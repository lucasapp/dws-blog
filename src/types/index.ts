export interface Author {
  id: string;
  name: string;
  profilePicture: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string;
  authorId: string;
  author: Author;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export type SortOrder = 'newest' | 'oldest';

export interface Filters {
  categoryIds: string[];
  authorIds: string[];
}
