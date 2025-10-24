'use client';

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  type MenuProps,
} from '@headlessui/react';
import { Check, Moon, Sun } from 'lucide-react';
import { type FC, Fragment } from 'react';
import { match } from 'ts-pattern';
import { sva } from '../../../../../styled-system/css';
import { Button } from '../../../../components/button/_base/button';
import { useSiteTheme } from '../../hooks/use-site-theme';
import { SiteTheme } from '../../models';

export type SiteThemeSwitchDropdownProps = MenuProps;

const ICON_SIZE = 32;

export const SiteThemeSwitchDropdown: FC<SiteThemeSwitchDropdownProps> = (
  props,
) => {
  const { theme, setting, setTheme } = useSiteTheme();

  const handleClick = (newTheme: SiteTheme) => () => {
    setTheme(newTheme);
  };

  const { items, item, check } = style();

  return (
    <Menu {...props}>
      <MenuButton as={Fragment}>
        <Button aria-label="テーマを変更する" variant="ghost">
          {match(theme)
            .with(SiteTheme.schema.enum.light, () => <Sun size={ICON_SIZE} />)
            .with(SiteTheme.schema.enum.dark, () => <Moon size={ICON_SIZE} />)
            .exhaustive()}
        </Button>
      </MenuButton>
      <MenuItems
        anchor={{
          to: 'bottom',
          gap: 8,
        }}
        className={items}
      >
        <MenuItem>
          <button
            className={item}
            onClick={handleClick(SiteTheme.schema.enum.light)}
            type="button"
          >
            ライトテーマ
            {setting === SiteTheme.schema.enum.light && (
              <Check className={check} />
            )}
          </button>
        </MenuItem>
        <MenuItem>
          <button
            className={item}
            onClick={handleClick(SiteTheme.schema.enum.dark)}
            type="button"
          >
            ダークテーマ
            {setting === SiteTheme.schema.enum.dark && (
              <Check className={check} />
            )}
          </button>
        </MenuItem>
        <MenuItem>
          <button
            className={item}
            onClick={handleClick(SiteTheme.schema.enum.system)}
            type="button"
          >
            システムテーマ
            {setting === SiteTheme.schema.enum.system && (
              <Check className={check} />
            )}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

const style = sva({
  slots: ['items', 'item', 'check'],
  base: {
    items: {
      backgroundColor: 'surface',
      border: '1px solid',
      borderColor: 'muted/20',
      borderRadius: 'sm',
      boxShadow: 'md',
      columnGap: '2',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
    },
    item: {
      color: 'text',
      cursor: 'pointer',
      display: 'grid',
      gridColumn: 'span 2',
      gridTemplateColumns: 'subgrid',
      paddingBlock: '2',
      paddingInline: '3',
      textAlign: 'left',
      transitionDuration: '0.2s',
      transitionProperty: 'color, background-color, border-color, box-shadow',
      transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
      width: 'full',
      _focus: {
        backgroundColor:
          'color-mix(in oklab, var(--colors-base), var(--color-mix-base) var(--color-mix-ratio))',
      },
      _hover: {
        backgroundColor:
          'color-mix(in oklab, var(--colors-base), var(--color-mix-base) var(--color-mix-ratio))',
      },
    },
    check: {
      color: 'pine',
    },
  },
});
