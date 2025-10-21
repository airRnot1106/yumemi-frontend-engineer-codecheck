'use client';

import { R } from '@praha/byethrow';
import { type FC, useActionState } from 'react';
import { PrefectureCheckboxForm } from '../../../prefecture/components/prefecture-checkbox-form';
import type { Prefecture } from '../../../prefecture/models';
import { getPopulationCompositions } from '../../actions';
import { PopulationCompositionChart } from '../population-composition-chart';

export type PopulationCompositionFormProps = {
  prefectures: Prefecture[];
};

export const PopulationCompositionForm: FC<PopulationCompositionFormProps> = ({
  prefectures,
}) => {
  const [state, action] = useActionState(
    getPopulationCompositions,
    R.succeed([]),
  );

  if (R.isFailure(state)) {
    return (
      <div>
        Failed to load population compositions: {JSON.stringify(state.error)}
      </div>
    );
  }

  return (
    <div>
      <PrefectureCheckboxForm
        action={action}
        prefectures={prefectures}
        state={state}
      />
      <PopulationCompositionChart
        populationCompositions={state.value.map(
          (value) => value.populationComposition,
        )}
        populationCompositionType="totalPopulation"
      />
    </div>
  );
};
