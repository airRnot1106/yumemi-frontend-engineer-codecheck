import { SiGithub } from '@icons-pack/react-simple-icons';
import type { ComponentProps, FC } from 'react';
import { cx, sva } from '../../../../../styled-system/css';
import { LinkButton } from '../../../../components/link-button/_base/link-button';
import { SiteThemeSwitchDropdown } from '../../../site-theme/components/site-theme-switch-dropdown';

export type SiteHeaderProps = ComponentProps<'header'>;

export const SiteHeader: FC<SiteHeaderProps> = ({ className, ...rest }) => {
  const { header, logo, menu } = style();

  return (
    <header className={cx(header, className)} {...rest}>
      <h1 className={logo}>都道府県人口データ</h1>
      <div className={menu}>
        <SiteThemeSwitchDropdown />
        <LinkButton
          href="https://github.com/airRnot1106/yumemi-frontend-engineer-codecheck"
          variant="ghost"
        >
          <SiGithub size="32" />
        </LinkButton>
      </div>
    </header>
  );
};

const style = sva({
  slots: ['header', 'logo', 'menu'],
  base: {
    header: {
      display: 'grid',
      gridAutoFlow: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingInline: '3',
      paddingBlock: '2',
      borderBottom: '1px solid',
      borderColor: 'muted/20',
    },
    logo: {
      fontSize: {
        base: 'xl',
        sm: '2xl',
        md: '4xl',
      },
      fontWeight: 'bold',
    },
    menu: {
      display: 'grid',
      gridAutoFlow: 'column',
      columnGap: '1',
      alignItems: 'center',
    },
  },
});
