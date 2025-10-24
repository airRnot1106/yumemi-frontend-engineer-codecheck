'use client';

import { useLayoutEffect, useSyncExternalStore } from 'react';
import { useMatchMedia } from '../../../hooks';
import { SiteTheme } from '../models';

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
  };
};

const getSetting = () =>
  SiteTheme.schema
    .catch(SiteTheme.schema.enum.system)
    .parse(localStorage.getItem(SiteTheme.key));

const setTheme = (theme: SiteTheme) => {
  localStorage.setItem(SiteTheme.key, theme);
  window.dispatchEvent(new Event('storage'));

  window.document.documentElement.dataset.theme = theme;
};

export const setStyles = (theme: SiteTheme) => {
  window.document.documentElement.style.setProperty(
    '--color-mix-ratio',
    theme === SiteTheme.schema.enum.light ? '7%' : '12%',
  );
};

export const useSiteTheme = () => {
  const setting = useSyncExternalStore(
    subscribe,
    getSetting,
    () => SiteTheme.schema.enum.system,
  );

  const prefer = useMatchMedia(
    '(prefers-color-scheme: dark)',
    setting === SiteTheme.schema.enum.dark,
  )
    ? SiteTheme.schema.enum.dark
    : SiteTheme.schema.enum.light;

  const theme = setting === SiteTheme.schema.enum.system ? prefer : setting;

  useLayoutEffect(() => {
    setStyles(theme);
  }, [theme]);

  return {
    theme,
    setting,
    setTheme,
  };
};
