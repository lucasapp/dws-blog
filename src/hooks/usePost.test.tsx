import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BlogDataProvider } from '../context/BlogDataContext';
import { posts } from '../test/fixtures';
import { mockApi } from '../test/utils';
import { usePost } from './usePost';

const renderUsePost = (id: string) =>
  renderHook(({ id }) => usePost(id), { wrapper: BlogDataProvider, initialProps: { id } });

describe('usePost', () => {
  it('uses the post from the cached list once it is loaded', async () => {
    const api = mockApi();
    api.postsGet.mockImplementation(() => new Promise(() => {}));
    const { result } = renderUsePost('p1');

    await waitFor(() => expect(result.current).toEqual({ post: posts[0], loading: false, error: null }));
  });

  it('fetches the post when it is not in the cached list', async () => {
    const api = mockApi();
    api.postsList.mockResolvedValue([]);
    const { result } = renderUsePost('p3');

    expect(result.current).toEqual({ post: null, loading: true, error: null });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current).toEqual({ post: posts[2], loading: false, error: null });
    expect(api.postsGet).toHaveBeenCalledWith('p3', expect.any(AbortSignal));
  });

  it('reports the error when the post cannot be fetched', async () => {
    const api = mockApi();
    api.postsList.mockResolvedValue([]);
    const { result } = renderUsePost('missing');

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current).toEqual({ post: null, loading: false, error: 'Not found' });
  });

  it('goes back to loading when the id changes, then shows the new post', async () => {
    const api = mockApi();
    api.postsList.mockResolvedValue([]);
    const { result, rerender } = renderUsePost('p1');
    await waitFor(() => expect(result.current.post?.id).toBe('p1'));

    rerender({ id: 'p2' });
    expect(result.current).toEqual({ post: null, loading: true, error: null });
    await waitFor(() => expect(result.current.post?.id).toBe('p2'));
  });

  it('aborts the pending request when unmounted', async () => {
    const api = mockApi();
    api.postsList.mockImplementation(() => new Promise(() => {}));
    api.postsGet.mockImplementation(() => new Promise(() => {}));
    const { unmount } = renderUsePost('p1');

    await waitFor(() => expect(api.postsGet).toHaveBeenCalled());
    const signal = api.postsGet.mock.calls[0][1]!;
    unmount();
    expect(signal.aborted).toBe(true);
  });
});
