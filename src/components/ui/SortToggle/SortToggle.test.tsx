import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FiltersProvider } from '../../../context/FiltersContext';
import { SortToggle } from './SortToggle';

const renderToggle = (showLabel?: boolean) =>
  render(
    <FiltersProvider>
      <SortToggle showLabel={showLabel} />
    </FiltersProvider>,
  );

describe('SortToggle', () => {
  it('starts as "Newest first"', () => {
    renderToggle();
    expect(screen.getByRole('button')).toHaveTextContent('Newest first');
    expect(screen.getByRole('button')).toHaveAccessibleName('Sorted by newest first. Change to oldest first');
  });

  it('switches between newest and oldest on each click', async () => {
    renderToggle();
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(button).toHaveTextContent('Oldest first');
    expect(button).toHaveAccessibleName('Sorted by oldest first. Change to newest first');

    await userEvent.click(button);
    expect(button).toHaveTextContent('Newest first');
  });

  it('shows the "Sort by:" label only when asked', () => {
    const { unmount } = renderToggle();
    expect(screen.queryByText('Sort by:')).not.toBeInTheDocument();
    unmount();

    renderToggle(true);
    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });
});
