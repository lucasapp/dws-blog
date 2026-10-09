import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label as a non-submitting button', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders the icon before the label', () => {
    render(<Button icon={<svg data-testid="icon" />}>Back</Button>);
    const button = screen.getByRole('button', { name: 'Back' });
    expect(button.firstChild).toBe(screen.getByTestId('icon'));
  });

  it('forwards extra attributes and merges className', () => {
    render(
      <Button className="custom" aria-disabled="true" type="submit">
        Send
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Send' });
    expect(button).toHaveClass('custom');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
