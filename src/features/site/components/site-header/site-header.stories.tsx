import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { deleteCookie } from 'cookies-next/client';
import { SITE_THEME_KEY } from '../../../site-theme/models';
import { SiteHeader } from './site-header';

const meta = {
  component: SiteHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  beforeEach: () => {
    deleteCookie(SITE_THEME_KEY);
  },
  render: () => <SiteHeader />,
};
