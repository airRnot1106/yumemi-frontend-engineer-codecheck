import { match } from 'ts-pattern';
import {
  GhostButton,
  type GhostButtonProps,
  NormalButton,
  type NormalButtonProps,
} from './_variant';

type ButtonVariant = 'ghost' | 'normal';

export type ButtonProps<T extends ButtonVariant> = T extends 'ghost'
  ? GhostButtonProps & { variant: T }
  : T extends 'normal'
    ? NormalButtonProps & { variant: T }
    : never;

export const Button = <T extends ButtonVariant>(props: ButtonProps<T>) => {
  return match(props.variant)
    .with('ghost', () => <GhostButton {...props} />)
    .with('normal', () => <NormalButton {...props} />)
    .exhaustive();
};
