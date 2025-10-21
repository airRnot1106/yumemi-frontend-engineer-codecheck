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
import type { FC } from 'react';
import { Line } from 'react-chartjs-2';
import { css, cx } from '../../../../../styled-system/css';
import { useChartColor } from '../../../../hooks/use-chart-color';
import type {
  PopulationComposition,
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
  className?: string;
  populationCompositions: PopulationComposition[];
  populationCompositionType: PopulationCompositionType;
};

export const PopulationCompositionChart: FC<
  PopulationCompositionChartProps
> = ({ className, populationCompositions, populationCompositionType }) => {
  const { getStaticColors, generateDynamicColor } = useChartColor();

  const labels =
    populationCompositions[0]?.data[populationCompositionType].map(
      (item) => item.year,
    ) || [];

  const datasets: ChartData<'line', number[], number>['datasets'] =
    populationCompositions.map(({ prefecture, boundaryYear, data }) => ({
      label: prefecture.prefectureName,
      data: data[populationCompositionType].map((item) => item.value),
      borderColor: generateDynamicColor(prefecture.prefectureCode),
      backgroundColor: generateDynamicColor(prefecture.prefectureCode),
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
        display: true,
        text: 'Population Composition Chart',
        color: text,
      },
      legend: {
        labels: {
          color: text,
        },
      },
    },
  };

  return (
    <Line className={cx(style, className)} data={data} options={options} />
  );
};

const style = css({
  backgroundColor: 'surface',
});
