import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { css } from '../../../../../styled-system/css';
import { Prefecture, PrefectureCode } from '../../models';
import { PrefectureCheckboxForm } from './prefecture-checkbox-form';

const mockPrefectures = [
  { prefectureCode: 1, prefectureName: '北海道' },
  { prefectureCode: 2, prefectureName: '青森県' },
  { prefectureCode: 3, prefectureName: '岩手県' },
  { prefectureCode: 4, prefectureName: '宮城県' },
  { prefectureCode: 5, prefectureName: '秋田県' },
  { prefectureCode: 6, prefectureName: '山形県' },
  { prefectureCode: 7, prefectureName: '福島県' },
  { prefectureCode: 8, prefectureName: '茨城県' },
  { prefectureCode: 9, prefectureName: '栃木県' },
  { prefectureCode: 10, prefectureName: '群馬県' },
  { prefectureCode: 11, prefectureName: '埼玉県' },
  { prefectureCode: 12, prefectureName: '千葉県' },
  { prefectureCode: 13, prefectureName: '東京都' },
  { prefectureCode: 14, prefectureName: '神奈川県' },
  { prefectureCode: 15, prefectureName: '新潟県' },
  { prefectureCode: 16, prefectureName: '富山県' },
  { prefectureCode: 17, prefectureName: '石川県' },
  { prefectureCode: 18, prefectureName: '福井県' },
  { prefectureCode: 19, prefectureName: '山梨県' },
  { prefectureCode: 20, prefectureName: '長野県' },
  { prefectureCode: 21, prefectureName: '岐阜県' },
  { prefectureCode: 22, prefectureName: '静岡県' },
  { prefectureCode: 23, prefectureName: '愛知県' },
  { prefectureCode: 24, prefectureName: '三重県' },
  { prefectureCode: 25, prefectureName: '滋賀県' },
  { prefectureCode: 26, prefectureName: '京都府' },
  { prefectureCode: 27, prefectureName: '大阪府' },
  { prefectureCode: 28, prefectureName: '兵庫県' },
  { prefectureCode: 29, prefectureName: '奈良県' },
  { prefectureCode: 30, prefectureName: '和歌山県' },
  { prefectureCode: 31, prefectureName: '鳥取県' },
  { prefectureCode: 32, prefectureName: '島根県' },
  { prefectureCode: 33, prefectureName: '岡山県' },
  { prefectureCode: 34, prefectureName: '広島県' },
  { prefectureCode: 35, prefectureName: '山口県' },
  { prefectureCode: 36, prefectureName: '徳島県' },
  { prefectureCode: 37, prefectureName: '香川県' },
  { prefectureCode: 38, prefectureName: '愛媛県' },
  { prefectureCode: 39, prefectureName: '高知県' },
  { prefectureCode: 40, prefectureName: '福岡県' },
  { prefectureCode: 41, prefectureName: '佐賀県' },
  { prefectureCode: 42, prefectureName: '長崎県' },
  { prefectureCode: 43, prefectureName: '熊本県' },
  { prefectureCode: 44, prefectureName: '大分県' },
  { prefectureCode: 45, prefectureName: '宮崎県' },
  { prefectureCode: 46, prefectureName: '鹿児島県' },
  { prefectureCode: 47, prefectureName: '沖縄県' },
].map((value) => Prefecture.parse(value));

const Legend = () => {
  return (
    <legend className={css({ fontSize: '2xl', fontWeight: 'bold', mb: '2' })}>
      都道府県
    </legend>
  );
};

const meta = {
  component: PrefectureCheckboxForm,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        className={css({
          display: 'grid',
          padding: '4',
          placeItems: 'center',
        })}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  args: {
    prefectures: mockPrefectures,
    state: [],
    action: fn(),
    legend: <Legend />,
  },
} satisfies Meta<typeof PrefectureCheckboxForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prefectures: mockPrefectures,
  },
};

export const WithDefaultValues: Story = {
  args: {
    prefectures: mockPrefectures,
    defaultValues: [13, 27].map((code) => PrefectureCode.parse(code)),
  },
};

export const WithInteraction: Story = {
  args: {
    prefectures: mockPrefectures,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // 東京都のチェックボックスを見つけてクリック
    const tokyoCheckbox = canvas.getByRole('checkbox', { name: '東京都' });
    await userEvent.click(tokyoCheckbox);

    // チェックされていることを確認
    await expect(tokyoCheckbox).toBeChecked();

    // actionが呼ばれたことを確認（自動送信される）
    await expect(args.action).toHaveBeenCalled();
  },
};
