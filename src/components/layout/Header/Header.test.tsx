import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { useFilters } from '../../../context/filters';
import { mockApi, renderWithProviders } from '../../../test/utils';
import { Header } from './Header';

function CurrentSearch() {
  return <output data-testid="search">{useFilters().search}</output>;
}

const renderHeader = (route = '/') =>
  renderWithProviders(
    <>
      <Header />
      <CurrentSearch />
    </>,
    { route },
  );

describe('Header', () => {
  beforeEach(() => {
    mockApi();
  });

  it('links the logo to the home page', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
  });

  it('updates the global search as the user types', async () => {
    renderHeader();
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search posts' }), 'tech');
    expect(screen.getByTestId('search')).toHaveTextContent('tech');
  });

  it('goes back to the home page when searching from another page', async () => {
    renderHeader('/posts/p1');
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search posts' }), 't');
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
  });

  it('goes home when the search form is submitted', async () => {
    renderHeader('/posts/p1');
    const desktopForm = screen.getByRole('search');
    await userEvent.click(within(desktopForm).getByRole('button', { name: 'Search' }));
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
  });

  it('opens and closes the mobile search overlay', async () => {
    renderHeader();
    const [, mobileButton] = screen.getAllByRole('button', { name: 'Search' });

    await userEvent.click(mobileButton);
    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Close search' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
