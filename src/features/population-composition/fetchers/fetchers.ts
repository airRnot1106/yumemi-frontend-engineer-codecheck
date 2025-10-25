import 'server-only';

import { R } from '@praha/byethrow';
import {
  getPopulationCompositionPerYear,
  type getPopulationCompositionPerYearResponseError,
  type getPopulationCompositionPerYearResponseSuccess,
} from '../../../libs/generated/clients/population';
import { API_KEY } from '../../../utils/env';
import type { Prefecture } from '../../prefecture/models';

export const getPopulationComposition = async (
  prefecture: Prefecture,
): R.ResultAsync<
  getPopulationCompositionPerYearResponseSuccess & { prefecture: Prefecture },
  getPopulationCompositionPerYearResponseError
> => {
  const res = await getPopulationCompositionPerYear(
    {
      prefCode: prefecture.code,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
      cache: 'force-cache',
    },
  );

  if (res.status !== 200) {
    return R.fail(res);
  }

  return R.succeed({
    prefecture,
    ...res,
  });
};

export const getPopulationCompositions = async (
  prefectures: Prefecture[],
): R.ResultAsync<
  (getPopulationCompositionPerYearResponseSuccess & {
    prefecture: Prefecture;
  })[],
  getPopulationCompositionPerYearResponseError[]
> => R.collect(await Promise.all(prefectures.map(getPopulationComposition)));
