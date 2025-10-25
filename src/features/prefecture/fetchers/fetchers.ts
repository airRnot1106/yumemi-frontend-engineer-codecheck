import 'server-only';

import { R } from '@praha/byethrow';
import {
  getPrefectures as _getPrefectures,
  type getPrefecturesResponseError,
  type getPrefecturesResponseSuccess,
} from '../../../libs/generated/clients/prefectures';
import { API_KEY } from '../../../utils/env';

export const getPrefectures = async (): R.ResultAsync<
  getPrefecturesResponseSuccess,
  getPrefecturesResponseError
> => {
  const res = await _getPrefectures({
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
    cache: 'force-cache',
  });

  if (res.status !== 200) {
    return R.fail(res);
  }

  return R.succeed(res);
};
