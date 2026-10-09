import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Header } from '../../components/layout/Header/Header';
import { mockApi, mockMatchMedia, renderWithProviders } from '../../test/utils';
import { Home } from './Home';

const postsRegion = () => screen.getByRole('region', { name: 'Posts' });
const titles = () => within(postsRegion()).queryAllByRole('heading', { level: 3 }).map((h) => h.textContent);

const renderHome = () =>
  renderWithProviders(
    <>
      <Header />
      <Home />
    </>,
  );

describe('Home', () => {
  it('shows skeletons while loading, then the posts newest first', async () => {
    mockApi();
    renderHome();

    expect(within(postsRegion()).getByRole('list', { busy: true })).toBeInTheDocument();
    await waitFor(() =>
      expect(titles()).toEqual([
        'Best Hiking Trails in Asia',
        'Café Culture Around the World',
        'Tech Innovations in Healthcare',
        'Remote Work Tools',
      ]),
    );
  });

  it('reverses the order with the sort toggle', async () => {
    mockApi();
    renderHome();
    await screen.findByText('Remote Work Tools');

    await userEvent.click(screen.getByRole('button', { name: /Sorted by newest first/ }));
    expect(titles()[0]).toBe('Remote Work Tools');
  });

  it('filters posts by category and author with the mobile dropdowns', async () => {
    mockApi();
    renderHome();
    await screen.findByText('Remote Work Tools');

    await userEvent.click(screen.getByRole('button', { name: 'Category' }));
    await userEvent.click(screen.getByRole('option', { name: 'Tech' }));
    expect(titles()).toEqual(['Tech Innovations in Healthcare', 'Remote Work Tools']);

    await userEvent.click(screen.getByRole('button', { name: 'Author' }));
    await userEvent.click(screen.getByRole('option', { name: 'John Smith' }));
    expect(titles()).toEqual([]);
  });

  it('filters posts by the header search', async () => {
    mockApi();
    renderHome();
    await screen.findByText('Remote Work Tools');

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search posts' }), 'remote');
    expect(titles()).toEqual(['Remote Work Tools']);
  });

  it('offers to clear search and filters when nothing matches', async () => {
    mockApi();
    renderHome();
    await screen.findByText('Remote Work Tools');

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search posts' }), 'zzz');
    expect(screen.getByText('No posts found')).toBeInTheDocument();
    expect(screen.getByText(/Try adjusting your search/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Clear search and filters' }));
    expect(titles()).toHaveLength(4);
  });

  it('explains when there are no posts at all', async () => {
    mockApi({ posts: [] });
    renderHome();

    expect(await screen.findByText('There are no posts published yet.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear search and filters' })).not.toBeInTheDocument();
  });

  it('shows the error and retries the request', async () => {
    const api = mockApi({ error: new Error('Request failed (500)') });
    renderHome();

    expect(await screen.findByText('Request failed (500)')).toBeInTheDocument();

    api.postsList.mockResolvedValue([]);
    api.authorsList.mockResolvedValue([]);
    api.categoriesList.mockResolvedValue([]);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('No posts found')).toBeInTheDocument();
    expect(api.postsList).toHaveBeenCalledTimes(2);
  });

  it('shows the filter sidebar instead of dropdowns on desktop', async () => {
    mockMatchMedia(true);
    mockApi();
    renderHome();

    expect(await screen.findByRole('complementary', { name: 'Filters' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Category' })).not.toBeInTheDocument();
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });
});
