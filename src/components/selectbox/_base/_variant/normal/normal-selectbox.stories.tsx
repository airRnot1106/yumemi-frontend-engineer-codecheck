import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { css } from '../../../../../../styled-system/css';
import { NormalSelectbox } from './normal-selectbox';

const meta = {
  component: NormalSelectbox,
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
} satisfies Meta<typeof NormalSelectbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <option value="">選択してください</option>
        <option value="1">オプション 1</option>
        <option value="2">オプション 2</option>
        <option value="3">オプション 3</option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <option value="">選択してください</option>
        <option value="1">オプション 1</option>
        <option value="2">オプション 2</option>
        <option value="3">オプション 3</option>
      </>
    ),
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: '2',
    children: (
      <>
        <option value="">選択してください</option>
        <option value="1">オプション 1</option>
        <option value="2">オプション 2</option>
        <option value="3">オプション 3</option>
      </>
    ),
  },
};

export const WithInteraction: Story = {
  args: {
    children: (
      <>
        <option value="">選択してください</option>
        <option value="option1">オプション 1</option>
        <option value="option2">オプション 2</option>
        <option value="option3">オプション 3</option>
      </>
    ),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // セレクトボックスを取得
    const select = canvas.getByRole('combobox');

    // オプション2を選択
    await userEvent.selectOptions(select, 'option2');

    // onChangeが呼ばれたことを確認
    await expect(args.onChange).toHaveBeenCalled();

    // 選択された値を確認
    await expect(select).toHaveValue('option2');
  },
};
