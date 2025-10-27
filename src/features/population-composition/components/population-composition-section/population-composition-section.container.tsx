import { R } from '@praha/byethrow';
import type { FC } from 'react';
import { getPrefectures } from '../../../prefecture/fetchers';
import { Prefecture } from '../../../prefecture/models';
import { FailedToFetchPopulationCompositionError } from '../../models';
import {
  PopulationCompositionSection,
  type PopulationCompositionSectionProps,
} from './population-composition-section';

export type PopulationCompositionSectionContainerProps = Omit<
  PopulationCompositionSectionProps,
  'prefectures'
>;

export const PopulationCompositionSectionContainer: FC<
  PopulationCompositionSectionContainerProps
> = async (props) => {
  const prefectures = await R.pipe(
    R.do(),
    R.andThen(getPrefectures),
    R.andThen(Prefecture.fromResponse),
  );

  if (R.isFailure(prefectures)) {
    throw new FailedToFetchPopulationCompositionError();
  }

  return (
    <PopulationCompositionSection prefectures={prefectures.value} {...props} />
  );
};
