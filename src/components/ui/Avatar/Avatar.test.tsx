import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('shows the image when a src is given', () => {
    const { container } = render(<Avatar name="Jane Doe" src="https://example.com/jane.png" />);
    expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/jane.png');
    expect(screen.queryByText('JD')).not.toBeInTheDocument();
  });

  it('falls back to initials when there is no src', () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('falls back to initials when the image fails to load', () => {
    const { container } = render(<Avatar name="jane mary doe" src="broken.png" />);
    fireEvent.error(container.querySelector('img')!);

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('JM')).toBeInTheDocument();
  });

  it('applies the size to the wrapper', () => {
    const { container } = render(<Avatar name="Jane" size={48} />);
    expect(container.firstChild).toHaveStyle({ width: '48px', height: '48px' });
  });
});
