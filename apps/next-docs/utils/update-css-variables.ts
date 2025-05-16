import type { ThemeEditorState } from '#/types';

export type ThemeModeType = 'auto' | 'dark' | 'light';

function isDarkTheme(theme: string) {
  let dark = theme === 'dark';
  if (theme === 'auto') {
    dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return dark;
}

/**
 * 更新主题的 CSS 变量以及其他 CSS 变量
 * @param themeState - 当前主题状态对象
 */
function updateCSSVariables(themeState: ThemeEditorState) {
  const root = document.documentElement;
  if (!root) {
    return;
  }

  const { currentMode, styles } = themeState;
  const activeStyles = styles[currentMode];

  // 更新暗色模式类
  root.classList.toggle('dark', currentMode === 'dark');

  // 更新所有 CSS 变量
  for (const [key, value] of Object.entries(activeStyles)) {
    if (value !== undefined) {
      root.style.setProperty(`--${key}`, value);
    }
  }
}

export { isDarkTheme, updateCSSVariables };
