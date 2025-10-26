'use client';

import { css } from '../../styled-system/css';
import { Button } from '../components/button';

export type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div
      className={css({
        display: 'grid',
        placeItems: 'center',
        placeContent: 'center',
        rowGap: '4',
        height: 'full',
      })}
    >
      <span
        className={css({
          color: 'rose',
          fontSize: 'xl',
          fontWeight: 'bold',
        })}
      >
        都道府県の取得に失敗しました。
      </span>
      <Button
        className={css({
          width: 'fit-content',
        })}
        onClick={() => reset()}
        type="button"
        variant="normal"
      >
        リロード
      </Button>
    </div>
  );
}
