import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { css } from '../../../../../../styled-system/css';
import { NormalButton } from './normal-button';

const meta = {
  component: NormalButton,
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
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof NormalButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Normal Button',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'Extra Small',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const WithInteraction: Story = {
  args: {
    children: 'Click Me',
    size: 'md',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // ボタンをクリック
    const button = canvas.getByRole('button', { name: 'Click Me' });
    await userEvent.click(button);

    // onClickが呼ばれたことを確認
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
