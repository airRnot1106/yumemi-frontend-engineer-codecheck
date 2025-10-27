'use client';

import { R } from '@praha/byethrow';
import { type ComponentProps, type FC, useActionState } from 'react';
import { cx, sva } from '../../../../../styled-system/css';
import { LoadingIndicator } from '../../../../components/indicator';
import { PrefectureCheckboxForm } from '../../../prefecture/components/prefecture-checkbox-form';
import type { Prefecture } from '../../../prefecture/models';
import { getPopulationCompositions } from '../../actions';
import { FailedToFetchPopulationCompositionError } from '../../models';
import { PopulationCompositionChart } from '../population-composition-chart';

export type PopulationCompositionSectionProps = ComponentProps<'section'> & {
  prefectures: Prefecture[];
};

export const PopulationCompositionSection: FC<
  PopulationCompositionSectionProps
> = ({ className, prefectures, ...rest }) => {
  const [state, action, isPending] = useActionState(
    getPopulationCompositions,
    R.succeed([]),
  );

  if (state.type === 'Failure') {
    throw new FailedToFetchPopulationCompositionError();
  }

  const { section, legend, loading, chartWrapper, chart } = style();

  return (
    <section className={cx(section, className)} {...rest}>
      <PrefectureCheckboxForm
        action={action}
        legend={<h2 className={legend}>都道府県</h2>}
        prefectures={prefectures}
        state={state}
      />
      {isPending && (
        <div className={loading}>
          <LoadingIndicator variant="spinner" />
        </div>
      )}
      {state.value.length > 0 && (
        <div className={chartWrapper}>
          <PopulationCompositionChart
            className={chart}
            defaultPopulationCompositionType="workingAgePopulation"
            populationCompositions={state.value}
          />
        </div>
      )}
    </section>
  );
};

const style = sva({
  slots: ['section', 'legend', 'loading', 'chartWrapper', 'chart'],
  base: {
    section: {
      backgroundColor: 'surface',
      borderRadius: 'md',
      padding: {
        base: '2',
        '@/sm': '4',
        '@/md': '6',
        '@/lg': '8',
      },
    },
    legend: {
      fontSize: 'xl',
      fontWeight: 'bold',
    },
    loading: {
      display: 'grid',
      placeContent: 'center',
      width: 'full',
      height: 'full',
      marginBlockStart: '32',
    },
    chartWrapper: {
      overflowX: 'scroll',
    },
    chart: {
      minWidth: '48rem',
    },
  },
});
