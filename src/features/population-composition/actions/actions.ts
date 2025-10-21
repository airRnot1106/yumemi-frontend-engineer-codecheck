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
    R.mapError((errors) => {
      if (errors instanceof Error) {
        return new Error('Failed to fetch prefectures', {
          cause: errors,
        });
      }
      if (Array.isArray(errors)) {
        return new Error(`Failed to fetch prefectures: ${errors.join(', ')}`);
      }
      return new Error('Failed to fetch prefectures');
    }),
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
    R.mapError((errors) => {
      console.dir(errors, { depth: null });
      if (errors instanceof Error) {
        return new Error('Failed to fetch population compositions', {
          cause: errors,
        });
      }
      return new Error(
        `Failed to fetch population compositions: ${errors.join(', ')}`,
      );
    }),
  );

  if (R.isFailure(result)) {
    return R.fail(result.error);
  }

  return result;
};
