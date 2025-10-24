import type { LinkProps } from 'next/link';
import Link from 'next/link';
import type { ComponentProps, FC } from 'react';
import { cva, cx } from '../../../../../../styled-system/css';
import type { SystemStyleObject } from '../../../../../../styled-system/types';
import { Size } from '../../../../../features/size/models';

export type NormalLinkButtonProps = LinkProps &
  ComponentProps<'a'> & {
    disabled?: boolean;
    size?: Size;
  };

export const NormalLinkButton: FC<NormalLinkButtonProps> = ({
  children,
  className,
  disabled = false,
  size = Size.schema.enum.md,
  ...rest
}) => {
  return (
    <Link
      aria-disabled={disabled}
      className={cx(style({ disabled, size }), className)}
      tabIndex={disabled ? -1 : 0}
      {...rest}
    >
      {children}
    </Link>
  );
};

const style = cva({
  base: {
    display: 'inline-grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    width: 'full',
    border: '1px solid',
    borderColor: 'muted/20',
    borderRadius: 'md',
    backgroundColor: 'surface',
    cursor: 'pointer',
    textBox: 'trim-both cap alphabetic',
    transitionDuration: '0.2s',
    transitionProperty: 'color, background-color, border-color, box-shadow',
    transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
    '--size-base': 'var(--spacing-1)',
    _hover: {
      backgroundColor:
        'color-mix(in oklab, var(--colors-base), var(--color-mix-base) var(--color-mix-ratio))',
    },
  },
  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
        opacity: '0.5',
      },
    },
    size: {
      xs: {
        height: 'calc(var(--size-base) * 6)',
        paddingInline: '2',
      },
      sm: {
        height: 'calc(var(--size-base) * 8)',
        paddingInline: '4',
      },
      md: {
        height: 'calc(var(--size-base) * 10)',
        paddingInline: '6',
      },
      lg: {
        height: 'calc(var(--size-base) * 12)',
        paddingInline: '8',
      },
      xl: {
        height: 'calc(var(--size-base) * 14)',
        paddingInline: '10',
      },
    } satisfies Record<Size, SystemStyleObject>,
  },
});
