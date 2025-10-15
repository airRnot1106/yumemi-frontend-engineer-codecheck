import { z } from 'zod';

export const SiteTheme = z.enum(['light', 'dark', 'system']);
export type SiteTheme = z.infer<typeof SiteTheme>;

export const SITE_THEME_KEY = 'site-theme';
