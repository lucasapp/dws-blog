import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders its content', () => {
    render(<Chip>Tech</Chip>);
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });
});
