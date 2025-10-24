import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { css } from '../../../../../../styled-system/css';
import { NormalCheckbox } from './normal-checkbox';

const meta = {
  component: NormalCheckbox,
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
    onChange: fn(),
  },
} satisfies Meta<typeof NormalCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Normal Checkbox',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    label: 'Extra Small',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    label: 'Medium',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    label: 'Extra Large',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked',
    defaultChecked: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    label: 'Checked Disabled',
    defaultChecked: true,
    disabled: true,
  },
};

export const WithInteraction: Story = {
  args: {
    label: 'Check Me',
    size: 'md',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // チェックボックスをクリック
    const checkbox = canvas.getByRole('checkbox', { name: 'Check Me' });
    await userEvent.click(checkbox);

    // onChangeが呼ばれたことを確認
    await expect(args.onChange).toHaveBeenCalledTimes(1);

    // チェックされていることを確認
    await expect(checkbox).toBeChecked();
  },
};
