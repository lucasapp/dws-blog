import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('shows the given message', () => {
    render(<ErrorState message="Request failed (500)" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Request failed (500)')).toBeInTheDocument();
  });

  it('falls back to a generic message', () => {
    render(<ErrorState message={null} />);
    expect(screen.getByText('We could not load the content. Please try again.')).toBeInTheDocument();
  });

  it('shows a retry button only when onRetry is given', async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<ErrorState />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<ErrorState onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
