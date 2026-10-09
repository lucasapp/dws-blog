import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title, description and action inside a status region', () => {
    render(<EmptyState title="No posts found" description="Try again." action={<button>Clear</button>} />);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('No posts found');
    expect(status).toHaveTextContent('Try again.');
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('omits the description when not given', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByRole('status').querySelectorAll('p')).toHaveLength(1);
  });
});
