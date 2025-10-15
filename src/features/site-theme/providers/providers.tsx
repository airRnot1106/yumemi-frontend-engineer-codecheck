'use client';

import { type FC, type ReactNode, useLayoutEffect } from 'react';
import { SiteThemeContext } from '../contexts';
import { useSiteTheme } from '../hooks/use-site-theme';
import { SiteTheme } from '../models';

export type SiteThemeProviderProps = {
  value: SiteTheme;
  children: ReactNode;
};

export const SiteThemeProvider: FC<SiteThemeProviderProps> = ({
  value,
  children,
}) => {
  const { theme, setting } = useSiteTheme();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', setting);
  }, [setting]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      '--color-mix-ratio',
      theme === SiteTheme.enum.light ? '7%' : '12%',
    );
  }, [theme]);

  return <SiteThemeContext value={value}>{children}</SiteThemeContext>;
};
