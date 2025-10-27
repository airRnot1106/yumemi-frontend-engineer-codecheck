import { match } from 'ts-pattern';
import {
  SpinnerLoadingIndicator,
  type SpinnerLoadingIndicatorProps,
} from './_variant';

type LoadingIndicatorVariant = 'spinner';

export type LoadingIndicatorProps<T extends LoadingIndicatorVariant> =
  T extends 'spinner' ? SpinnerLoadingIndicatorProps & { variant: T } : never;

export const LoadingIndicator = <T extends LoadingIndicatorVariant>(
  props: LoadingIndicatorProps<T>,
) => {
  return match(props.variant)
    .with('spinner', () => <SpinnerLoadingIndicator {...props} />)
    .exhaustive();
};
