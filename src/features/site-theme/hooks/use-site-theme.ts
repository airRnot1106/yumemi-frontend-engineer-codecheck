'use client';

import { getCookie, setCookie } from 'cookies-next/client';
import { useContext, useSyncExternalStore } from 'react';
import { useMatchMedia } from '../../../hooks/use-match-media';
import { SiteThemeContext } from '../contexts';
import { SITE_THEME_KEY, SiteTheme } from '../models';

type Listener = () => void;

const globalListeners = new Set<Listener>();

const subscribe = (listener: Listener) => {
  globalListeners.add(listener);
  return () => {
    globalListeners.delete(listener);
  };
};

const getSiteTheme = () =>
  SiteTheme.default(SiteTheme.enum.system).parse(getCookie(SITE_THEME_KEY));

export const useSiteTheme = () => {
  const serverValue = useContext(SiteThemeContext);

  const setting = useSyncExternalStore(
    subscribe,
    getSiteTheme,
    () => serverValue ?? SiteTheme.enum.system,
  );

  const prefer = useMatchMedia(
    '(prefers-color-scheme: dark)',
    setting === SiteTheme.enum.dark,
  )
    ? SiteTheme.enum.dark
    : SiteTheme.enum.light;

  const setTheme = (theme: SiteTheme) => {
    setCookie(SITE_THEME_KEY, theme);
    globalListeners.forEach((listener) => {
      listener();
    });
  };

  return {
    theme: setting === SiteTheme.enum.system ? prefer : setting,
    setting,
    setTheme,
  };
};

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = import.meta.vitest;

  describe('subscribe', () => {
    beforeEach(() => {
      globalListeners.clear();
    });

    it('should add and remove listener', () => {
      const listener = vi.fn();
      const unsubscribe = subscribe(listener);

      expect(globalListeners.has(listener)).toBe(true);

      unsubscribe();

      expect(globalListeners.has(listener)).toBe(false);
    });

    it('should notify all listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      subscribe(listener1);
      subscribe(listener2);

      globalListeners.forEach((listener) => {
        listener();
      });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });
}
