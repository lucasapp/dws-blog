import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon, type IconName } from './Icon';

const names: IconName[] = ['search', 'chevron-down', 'close', 'arrow-left', 'sort', 'filters'];

describe('Icon', () => {
  it.each(names)('renders the "%s" icon as a decorative svg', (name) => {
    const { container } = render(<Icon name={name} />);
    const svg = container.querySelector('svg')!;

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg.querySelector('path')).not.toBeNull();
  });

  it('defaults to 24px and accepts a custom size', () => {
    const { container, rerender } = render(<Icon name="search" />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '24');

    rerender(<Icon name="search" size={16} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '16');
    expect(container.querySelector('svg')).toHaveAttribute('height', '16');
  });

  it('forwards extra svg props', () => {
    const { container } = render(<Icon name="close" className="x" />);
    expect(container.querySelector('svg')).toHaveClass('x');
  });
});
