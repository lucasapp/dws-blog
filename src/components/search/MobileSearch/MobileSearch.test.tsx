import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFilters } from '../../../context/filters';
import { mockApi, renderWithProviders } from '../../../test/utils';
import { MobileSearch } from './MobileSearch';

function CurrentSearch() {
  return <output data-testid="search">{useFilters().search}</output>;
}

describe('MobileSearch', () => {
  let onClose: ReturnType<typeof vi.fn<() => void>>;

  beforeEach(() => {
    mockApi();
    onClose = vi.fn<() => void>();
    renderWithProviders(
      <>
        <MobileSearch onClose={onClose} />
        <CurrentSearch />
      </>,
      { route: '/' },
    );
  });

  const input = () => screen.getByRole('searchbox', { name: 'Search posts' });

  it('opens as a modal dialog with the field focused and page scroll locked', () => {
    expect(screen.getByRole('dialog', { name: 'Search' })).toHaveAttribute('aria-modal', 'true');
    expect(input()).toHaveFocus();
    expect(document.body).toHaveClass('no-scroll');
  });

  it('suggests matching posts as the user types (accent-insensitive)', async () => {
    await userEvent.type(input(), 'cafe');
    expect(await screen.findByRole('button', { name: 'Café Culture Around the World' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Hiking/ })).not.toBeInTheDocument();
  });

  it('matches by author and category too', async () => {
    await userEvent.type(input(), 'john');
    expect(await screen.findByRole('button', { name: 'Best Hiking Trails in Asia' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Café Culture Around the World' })).toBeInTheDocument();
  });

  it('shows a message when nothing matches', async () => {
    await userEvent.type(input(), 'zzz');
    expect(screen.getByText('No results for “zzz”')).toBeInTheDocument();
  });

  it('opens a post when a suggestion is chosen', async () => {
    await userEvent.type(input(), 'hiking');
    await userEvent.click(await screen.findByRole('button', { name: 'Best Hiking Trails in Asia' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/posts/p2');
    expect(onClose).toHaveBeenCalled();
  });

  it('applies the search and goes home on submit', async () => {
    await userEvent.type(input(), 'tech{Enter}');

    expect(screen.getByTestId('search')).toHaveTextContent('tech');
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape and with the back button', async () => {
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Close search' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
