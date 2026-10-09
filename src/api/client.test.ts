import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, request } from './client';

const BASE_URL = 'https://tech-test-backend.dwsbrazil.io';

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init });

describe('request', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    return () => vi.unstubAllGlobals();
  });

  it('calls the API base URL with JSON headers and returns the parsed body', async () => {
    fetchMock.mockResolvedValue(jsonResponse([{ id: '1' }]));
    const signal = new AbortController().signal;

    await expect(request('/posts/', signal)).resolves.toEqual([{ id: '1' }]);
    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/posts/`, {
      signal,
      headers: { Accept: 'application/json' },
    });
  });

  it('throws a "Not found" ApiError on 404', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status: 404 }));

    const error = await request('/posts/x').catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: 'Not found', status: 404, name: 'ApiError' });
  });

  it('throws an ApiError with the status code on other failures', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, { status: 500 }));

    await expect(request('/posts/')).rejects.toMatchObject({ message: 'Request failed (500)', status: 500 });
  });

  it('throws a friendly ApiError when the network fails', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(request('/posts/')).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Network error. Please check your connection.',
    });
  });

  it('rethrows AbortError untouched so callers can ignore cancelled requests', async () => {
    const abort = new DOMException('Aborted', 'AbortError');
    fetchMock.mockRejectedValue(abort);

    await expect(request('/posts/')).rejects.toBe(abort);
  });
});
