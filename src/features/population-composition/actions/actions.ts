'use server';

import { R } from '@praha/byethrow';
import { getPrefectures } from '../../prefecture/fetchers';
import {
  PREFECTURE_KEY,
  PrefectureCode,
  fromResponse as toPrefecturesfromResponse,
} from '../../prefecture/models';
import { getPopulationCompositions as _getPopulationCompositions } from '../fetchers';
import { fromResponse as toPopulationCompositionfromResponse } from '../models';

export const getPopulationCompositions = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const prefectures = await R.pipe(
    R.do(),
    R.andThen(getPrefectures),
    R.andThen(toPrefecturesfromResponse),
  );

  if (R.isFailure(prefectures)) {
    return R.fail(prefectures.error);
  }

  const result = await R.pipe(
    R.succeed(formData.getAll(PREFECTURE_KEY)),
    R.map((prefectureCodes) => prefectureCodes.map((code) => Number(code))),
    R.andThen((prefectureCodes) =>
      R.parse(PrefectureCode.array(), prefectureCodes),
    ),
    R.map((prefectureCodes) =>
      prefectureCodes.map((code) =>
        prefectures.value.find(
          (prefecture) => prefecture.prefectureCode === code,
        ),
      ),
    ),
    R.map((prefectures) =>
      prefectures.filter((prefecture) => prefecture != null),
    ),
    R.andThen(_getPopulationCompositions),
    R.andThen((responses) =>
      R.collect(responses.map(toPopulationCompositionfromResponse)),
    ),
  );

  return result;
};
