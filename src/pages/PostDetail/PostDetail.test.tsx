import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi, renderWithProviders } from '../../test/utils';
import { PostDetail } from './PostDetail';

const renderDetail = (id: string) => renderWithProviders(<PostDetail />, { route: `/posts/${id}`, path: '/posts/:id' });

describe('PostDetail', () => {
  it('renders the article with author, date, cover and paragraphs', async () => {
    mockApi();
    const { container } = renderDetail('p1');

    expect(await screen.findByRole('heading', { level: 1, name: 'Tech Innovations in Healthcare' })).toBeInTheDocument();
    const article = screen.getByRole('heading', { level: 1 }).closest('article')!;
    expect(article).toHaveTextContent('Written by: Jane Doe');
    expect(within(article).getByText('Jan 20, 2024')).toBeInTheDocument();
    expect(within(article).getByText('First paragraph of Tech Innovations in Healthcare.')).toBeInTheDocument();
    expect(within(article).getByText('Second paragraph.')).toBeInTheDocument();
    expect(container.querySelector('figure img')).toHaveAttribute('src', 'https://example.com/p1.jpg');
  });

  it('lists up to three latest articles, excluding the current one', async () => {
    mockApi();
    renderDetail('p2');

    const latest = await screen.findByRole('region', { name: 'Latest articles' });
    await within(latest).findByText('Café Culture Around the World');
    expect(within(latest).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Café Culture Around the World',
      'Tech Innovations in Healthcare',
      'Remote Work Tools',
    ]);
  });

  it('fetches the post directly when it is not in the cached list', async () => {
    const api = mockApi();
    api.postsList.mockResolvedValue([]);
    renderDetail('p3');

    expect(await screen.findByRole('heading', { level: 1, name: 'Remote Work Tools' })).toBeInTheDocument();
    expect(api.postsGet).toHaveBeenCalledWith('p3', expect.any(AbortSignal));
  });

  it('shows a friendly message for an unknown post', async () => {
    mockApi();
    renderDetail('missing');

    expect(await screen.findByText('This post does not exist.')).toBeInTheDocument();
  });

  it('goes home with the Back button when there is no history', async () => {
    mockApi();
    renderDetail('p1');

    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
  });
});
