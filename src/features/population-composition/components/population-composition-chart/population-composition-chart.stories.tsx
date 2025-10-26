import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { css } from '../../../../../styled-system/css';
import type { PopulationComposition } from '../../models';
import { PopulationCompositionType } from '../../models';
import { PopulationCompositionChart } from './population-composition-chart';

const meta = {
  component: PopulationCompositionChart,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        className={css({
          display: 'grid',
          padding: '4',
          minHeight: '100vh',
        })}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PopulationCompositionChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ: 北海道
const hokkaidoData: PopulationComposition = {
  prefecture: { code: 1, name: '北海道' },
  boundaryYear: 2020,
  data: {
    totalPopulation: [
      { year: 1980, value: 5575989 },
      { year: 1990, value: 5643647 },
      { year: 2000, value: 5683062 },
      { year: 2010, value: 5506419 },
      { year: 2020, value: 5224614 },
      { year: 2030, value: 4796000 },
      { year: 2040, value: 4312000 },
    ],
    youthPopulation: [
      { year: 1980, value: 1184165 },
      { year: 1990, value: 913700 },
      { year: 2000, value: 810000 },
      { year: 2010, value: 672000 },
      { year: 2020, value: 555000 },
      { year: 2030, value: 467000 },
      { year: 2040, value: 391000 },
    ],
    workingAgePopulation: [
      { year: 1980, value: 3820000 },
      { year: 1990, value: 3910000 },
      { year: 2000, value: 3788000 },
      { year: 2010, value: 3370000 },
      { year: 2020, value: 2997000 },
      { year: 2030, value: 2632000 },
      { year: 2040, value: 2300000 },
    ],
    elderlyPopulation: [
      { year: 1980, value: 571824 },
      { year: 1990, value: 820000 },
      { year: 2000, value: 1085000 },
      { year: 2010, value: 1464000 },
      { year: 2020, value: 1672000 },
      { year: 2030, value: 1697000 },
      { year: 2040, value: 1621000 },
    ],
  },
} as PopulationComposition;

// サンプルデータ: 東京都
const tokyoData: PopulationComposition = {
  prefecture: { code: 13, name: '東京都' },
  boundaryYear: 2020,
  data: {
    totalPopulation: [
      { year: 1980, value: 11618281 },
      { year: 1990, value: 11855563 },
      { year: 2000, value: 12064101 },
      { year: 2010, value: 13159388 },
      { year: 2020, value: 13921650 },
      { year: 2030, value: 13980000 },
      { year: 2040, value: 13670000 },
    ],
    youthPopulation: [
      { year: 1980, value: 2249000 },
      { year: 1990, value: 1747000 },
      { year: 2000, value: 1504000 },
      { year: 2010, value: 1500000 },
      { year: 2020, value: 1540000 },
      { year: 2030, value: 1480000 },
      { year: 2040, value: 1330000 },
    ],
    workingAgePopulation: [
      { year: 1980, value: 8268000 },
      { year: 1990, value: 8642000 },
      { year: 2000, value: 8716000 },
      { year: 2010, value: 9154000 },
      { year: 2020, value: 9302000 },
      { year: 2030, value: 9074000 },
      { year: 2040, value: 8427000 },
    ],
    elderlyPopulation: [
      { year: 1980, value: 1101281 },
      { year: 1990, value: 1466563 },
      { year: 2000, value: 1844101 },
      { year: 2010, value: 2505388 },
      { year: 2020, value: 3079650 },
      { year: 2030, value: 3426000 },
      { year: 2040, value: 3913000 },
    ],
  },
} as PopulationComposition;

// サンプルデータ: 大阪府
const osakaData: PopulationComposition = {
  prefecture: { code: 27, name: '大阪府' },
  boundaryYear: 2020,
  data: {
    totalPopulation: [
      { year: 1980, value: 8473446 },
      { year: 1990, value: 8734516 },
      { year: 2000, value: 8805081 },
      { year: 2010, value: 8865245 },
      { year: 2020, value: 8837685 },
      { year: 2030, value: 8600000 },
      { year: 2040, value: 8200000 },
    ],
    youthPopulation: [
      { year: 1980, value: 1750000 },
      { year: 1990, value: 1350000 },
      { year: 2000, value: 1210000 },
      { year: 2010, value: 1160000 },
      { year: 2020, value: 1090000 },
      { year: 2030, value: 1010000 },
      { year: 2040, value: 890000 },
    ],
    workingAgePopulation: [
      { year: 1980, value: 5850000 },
      { year: 1990, value: 6150000 },
      { year: 2000, value: 5950000 },
      { year: 2010, value: 5740000 },
      { year: 2020, value: 5500000 },
      { year: 2030, value: 5170000 },
      { year: 2040, value: 4730000 },
    ],
    elderlyPopulation: [
      { year: 1980, value: 873446 },
      { year: 1990, value: 1234516 },
      { year: 2000, value: 1645081 },
      { year: 2010, value: 1965245 },
      { year: 2020, value: 2247685 },
      { year: 2030, value: 2420000 },
      { year: 2040, value: 2580000 },
    ],
  },
} as PopulationComposition;

export const SinglePrefecture: Story = {
  args: {
    populationCompositions: [hokkaidoData],
    defaultPopulationCompositionType:
      PopulationCompositionType.schema.enum.totalPopulation,
  },
};

export const MultiplePrefectures: Story = {
  args: {
    populationCompositions: [hokkaidoData, tokyoData, osakaData],
    defaultPopulationCompositionType:
      PopulationCompositionType.schema.enum.totalPopulation,
  },
};

export const YouthPopulation: Story = {
  args: {
    populationCompositions: [hokkaidoData, tokyoData],
    defaultPopulationCompositionType:
      PopulationCompositionType.schema.enum.youthPopulation,
  },
};

export const WorkingAgePopulation: Story = {
  args: {
    populationCompositions: [hokkaidoData, tokyoData],
    defaultPopulationCompositionType:
      PopulationCompositionType.schema.enum.workingAgePopulation,
  },
};

export const ElderlyPopulation: Story = {
  args: {
    populationCompositions: [hokkaidoData, tokyoData],
    defaultPopulationCompositionType:
      PopulationCompositionType.schema.enum.elderlyPopulation,
  },
};

export const WithInteraction: Story = {
  args: {
    populationCompositions: [hokkaidoData, tokyoData],
    defaultPopulationCompositionType:
      PopulationCompositionType.schema.enum.totalPopulation,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // セレクトボックスを取得
    const select = canvas.getByRole('combobox', {
      name: '人口構成の種類選択',
    });

    // 初期値が総人口であることを確認
    await expect(select).toHaveValue(
      PopulationCompositionType.schema.enum.totalPopulation,
    );

    // 年少人口を選択
    await userEvent.selectOptions(
      select,
      PopulationCompositionType.schema.enum.youthPopulation,
    );

    // 選択された値を確認
    await expect(select).toHaveValue(
      PopulationCompositionType.schema.enum.youthPopulation,
    );

    // 生産年齢人口を選択
    await userEvent.selectOptions(
      select,
      PopulationCompositionType.schema.enum.workingAgePopulation,
    );

    // 選択された値を確認
    await expect(select).toHaveValue(
      PopulationCompositionType.schema.enum.workingAgePopulation,
    );
  },
};
