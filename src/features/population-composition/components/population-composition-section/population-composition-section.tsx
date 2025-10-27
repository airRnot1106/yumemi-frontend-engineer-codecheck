'use client';

import { R } from '@praha/byethrow';
import { type ComponentProps, type FC, useActionState } from 'react';
import { cx, sva } from '../../../../../styled-system/css';
import { LoadingIndicator } from '../../../../components/indicator';
import { PrefectureCheckboxForm } from '../../../prefecture/components/prefecture-checkbox-form';
import type { Prefecture } from '../../../prefecture/models';
import { useSiteTheme } from '../../../site-theme/hooks';
import { getPopulationCompositions } from '../../actions';
import { FailedToFetchPopulationCompositionError } from '../../models';
import { PopulationCompositionChart } from '../population-composition-chart';

export type PopulationCompositionSectionProps = ComponentProps<'section'> & {
  prefectures: Prefecture[];
};

export const PopulationCompositionSection: FC<
  PopulationCompositionSectionProps
> = ({ className, prefectures, ...rest }) => {
  const [state, action, _isPending] = useActionState(
    getPopulationCompositions,
    R.succeed([]),
  );

  if (state.type === 'Failure') {
    throw new FailedToFetchPopulationCompositionError();
  }

  // Note: 未選択時から選択したときのみローディングを表示する
  const isPending = _isPending && state.value.length === 0;

  const isUnselected = !_isPending && state.value.length === 0;

  const { theme } = useSiteTheme();

  const { section, legend, loading, chartWrapper, chart, unselected } = style();

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
            key={theme}
            populationCompositions={state.value}
          />
        </div>
      )}
      {isUnselected && (
        <div className={unselected}>
          <span>都道府県を選択してください</span>
        </div>
      )}
    </section>
  );
};

const style = sva({
  slots: [
    'section',
    'legend',
    'loading',
    'chartWrapper',
    'chart',
    'unselected',
  ],
  base: {
    section: {
      display: 'grid',
      gridAutoFlow: 'row',
      rowGap: '6',
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
    unselected: {
      display: 'grid',
      placeContent: 'center',
      padding: '16',
      fontSize: 'xl',
      width: 'full',
      height: 'full',
    },
  },
});
