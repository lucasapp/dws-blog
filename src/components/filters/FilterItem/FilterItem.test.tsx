import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterItem } from './FilterItem';

const renderItem = (selected: boolean, onToggle = vi.fn()) =>
  render(
    <ul>
      <FilterItem label="Tech" selected={selected} onToggle={onToggle} />
    </ul>,
  );

describe('FilterItem', () => {
  it('exposes its selected state as a checkbox', () => {
    const { unmount } = renderItem(false);
    expect(screen.getByRole('checkbox', { name: 'Tech' })).not.toBeChecked();
    unmount();

    renderItem(true);
    expect(screen.getByRole('checkbox', { name: 'Tech' })).toBeChecked();
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    renderItem(false, onToggle);

    await userEvent.click(screen.getByRole('checkbox', { name: 'Tech' }));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
