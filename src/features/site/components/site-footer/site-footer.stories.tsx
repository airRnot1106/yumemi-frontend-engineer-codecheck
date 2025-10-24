import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SiteFooter } from './site-footer';

const meta = {
  component: SiteFooter,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SiteFooter />,
};
