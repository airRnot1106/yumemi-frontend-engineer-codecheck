import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
  render: () => <SiteHeader />,
};
