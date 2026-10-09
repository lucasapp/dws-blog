import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as client from './client';
import { authorsApi, categoriesApi, postsApi } from './endpoints';

describe('endpoints', () => {
  let requestSpy: ReturnType<typeof vi.spyOn>;
  const signal = new AbortController().signal;

  beforeEach(() => {
    requestSpy = vi.spyOn(client, 'request').mockResolvedValue([]);
  });

  it.each([
    ['postsApi.list', () => postsApi.list(signal), '/posts/'],
    ['postsApi.get', () => postsApi.get('p1', signal), '/posts/p1'],
    ['authorsApi.list', () => authorsApi.list(signal), '/authors/'],
    ['authorsApi.get', () => authorsApi.get('a1', signal), '/authors/a1'],
    ['categoriesApi.list', () => categoriesApi.list(signal), '/categories/'],
    ['categoriesApi.get', () => categoriesApi.get('c1', signal), '/categories/c1'],
  ])('%s requests the right path', async (_name, call, path) => {
    await call();
    expect(requestSpy).toHaveBeenCalledWith(path, signal);
  });

  it('returns whatever the client resolves', async () => {
    requestSpy.mockResolvedValue({ id: 'p1' });
    await expect(postsApi.get('p1')).resolves.toEqual({ id: 'p1' });
  });
});
