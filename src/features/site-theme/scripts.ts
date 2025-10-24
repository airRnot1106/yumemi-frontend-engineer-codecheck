import type { SiteTheme } from './models';

(() => {
  const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ('dark' satisfies typeof SiteTheme.schema.enum.dark)
    : ('light' satisfies typeof SiteTheme.schema.enum.light);
  const setting = localStorage.getItem(
    'site-theme' satisfies typeof SiteTheme.key,
  );
  const theme =
    setting === ('system' satisfies typeof SiteTheme.schema.enum.system) ||
    setting === null
      ? prefers
      : setting;
  window.document.documentElement.dataset.theme = theme;
  window.document.documentElement.style.setProperty(
    '--color-mix-ratio',
    theme === ('light' satisfies typeof SiteTheme.schema.enum.light)
      ? '7%'
      : '12%',
  );
})();

('(()=>{const e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",t=localStorage.getItem("site-theme"),o="system"===t||null===t?e:t;window.document.documentElement.dataset.theme=o,window.document.documentElement.style.setProperty("--color-mix-ratio","light"===o?"7%":"12%")})();');
