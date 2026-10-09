import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { posts } from '../../../test/fixtures';
import { PostCard, PostCardSkeleton } from './PostCard';

const post = posts[2];

const renderCard = (props: Partial<Parameters<typeof PostCard>[0]> = {}) =>
  render(
    <MemoryRouter>
      <PostCard post={post} {...props} />
    </MemoryRouter>,
  );

describe('PostCard', () => {
  it('links to the post detail page', () => {
    renderCard();
    expect(screen.getByRole('link')).toHaveAttribute('href', `/posts/${post.id}`);
  });

  it('shows title, formatted date, author and plain-text excerpt', () => {
    const { container } = renderCard();

    expect(screen.getByRole('heading', { name: post.title })).toBeInTheDocument();
    expect(container.querySelector('time')).toHaveAttribute('datetime', post.createdAt);
    expect(screen.getByText('Nov 10, 2023')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(`First paragraph of ${post.title}. Second paragraph.`)).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('src', post.thumbnail_url);
  });

  it('lists the categories', () => {
    renderCard();
    const list = screen.getByRole('list', { name: 'Categories' });
    expect(list).toHaveTextContent('Tech');
    expect(list).toHaveTextContent('Travel');
  });

  it('hides the category list when the post has none', () => {
    renderCard({ post: posts[3] });
    expect(screen.queryByRole('list', { name: 'Categories' })).not.toBeInTheDocument();
  });

  it('marks the excerpt as compact when asked', () => {
    renderCard({ compact: true });
    expect(screen.getByText(/First paragraph/)).toHaveAttribute('data-compact', 'true');
  });
});

describe('PostCardSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<PostCardSkeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
