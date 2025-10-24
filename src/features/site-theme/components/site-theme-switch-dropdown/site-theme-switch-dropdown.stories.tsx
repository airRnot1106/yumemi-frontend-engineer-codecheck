import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SiteThemeSwitchDropdown } from './site-theme-switch-dropdown';

const meta = {
  component: SiteThemeSwitchDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SiteThemeSwitchDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SiteThemeSwitchDropdown />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ドロップダウンボタンをクリック
    const button = canvas.getByRole('button', { name: 'テーマを変更する' });
    await userEvent.click(button);

    // biome-ignore lint/style/noNonNullAssertion: 確実に存在するため
    const portal = within(canvasElement.parentElement!);

    // メニューアイテムが表示されることを確認（ポータルにレンダリングされるためportalを使用）
    await expect(
      portal.getByRole('menuitem', { name: 'ライトテーマ' }),
    ).toBeInTheDocument();
    await expect(
      portal.getByRole('menuitem', { name: 'ダークテーマ' }),
    ).toBeInTheDocument();
    await expect(
      portal.getByRole('menuitem', { name: 'システムテーマ' }),
    ).toBeInTheDocument();
  },
};
