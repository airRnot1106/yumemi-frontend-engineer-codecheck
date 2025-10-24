import { Checkbox, type CheckboxProps, Field, Label } from '@headlessui/react';
import { Check } from 'lucide-react';
import type { FC } from 'react';
import { cx, sva } from '../../../../../../styled-system/css';
import type { SystemStyleObject } from '../../../../../../styled-system/types';
import { Size } from '../../../../../features/size/models';

export type NormalCheckboxProps = CheckboxProps & {
  className?: string;
  label?: string;
  size?: Size;
};

export const NormalCheckbox: FC<NormalCheckboxProps> = ({
  className,
  label,
  disabled = false,
  size = Size.schema.enum.md,
  ...rest
}) => {
  const {
    field,
    checkbox,
    icon,
    label: labelStyle,
  } = style({
    disabled,
    size,
  });

  return (
    <Field className={cx(field, className)}>
      <Checkbox className={checkbox} disabled={disabled} {...rest}>
        <Check className={icon} />
      </Checkbox>
      <Label className={labelStyle}>{label}</Label>
    </Field>
  );
};

const style = sva({
  slots: ['field', 'checkbox', 'icon', 'label'],
  base: {
    field: {
      display: 'inline-grid',
      gridAutoFlow: 'column',
      gridTemplateColumns: 'auto 1fr',
      alignItems: 'center',
      columnGap: '2',
    },
    checkbox: {
      display: 'grid',
      placeContent: 'center',
      backgroundColor: {
        base: 'white',
        _checked: 'pine',
      },
      border: '1px solid',
      borderColor: 'muted',
      borderRadius: 'md',
      '&>svg': {
        opacity: 0,
      },
      _checked: {
        '&>svg': {
          opacity: 1,
        },
      },
    },
    icon: {
      stroke: 'white',
    },
    label: {
      fontSize: 'md',
    },
  },
  variants: {
    disabled: {
      true: {
        field: {
          cursor: 'not-allowed',
          opacity: 0.5,
        },
      },
    },
    size: {
      xs: {
        checkbox: {
          width: 'calc(var(--spacing-1) * 5)',
          height: 'calc(var(--spacing-1) * 5)',
        },
        icon: {
          width: 'calc(var(--spacing-1) * 4)',
          height: 'calc(var(--spacing-1) * 4)',
        },
        label: {
          fontSize: 'sm',
        },
      },
      sm: {
        checkbox: {
          width: 'calc(var(--spacing-1) * 6)',
          height: 'calc(var(--spacing-1) * 6)',
        },
        icon: {
          width: 'calc(var(--spacing-1) * 5)',
          height: 'calc(var(--spacing-1) * 5)',
        },
        label: {
          fontSize: 'md',
        },
      },
      md: {
        checkbox: {
          width: 'calc(var(--spacing-1) * 7)',
          height: 'calc(var(--spacing-1) * 7)',
        },
        icon: {
          width: 'calc(var(--spacing-1) * 6)',
          height: 'calc(var(--spacing-1) * 6)',
        },
        label: {
          fontSize: 'lg',
        },
      },
      lg: {
        checkbox: {
          width: 'calc(var(--spacing-1) * 8)',
          height: 'calc(var(--spacing-1) * 8)',
        },
        icon: {
          width: 'calc(var(--spacing-1) * 7)',
          height: 'calc(var(--spacing-1) * 7)',
        },
        label: {
          fontSize: 'xl',
        },
      },
      xl: {
        checkbox: {
          width: 'calc(var(--spacing-1) * 9)',
          height: 'calc(var(--spacing-1) * 9)',
        },
        icon: {
          width: 'calc(var(--spacing-1) * 8)',
          height: 'calc(var(--spacing-1) * 8)',
        },
        label: {
          fontSize: '2xl',
        },
      },
    } satisfies Record<Size, Record<string, SystemStyleObject>>,
  },
});
