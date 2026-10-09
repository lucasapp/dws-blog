import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { authors, categories, posts } from '../test/fixtures';
import { mockApi } from '../test/utils';
import { useBlogData } from './blogData';
import { BlogDataProvider } from './BlogDataContext';

const renderBlogData = () => renderHook(() => useBlogData(), { wrapper: BlogDataProvider });

describe('BlogDataProvider', () => {
  it('starts loading and then exposes posts, authors and categories', async () => {
    mockApi();
    const { result } = renderBlogData();

    expect(result.current.status).toBe('loading');
    expect(result.current.posts).toEqual([]);

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.posts).toEqual(posts);
    expect(result.current.authors).toEqual(authors);
    expect(result.current.categories).toEqual(categories);
    expect(result.current.error).toBeNull();
  });

  it('passes an abort signal to every request', async () => {
    const api = mockApi();
    renderBlogData();

    await waitFor(() => expect(api.postsList).toHaveBeenCalled());
    for (const spy of [api.postsList, api.authorsList, api.categoriesList]) {
      expect(spy).toHaveBeenCalledWith(expect.any(AbortSignal));
    }
  });

  it('looks posts up by id', async () => {
    mockApi();
    const { result } = renderBlogData();
    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(result.current.getPostById('p2')).toEqual(posts[1]);
    expect(result.current.getPostById('missing')).toBeUndefined();
  });

  it('exposes the error message when a request fails', async () => {
    mockApi({ error: new Error('Request failed (500)') });
    const { result } = renderBlogData();

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toBe('Request failed (500)');
  });

  it('reload() clears the error, goes back to loading and fetches again', async () => {
    const api = mockApi({ error: new Error('Request failed (500)') });
    const { result } = renderBlogData();
    await waitFor(() => expect(result.current.status).toBe('error'));

    api.postsList.mockResolvedValue(posts);
    api.authorsList.mockResolvedValue(authors);
    api.categoriesList.mockResolvedValue(categories);
    act(() => result.current.reload());

    expect(result.current.status).toBe('loading');
    expect(result.current.error).toBeNull();
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.posts).toEqual(posts);
    expect(api.postsList).toHaveBeenCalledTimes(2);
  });

  it('ignores aborted requests instead of reporting an error', async () => {
    const api = mockApi();
    api.postsList.mockRejectedValue(new DOMException('Aborted', 'AbortError'));
    const { result } = renderBlogData();

    await waitFor(() => expect(api.postsList).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.status).toBe('loading');
    expect(result.current.error).toBeNull();
  });

  it('aborts the pending requests when unmounted', async () => {
    const api = mockApi();
    api.postsList.mockImplementation(() => new Promise(() => {}));
    const { unmount } = renderBlogData();

    await waitFor(() => expect(api.postsList).toHaveBeenCalled());
    const signal = api.postsList.mock.calls[0][0]!;
    unmount();
    expect(signal.aborted).toBe(true);
  });
});

describe('useBlogData', () => {
  it('throws when used outside BlogDataProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useBlogData())).toThrow('useBlogData must be used within BlogDataProvider');
  });
});
