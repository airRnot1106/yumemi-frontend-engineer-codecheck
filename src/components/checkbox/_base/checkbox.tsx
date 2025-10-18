import { match } from 'ts-pattern';
import { NormalCheckbox, type NormalCheckboxProps } from './_variant';

type CheckboxVariant = 'normal';

export type CheckboxProps<T extends CheckboxVariant> = T extends 'normal'
  ? NormalCheckboxProps & { variant: T }
  : never;

export const Checkbox = <T extends CheckboxVariant>(
  props: CheckboxProps<T>,
) => {
  return match(props.variant)
    .with('normal', () => <NormalCheckbox {...props} />)
    .exhaustive();
};
