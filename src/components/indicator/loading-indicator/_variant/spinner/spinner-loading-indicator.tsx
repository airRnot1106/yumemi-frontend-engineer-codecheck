import { LoaderCircle } from 'lucide-react';
import type { ComponentProps, FC } from 'react';
import { cva, cx } from '../../../../../../styled-system/css';
import type { SystemStyleObject } from '../../../../../../styled-system/types';
import { Size } from '../../../../../features/size/models';

export type SpinnerLoadingIndicatorProps = ComponentProps<'div'> & {
  size?: Size;
};

export const SpinnerLoadingIndicator: FC<SpinnerLoadingIndicatorProps> = ({
  className,
  size = Size.schema.enum.md,
}) => {
  return <LoaderCircle className={cx(style({ size }), className)} />;
};

const style = cva({
  base: {
    animation: 'spin',
  },
  variants: {
    size: {
      xs: {
        width: '4',
        height: '4',
      },
      sm: {
        width: '6',
        height: '6',
      },
      md: {
        width: '8',
        height: '8',
      },
      lg: {
        width: '10',
        height: '10',
      },
      xl: {
        width: '12',
        height: '12',
      },
    } satisfies Record<Size, SystemStyleObject>,
  },
});
