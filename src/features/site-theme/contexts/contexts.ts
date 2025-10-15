'use client';

import { createContext } from 'react';
import type { SiteTheme } from '../models';

type SiteThemeValue = SiteTheme | undefined;

export const SiteThemeContext = createContext<SiteThemeValue>(undefined);
