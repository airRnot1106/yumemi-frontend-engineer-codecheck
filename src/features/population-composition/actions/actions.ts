'use server';

import { R } from '@praha/byethrow';
import { getPrefectures } from '../../prefecture/fetchers';
import { Prefecture, PrefectureCode } from '../../prefecture/models';
import { getPopulationCompositions as _getPopulationCompositions } from '../fetchers';
import { PopulationComposition } from '../models';

export const getPopulationCompositions = async (
  _prevData: unknown,
  formData: FormData,
) => {
  const prefectures = await R.pipe(
    R.do(),
    R.andThen(getPrefectures),
    R.andThen(Prefecture.fromResponse),
  );

  if (R.isFailure(prefectures)) {
    return prefectures;
  }

  const populationCompositions = await R.pipe(
    R.succeed(formData.getAll(Prefecture.key)),
    R.andThen(PrefectureCode.fromFormData),
    R.map((codes) =>
      prefectures.value.filter((prefecture) => codes.includes(prefecture.code)),
    ),
    R.andThen(_getPopulationCompositions),
    R.andThen(PopulationComposition.fromResponses),
  );

  return populationCompositions;
};
