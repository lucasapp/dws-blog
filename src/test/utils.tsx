import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import { authorsApi, categoriesApi, postsApi } from '../api/endpoints';
import { BlogDataProvider } from '../context/BlogDataContext';
import { FiltersProvider } from '../context/FiltersContext';
import * as fixtures from './fixtures';

export function mockApi(overrides: Partial<{ posts: typeof fixtures.posts; error: Error }> = {}) {
  const resolve = <T,>(data: T) => (overrides.error ? Promise.reject(overrides.error) : Promise.resolve(data));
  return {
    postsList: vi.spyOn(postsApi, 'list').mockImplementation(() => resolve(overrides.posts ?? fixtures.posts)),
    postsGet: vi.spyOn(postsApi, 'get').mockImplementation((id) => {
      const post = (overrides.posts ?? fixtures.posts).find((p) => p.id === id);
      return post ? Promise.resolve(post) : Promise.reject(new Error('Not found'));
    }),
    authorsList: vi.spyOn(authorsApi, 'list').mockImplementation(() => resolve(fixtures.authors)),
    categoriesList: vi.spyOn(categoriesApi, 'list').mockImplementation(() => resolve(fixtures.categories)),
  };
}

export function mockMatchMedia(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
}

function LocationDisplay() {
  const { pathname } = useLocation();
  return <div data-testid="location">{pathname}</div>;
}

interface Options {
  route?: string;
  path?: string;
}

export function renderWithProviders(ui: ReactElement, { route = '/', path = route }: Options = {}) {
  const router = createMemoryRouter(
    [
      {
        path,
        element: (
          <>
            {ui}
            <LocationDisplay />
          </>
        ),
      },
      { path: '*', element: <LocationDisplay /> },
    ],
    { initialEntries: [route] },
  );

  return {
    router,
    ...render(
      <BlogDataProvider>
        <FiltersProvider>
          <RouterProvider router={router} />
        </FiltersProvider>
      </BlogDataProvider>,
    ),
  };
}
