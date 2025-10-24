import { match } from 'ts-pattern';
import {
  GhostLinkButton,
  type GhostLinkButtonProps,
  NormalLinkButton,
  type NormalLinkButtonProps,
} from './_variant';

type LinkButtonVariant = 'ghost' | 'normal';

export type LinkButtonProps<T extends LinkButtonVariant> = T extends 'ghost'
  ? GhostLinkButtonProps & { variant: T }
  : T extends 'normal'
    ? NormalLinkButtonProps & { variant: T }
    : never;

export const LinkButton = <T extends LinkButtonVariant>(
  props: LinkButtonProps<T>,
) => {
  return match(props.variant)
    .with('ghost', () => <GhostLinkButton {...props} />)
    .with('normal', () => <NormalLinkButton {...props} />)
    .exhaustive();
};
