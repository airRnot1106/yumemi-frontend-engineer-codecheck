import { match } from 'ts-pattern';
import { NormalSelectbox, type NormalSelectboxProps } from './_variant';

type SelectboxVariant = 'normal';

export type SelectboxProps<T extends SelectboxVariant> = T extends 'normal'
  ? NormalSelectboxProps & { variant: T }
  : never;

export const Selectbox = <T extends SelectboxVariant>(
  props: SelectboxProps<T>,
) => {
  return match(props.variant)
    .with('normal', () => <NormalSelectbox {...props} />)
    .exhaustive();
};
