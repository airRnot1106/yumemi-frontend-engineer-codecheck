import 'server-only';

import { cookies } from 'next/headers';
import { SITE_THEME_KEY, SiteTheme } from '../models';

export const getSiteThemeFromCookies = async () =>
  SiteTheme.default(SiteTheme.enum.system).parse(
    (await cookies()).get(SITE_THEME_KEY)?.value,
  );
