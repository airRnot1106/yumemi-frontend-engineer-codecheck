import type { Preview } from '@storybook/nextjs-vite';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';

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
};

export default preview;
