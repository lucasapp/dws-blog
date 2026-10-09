import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import { mockApi } from './test/utils';

describe('App', () => {
  it('navigates from the post list to the post detail page and back', async () => {
    mockApi();
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'DWS blog' })).toBeInTheDocument();
    await userEvent.click(await screen.findByRole('link', { name: /Best Hiking Trails in Asia/ }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Best Hiking Trails in Asia' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/posts/p2');

    await userEvent.click(screen.getByRole('link', { name: /home/i }));
    expect(await screen.findByRole('heading', { level: 1, name: 'DWS blog' })).toBeInTheDocument();
  });
});
