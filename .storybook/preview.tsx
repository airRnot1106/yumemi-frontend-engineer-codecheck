import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/nextjs-vite';
import { CookiesNextProvider } from 'cookies-next';
import { getCookie } from 'cookies-next/client';
import { useEffect, useState } from 'react';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { SITE_THEME_KEY, SiteTheme } from '../src/features/site-theme/models';
import { SiteThemeProvider } from '../src/features/site-theme/providers';

import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    viewport: {
      options: {
        xs: {
          name: 'Extra Small',
          styles: {
            width: '375px',
            height: '100%',
          },
        },
        sm: {
          name: 'Small',
          styles: {
            width: '640px',
            height: '100%',
          },
        },
        md: {
          name: 'Medium',
          styles: {
            width: '768px',
            height: '100%',
          },
        },
        lg: {
          name: 'Large',
          styles: {
            width: '1024px',
            height: '100%',
          },
        },
        xl: {
          name: 'Extra Large',
          styles: {
            width: '1280px',
            height: '100%',
          },
        },
        ...INITIAL_VIEWPORTS,
      },
    },
  },

  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
    (Story) => (
      <CookiesNextProvider pollingOptions={{ enabled: true, intervalMs: 1000 }}>
        <Story />
      </CookiesNextProvider>
    ),
    (Story) => {
      const [theme, setTheme] = useState<SiteTheme>(() => {
        const cookieTheme = SiteTheme.default(SiteTheme.enum.system).parse(
          getCookie(SITE_THEME_KEY),
        );
        // data-theme属性から初期値を取得
        const dataTheme = document.documentElement.getAttribute('data-theme');
        if (dataTheme === 'light' || dataTheme === 'dark') {
          return dataTheme;
        }
        return cookieTheme;
      });

      useEffect(() => {
        // data-theme属性の変更を監視
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === 'attributes' &&
              mutation.attributeName === 'data-theme'
            ) {
              const newTheme =
                document.documentElement.getAttribute('data-theme');
              if (newTheme === 'light' || newTheme === 'dark') {
                setTheme(newTheme);
                const root = document.documentElement;
                root.style.setProperty(
                  '--color-mix-ratio',
                  newTheme === SiteTheme.enum.light ? '7%' : '12%',
                );
              }
            }
          });
        });

        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-theme'],
        });

        return () => {
          observer.disconnect();
        };
      }, []);

      return (
        <SiteThemeProvider value={theme}>
          <div
            style={{
              color: 'var(--colors-text)',
              backgroundColor: 'var(--colors-base)',
            }}
          >
            <Story />
          </div>
        </SiteThemeProvider>
      );
    },
  ],
};

export default preview;
