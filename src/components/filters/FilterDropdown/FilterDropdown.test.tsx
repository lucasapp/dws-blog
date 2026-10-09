import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { categories } from '../../../test/fixtures';
import { FilterDropdown } from './FilterDropdown';

const setup = (selectedIds: string[] = []) => {
  const props = { onToggle: vi.fn(), onClear: vi.fn() };
  render(
    <div>
      <FilterDropdown label="Category" options={categories} selectedIds={selectedIds} {...props} />
      <p>outside</p>
    </div>,
  );
  return props;
};

describe('FilterDropdown', () => {
  it('starts closed showing the label', () => {
    setup();
    const toggle = screen.getByRole('button', { name: 'Category' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens and closes the option list on click', async () => {
    setup();
    const toggle = screen.getByRole('button', { name: 'Category' });

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Tech', 'Travel']);

    await userEvent.click(toggle);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('toggles an option by click, Enter or Space', async () => {
    const { onToggle } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Category' }));

    await userEvent.click(screen.getByRole('option', { name: 'Tech' }));
    expect(onToggle).toHaveBeenLastCalledWith('c1');

    screen.getByRole('option', { name: 'Travel' }).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onToggle).toHaveBeenCalledTimes(3);
    expect(onToggle).toHaveBeenLastCalledWith('c2');
  });

  it('closes when clicking outside or pressing Escape', async () => {
    setup();
    const toggle = screen.getByRole('button', { name: 'Category' });

    await userEvent.click(toggle);
    await userEvent.click(screen.getByText('outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await userEvent.click(toggle);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows selected names and a clear button when there is a selection', async () => {
    const { onClear } = setup(['c1', 'c2']);

    expect(screen.getByRole('button', { name: 'Tech, Travel' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Clear Category filter' }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('marks selected options', async () => {
    setup(['c2']);
    await userEvent.click(screen.getByRole('button', { name: 'Travel' }));

    expect(screen.getByRole('option', { name: 'Tech' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('option', { name: 'Travel' })).toHaveAttribute('aria-selected', 'true');
  });
});
