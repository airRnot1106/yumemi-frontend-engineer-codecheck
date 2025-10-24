import { Select, type SelectProps } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import type { CSSProperties, FC } from 'react';
import { cx, sva } from '../../../../../../styled-system/css';

export type NormalSelectboxProps = SelectProps & {
  className?: string;
  width?: string;
};

export const NormalSelectbox: FC<NormalSelectboxProps> = ({
  className,
  width = 'calc-size(fit-content, size + var(--spacing-8))',
  disabled = false,
  children,
  ...rest
}) => {
  const { wrapper, selectbox, icon } = style({ disabled });

  return (
    <div className={cx(wrapper, className)}>
      <Select
        className={selectbox}
        disabled={disabled}
        {...rest}
        style={{ '--width': width } as CSSProperties}
      >
        {children}
      </Select>
      <ChevronDown aria-hidden className={icon} />
    </div>
  );
};

const style = sva({
  slots: ['wrapper', 'selectbox', 'icon'],
  base: {
    wrapper: {
      position: 'relative',
      width: 'fit-content',
      height: 'fit-content',
    },
    selectbox: {
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundColor: 'surface',
      paddingInline: '2',
      paddingBlock: '1',
      border: '1px solid',
      borderColor: 'muted',
      borderRadius: 'md',
      width: 'var(--width)',
    },
    icon: {
      position: 'absolute',
      top: '50%',
      right: '1',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    },
  },
  variants: {
    disabled: {
      true: {
        wrapper: {
          opacity: '0.5',
          cursor: 'not-allowed',
        },
      },
    },
  },
});
