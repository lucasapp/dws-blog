import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { posts } from '../../../test/fixtures';
import { PostGrid } from './PostGrid';

const renderGrid = (props: Partial<Parameters<typeof PostGrid>[0]> = {}) =>
  render(
    <MemoryRouter>
      <PostGrid posts={posts} {...props} />
    </MemoryRouter>,
  );

describe('PostGrid', () => {
  it('renders one card per post', () => {
    renderGrid();
    expect(screen.getAllByRole('heading').map((h) => h.textContent)).toEqual(posts.map((p) => p.title));
    expect(screen.queryByRole('list', { busy: true })).not.toBeInTheDocument();
  });

  it('renders skeletons instead of posts while loading', () => {
    renderGrid({ loading: true });
    const grid = screen.getByRole('list', { busy: true });

    expect(grid.children).toHaveLength(6);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('respects a custom skeleton count', () => {
    renderGrid({ loading: true, skeletonCount: 3 });
    expect(screen.getByRole('list', { busy: true }).children).toHaveLength(3);
  });

  it('renders compact cards in the "latest" variant', () => {
    renderGrid({ variant: 'latest', posts: posts.slice(0, 1) });
    expect(screen.getByText(/First paragraph/)).toHaveAttribute('data-compact', 'true');
  });
});
