import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { css } from '../../../../../../styled-system/css';
import { SpinnerLoadingIndicator } from './spinner-loading-indicator';

const meta = {
  component: SpinnerLoadingIndicator,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        className={css({
          display: 'grid',
          padding: '4',
          placeContent: 'center',
        })}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SpinnerLoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div
      className={css({
        display: 'flex',
        gap: '8',
        alignItems: 'center',
      })}
    >
      <SpinnerLoadingIndicator size="xs" />
      <SpinnerLoadingIndicator size="sm" />
      <SpinnerLoadingIndicator size="md" />
      <SpinnerLoadingIndicator size="lg" />
      <SpinnerLoadingIndicator size="xl" />
    </div>
  ),
};
