import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { BlogDataProvider } from '../../../context/BlogDataContext';
import { FiltersProvider } from '../../../context/FiltersContext';
import { mockApi } from '../../../test/utils';
import { Layout } from './Layout';

describe('Layout', () => {
  beforeEach(() => {
    mockApi();
    const router = createMemoryRouter([
      { element: <Layout />, children: [{ path: '/', element: <p>page content</p> }] },
    ]);
    render(
      <BlogDataProvider>
        <FiltersProvider>
          <RouterProvider router={router} />
        </FiltersProvider>
      </BlogDataProvider>,
    );
  });

  it('renders the header', () => {
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the current route inside <main>', () => {
    expect(screen.getByRole('main')).toHaveTextContent('page content');
  });

  it('keeps the decorative background hidden from assistive technology', () => {
    const background = screen.getByRole('banner').parentElement!.firstElementChild!;
    expect(background).toHaveAttribute('aria-hidden', 'true');
    expect(background.children).toHaveLength(3);
  });
});
