'use client';

import { mergeForm, useForm, useTransform } from '@tanstack/react-form';
import {
  type ComponentProps,
  type FC,
  type ReactNode,
  startTransition,
} from 'react';
import { cx, sva } from '../../../../../styled-system/css';
import { Button } from '../../../../components/button';
import { Checkbox } from '../../../../components/checkbox';
import { Prefecture, type PrefectureCode } from '../../models';

export type PrefectureCheckboxFormProps = ComponentProps<'form'> & {
  className?: string;
  state: unknown;
  action: (formData: FormData) => void | Promise<void>;
  prefectures: Prefecture[];
  defaultValues?: PrefectureCode[];
  legend?: ReactNode;
};

const NAME = Prefecture.key;
const PREFIX = `${NAME}-`;

export const PrefectureCheckboxForm: FC<PrefectureCheckboxFormProps> = ({
  className,
  state,
  action,
  prefectures,
  defaultValues: _defaultValues = [],
  legend,
}) => {
  const defaultValues = Object.fromEntries(
    prefectures.map(({ code }) => [
      `${PREFIX}${code}`,
      _defaultValues.includes(code),
    ]),
  );

  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      const formData = new FormData();
      Object.entries(value).forEach(([key, isChecked]) => {
        if (isChecked) {
          const prefectureCode = key.replace(PREFIX, '');
          formData.append(NAME, prefectureCode);
        }
      });
      startTransition(() => {
        action(formData);
      });
    },
    listeners: {
      onMount: ({ formApi }) => {
        if (formApi.state.isValid) {
          formApi.handleSubmit();
        }
      },
      onChange: ({ formApi }) => {
        if (formApi.state.isValid) {
          formApi.handleSubmit();
        }
      },
    },
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state ?? []),
      [state],
    ),
  });

  const { form: formStyle, fields, reset } = style();

  return (
    <form action={action} className={cx(formStyle, className)}>
      <fieldset>
        {legend}
        <div className={fields}>
          {prefectures.map(({ code, name }) => (
            <form.Field key={code} name={`${PREFIX}${code}`}>
              {(field) => (
                <Checkbox
                  checked={field.state.value}
                  label={name}
                  name={NAME}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  value={code.toString()}
                  variant="normal"
                />
              )}
            </form.Field>
          ))}
        </div>
      </fieldset>
      <Button
        className={reset}
        onClick={() => {
          form.reset();
          form.handleSubmit();
        }}
        type="reset"
        variant="normal"
      >
        リセット
      </Button>
    </form>
  );
};

const style = sva({
  slots: ['form', 'fields', 'reset'],
  base: {
    form: {
      display: 'grid',
      gridAutoFlow: 'row',
      width: 'full',
    },
    fields: {
      width: 'full',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, calc(var(--spacing-1) * 28))',
      columnGap: '8',
      rowGap: '4',
      paddingInline: '8',
      paddingBlock: '4',
      borderRadius: 'md',
    },
    reset: {
      justifySelf: 'center',
      width: 'fit-content',
    },
  },
});
