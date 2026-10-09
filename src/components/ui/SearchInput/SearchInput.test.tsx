import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SearchButton, SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders a labelled search field', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search posts' })).toHaveAttribute('placeholder', 'Search');
  });

  it('reports typed text through onChange', async () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);

    await userEvent.type(screen.getByRole('searchbox'), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('calls onSubmit on Enter without reloading the page', async () => {
    const onSubmit = vi.fn();
    render(<SearchInput value="tech" onChange={() => {}} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByRole('searchbox'), '{Enter}');
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('submits through the round search button in the default variant', async () => {
    const onSubmit = vi.fn();
    render(<SearchInput value="" onChange={() => {}} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  describe('"back" variant', () => {
    it('shows a back button instead of the search button', async () => {
      const onBack = vi.fn();
      render(<SearchInput value="" onChange={() => {}} variant="back" onBack={onBack} />);

      expect(screen.queryByRole('button', { name: 'Search' })).not.toBeInTheDocument();
      expect(screen.getByRole('searchbox')).not.toHaveAttribute('placeholder');

      await userEvent.click(screen.getByRole('button', { name: 'Close search' }));
      expect(onBack).toHaveBeenCalledOnce();
    });

    it('shows a clear button only when there is text', async () => {
      const onChange = vi.fn();
      const { rerender } = render(<SearchInput value="" onChange={onChange} variant="back" />);
      expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

      rerender(<SearchInput value="tech" onChange={onChange} variant="back" />);
      await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  it('uses the given id for the input and its label', () => {
    render(<SearchInput id="desktop-search" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Search posts')).toHaveAttribute('id', 'desktop-search');
  });

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} value="" onChange={() => {}} />);
    expect(ref.current).toBe(screen.getByRole('searchbox'));
  });
});

describe('SearchButton', () => {
  it('is a plain button by default and calls onClick', async () => {
    const onClick = vi.fn();
    render(<SearchButton onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Search' });

    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
