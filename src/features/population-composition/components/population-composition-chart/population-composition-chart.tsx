'use client';

import {
  BarElement,
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useQueryState } from 'nuqs';
import type { FC } from 'react';
import { Line } from 'react-chartjs-2';
import { cx, sva } from '../../../../../styled-system/css';
import { Selectbox } from '../../../../components/selectbox';
import { shouldNeverHappen } from '../../../../utils/panic-helper';
import { usePopulationCompositionChartColor } from '../../hooks';
import {
  type PopulationComposition,
  PopulationCompositionType,
} from '../../models';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

export type PopulationCompositionChartProps = {
  className?: string | undefined;
  populationCompositions: PopulationComposition[];
};

export const PopulationCompositionChart: FC<
  PopulationCompositionChartProps
> = ({ className, populationCompositions }) => {
  const { key, parser } = PopulationCompositionType.searchParams;
  const [populationCompositionType, setPopulationCompositionType] =
    useQueryState(key, parser);

  const { getStaticColors, generateDynamicColor } =
    usePopulationCompositionChartColor();

  const labels =
    populationCompositions[0]?.data[populationCompositionType].map(
      (item) => item.year,
    ) ?? shouldNeverHappen('No population composition data available');

  const datasets: ChartData<'line', number[], number>['datasets'] =
    populationCompositions.map(({ prefecture, boundaryYear, data }) => ({
      label: prefecture.name,
      data: data[populationCompositionType].map((item) => item.value),
      borderColor: generateDynamicColor(prefecture.code),
      backgroundColor: generateDynamicColor(prefecture.code),
      fill: false,
      segment: {
        borderDash: (ctx) => {
          return (labels[ctx.p0DataIndex] ?? 0) >= boundaryYear
            ? [6, 6]
            : undefined;
        },
      },
    }));

  const data = { labels, datasets };

  const { text, grid } = getStaticColors();

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: grid,
        },
        ticks: {
          color: text,
        },
      },
      y: {
        grid: {
          color: grid,
        },
        ticks: {
          color: text,
        },
      },
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        labels: {
          color: text,
        },
      },
    },
  };

  const { root, selectbox } = style();

  return (
    <div className={cx(root, className)}>
      <Selectbox
        aria-label="人口構成の種類選択"
        className={selectbox}
        onChange={(e) =>
          setPopulationCompositionType(
            PopulationCompositionType.schema
              .catch(PopulationCompositionType.schema.enum.totalPopulation)
              .parse(e.target.value),
          )
        }
        value={populationCompositionType}
        variant="normal"
      >
        {Object.values(PopulationCompositionType.schema.enum).map(
          (populationCompositionType) => (
            <option
              key={populationCompositionType}
              value={populationCompositionType}
            >
              {PopulationCompositionType.label[populationCompositionType]}
            </option>
          ),
        )}
      </Selectbox>
      <Line aria-label="人口構成グラフ" data={data} options={options} />
    </div>
  );
};

const style = sva({
  slots: ['root', 'selectbox'],
  base: {
    root: {
      display: 'grid',
      gridAutoFlow: 'row',
      rowGap: '4',
    },
    selectbox: {
      justifySelf: 'end',
    },
  },
});
