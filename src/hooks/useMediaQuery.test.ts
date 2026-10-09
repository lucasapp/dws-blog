import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useIsDesktop, useMediaQuery } from './useMediaQuery';

function installMatchMedia(initialWidth: number) {
  let width = initialWidth;
  const listeners = new Set<() => void>();
  const matches = (query: string) => width >= Number(/min-width:\s*(\d+)px/.exec(query)?.[1] ?? 0);

  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return matches(query);
        },
        media: query,
        addEventListener: (_: string, cb: () => void) => listeners.add(cb),
        removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
      }) as unknown as MediaQueryList,
  );

  return {
    listeners,
    setWidth(next: number) {
      width = next;
      listeners.forEach((cb) => cb());
    },
  };
}

describe('useMediaQuery', () => {
  let screen: ReturnType<typeof installMatchMedia>;

  beforeEach(() => {
    screen = installMatchMedia(800);
  });

  it('returns whether the query currently matches', () => {
    expect(renderHook(() => useMediaQuery('(min-width: 768px)')).result.current).toBe(true);
    expect(renderHook(() => useMediaQuery('(min-width: 1024px)')).result.current).toBe(false);
  });

  it('updates when the media query result changes', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    act(() => screen.setWidth(1200));
    expect(result.current).toBe(true);
    act(() => screen.setWidth(500));
    expect(result.current).toBe(false);
  });

  it('re-evaluates when the query changes', () => {
    const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(min-width: 768px)' },
    });
    expect(result.current).toBe(true);

    rerender({ query: '(min-width: 1024px)' });
    expect(result.current).toBe(false);
  });

  it('unsubscribes when unmounted', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(screen.listeners.size).toBeGreaterThan(0);

    unmount();
    expect(screen.listeners.size).toBe(0);
  });
});

describe('useIsDesktop', () => {
  it('matches from 1024px up', () => {
    const screen = installMatchMedia(1023);
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);

    act(() => screen.setWidth(1024));
    expect(result.current).toBe(true);
  });
});
