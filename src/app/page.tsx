import { Suspense } from 'react';
import { css } from '../../styled-system/css';
import { LoadingIndicator } from '../components/indicator';
import { PopulationCompositionSectionContainer } from '../features/population-composition/components/population-composition-section';

export default async function Home() {
  return (
    <div
      className={css({
        containerType: 'inline-size',
        height: 'full',
      })}
    >
      <Suspense
        fallback={
          <div
            className={css({
              display: 'grid',
              placeContent: 'center',
              width: 'full',
              height: 'full',
            })}
          >
            <LoadingIndicator variant="spinner" />
          </div>
        }
      >
        <PopulationCompositionSectionContainer
          className={css({
            margin: {
              base: '2',
              '@/sm': '4',
              '@/md': '6',
              '@/lg': '8',
            },
          })}
        />
      </Suspense>
    </div>
  );
}
