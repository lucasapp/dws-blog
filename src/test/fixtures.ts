import type { Author, Category, Post } from '../types';

export const authors: Author[] = [
  { id: 'a1', name: 'Jane Doe', profilePicture: 'https://example.com/jane.png' },
  { id: 'a2', name: 'John Smith', profilePicture: 'https://example.com/john.png' },
];

export const categories: Category[] = [
  { id: 'c1', name: 'Tech' },
  { id: 'c2', name: 'Travel' },
];

const makePost = (id: string, title: string, createdAt: string, author: Author, cats: Category[]): Post => ({
  id,
  title,
  content: `<p>First paragraph of ${title}.</p><p>Second paragraph.</p>`,
  thumbnail_url: `https://example.com/${id}.jpg`,
  authorId: author.id,
  author,
  categories: cats,
  createdAt,
  updatedAt: createdAt,
});

export const posts: Post[] = [
  makePost('p1', 'Tech Innovations in Healthcare', '2024-01-20T10:00:00.000Z', authors[0], [categories[0]]),
  makePost('p2', 'Best Hiking Trails in Asia', '2024-03-05T10:00:00.000Z', authors[1], [categories[1]]),
  makePost('p3', 'Remote Work Tools', '2023-11-10T10:00:00.000Z', authors[0], [categories[0], categories[1]]),
  makePost('p4', 'Café Culture Around the World', '2024-02-14T10:00:00.000Z', authors[1], []),
];
