import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { useFilters } from '../../../context/filters';
import { mockApi, renderWithProviders } from '../../../test/utils';
import { FilterSidebar } from './FilterSidebar';

function AppliedFilters() {
  const { filters, resetAll } = useFilters();
  return (
    <>
      <output data-testid="applied">{JSON.stringify(filters)}</output>
      <button onClick={resetAll}>reset</button>
    </>
  );
}

const applied = () => JSON.parse(screen.getByTestId('applied').textContent!);

describe('FilterSidebar', () => {
  beforeEach(() => {
    mockApi();
    renderWithProviders(
      <>
        <FilterSidebar />
        <AppliedFilters />
      </>,
    );
  });

  it('lists categories and authors from the API', async () => {
    expect(await screen.findByRole('checkbox', { name: 'Tech' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Travel' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Jane Doe' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'John Smith' })).toBeInTheDocument();
  });

  it('keeps selections as a draft until "Apply filters" is pressed', async () => {
    const apply = screen.getByRole('button', { name: 'Apply filters' });
    expect(apply).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(await screen.findByRole('checkbox', { name: 'Tech' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'John Smith' }));

    expect(screen.getByRole('checkbox', { name: 'Tech' })).toBeChecked();
    expect(apply).toHaveAttribute('aria-disabled', 'false');
    expect(applied()).toEqual({ categoryIds: [], authorIds: [] });

    await userEvent.click(apply);
    expect(applied()).toEqual({ categoryIds: ['c1'], authorIds: ['a2'] });
    expect(apply).toHaveAttribute('aria-disabled', 'true');
  });

  it('unchecks an item when clicked again', async () => {
    const tech = await screen.findByRole('checkbox', { name: 'Tech' });
    await userEvent.click(tech);
    await userEvent.click(tech);
    expect(tech).not.toBeChecked();
  });

  it('shows a section clear button only while that section has applied filters', async () => {
    const clearButton = () => screen.queryByRole('button', { name: 'Clear Category filter' });
    const tech = await screen.findByRole('checkbox', { name: 'Tech' });
    expect(clearButton()).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear Author filter' })).not.toBeInTheDocument();

    await userEvent.click(tech);
    expect(clearButton()).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(clearButton()).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear Author filter' })).not.toBeInTheDocument();

    await userEvent.click(tech);
    expect(clearButton()).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(clearButton()).not.toBeInTheDocument();
  });

  it('clears only the categories, keeping the other section intact', async () => {
    await userEvent.click(await screen.findByRole('checkbox', { name: 'Tech' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'John Smith' }));
    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Travel' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Jane Doe' }));

    await userEvent.click(screen.getByRole('button', { name: 'Clear Category filter' }));

    expect(screen.getByRole('checkbox', { name: 'Tech' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Travel' })).not.toBeChecked();
    expect(applied()).toEqual({ categoryIds: [], authorIds: ['a2'] });
    expect(screen.getByRole('checkbox', { name: 'John Smith' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Jane Doe' })).toBeChecked();
    expect(screen.queryByRole('button', { name: 'Clear Category filter' })).not.toBeInTheDocument();
  });

  it('clears only the authors', async () => {
    await userEvent.click(await screen.findByRole('checkbox', { name: 'Tech' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'John Smith' }));
    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));

    await userEvent.click(screen.getByRole('button', { name: 'Clear Author filter' }));

    expect(screen.getByRole('checkbox', { name: 'John Smith' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Tech' })).toBeChecked();
    expect(applied()).toEqual({ categoryIds: ['c1'], authorIds: [] });
  });

  it('syncs the draft when filters are reset elsewhere', async () => {
    await userEvent.click(await screen.findByRole('checkbox', { name: 'Tech' }));
    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));

    await userEvent.click(screen.getByRole('button', { name: 'reset' }));
    expect(screen.getByRole('checkbox', { name: 'Tech' })).not.toBeChecked();
  });
});
