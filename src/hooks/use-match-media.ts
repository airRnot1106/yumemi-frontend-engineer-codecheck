'use client';

import { useSyncExternalStore } from 'react';

export const useMatchMedia = (
  mediaQuery: string,
  initialState = false,
): boolean => {
  const matchMediaList =
    typeof window === 'undefined' ? undefined : window.matchMedia(mediaQuery);

  const subscribe = (onStoreChange: () => void) => {
    matchMediaList?.addEventListener('change', onStoreChange);
    return () => matchMediaList?.removeEventListener('change', onStoreChange);
  };

  return useSyncExternalStore(
    subscribe,
    () => matchMediaList?.matches ?? initialState,
    () => initialState,
  );
};

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach, vi } = import.meta.vitest;
  const { renderHook, waitFor } = await import('@testing-library/react');

  describe('useMatchMedia', () => {
    let listeners: Array<(event: MediaQueryListEvent) => void> = [];

    beforeEach(() => {
      listeners = [];
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, listener: () => void) => {
          if (event === 'change') {
            listeners.push(listener);
          }
        }),
        removeEventListener: vi.fn((event: string, listener: () => void) => {
          if (event === 'change') {
            listeners = listeners.filter((l) => l !== listener);
          }
        }),
        dispatchEvent: vi.fn(),
      }));

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });
    });

    it('should return initialState when matchMedia is not available', () => {
      const { result } = renderHook(() =>
        useMatchMedia('(prefers-color-scheme: dark)', true),
      );
      expect(result.current).toBe(false);
    });

    it('should return matches value from matchMedia', () => {
      window.matchMedia = vi.fn((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })) as typeof window.matchMedia;

      const { result } = renderHook(() =>
        useMatchMedia('(prefers-color-scheme: dark)'),
      );
      expect(result.current).toBe(true);
    });

    it('should update when media query changes', async () => {
      let currentMatches = false;
      const mockMatchMedia = vi.fn((query: string) => ({
        get matches() {
          return currentMatches;
        },
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, listener: () => void) => {
          if (event === 'change') {
            listeners.push(listener);
          }
        }),
        removeEventListener: vi.fn((event: string, listener: () => void) => {
          if (event === 'change') {
            listeners = listeners.filter((l) => l !== listener);
          }
        }),
        dispatchEvent: vi.fn(),
      }));

      window.matchMedia = mockMatchMedia as typeof window.matchMedia;

      const { result } = renderHook(() =>
        useMatchMedia('(prefers-color-scheme: dark)'),
      );

      expect(result.current).toBe(false);

      currentMatches = true;
      listeners.forEach((listener) => {
        listener({ matches: true } as MediaQueryListEvent);
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });
  });
}
