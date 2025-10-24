import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/nextjs-vite';
import { useEffect } from 'react';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { setStyles } from '../src/features/site-theme/hooks/use-site-theme';
import { SiteTheme } from '../src/features/site-theme/models';

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

    (Story) => {
      useEffect(() => {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === 'attributes' &&
              mutation.attributeName === 'data-theme'
            ) {
              const theme = SiteTheme.schema
                .catch(SiteTheme.schema.enum.light)
                .parse(document.documentElement.getAttribute('data-theme'));

              setStyles(theme);
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
        <div
          style={{
            color: 'var(--colors-text)',
            backgroundColor: 'var(--colors-base)',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
