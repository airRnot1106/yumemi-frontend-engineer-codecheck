import z from 'zod';

const SiteThemeKey = 'site-theme' as const;

const SiteThemeSchema = z.enum(['light', 'dark', 'system']);

export type SiteTheme = z.infer<typeof SiteThemeSchema>;

export const SiteTheme = {
  key: SiteThemeKey,
  schema: SiteThemeSchema,
};
