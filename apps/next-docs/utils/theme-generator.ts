import type { ColorFormat, ThemeEditorState, ThemeStyles } from '#/types';
import { colorFormatter } from '#/utils/color-converter';

type ThemeMode = 'light' | 'dark';

/**
 * 生成颜色变量
 * @param themeStyles 主题样式
 * @param mode 主题模式（亮色/暗色）
 * @param formatColor 颜色格式化函数
 * @returns 颜色变量字符串
 */
const generateColorVariables = (
  themeStyles: ThemeStyles,
  mode: ThemeMode,
  formatColor: (color: string) => string
): string => {
  const styles = themeStyles[mode];
  return `
  --background: ${formatColor(styles.background)};
  --foreground: ${formatColor(styles.foreground)};
  --card: ${formatColor(styles.card)};
  --card-foreground: ${formatColor(styles['card-foreground'])};
  --popover: ${formatColor(styles.popover)};
  --popover-foreground: ${formatColor(styles['popover-foreground'])};
  --primary: ${formatColor(styles.primary)};
  --primary-foreground: ${formatColor(styles['primary-foreground'])};
  --secondary: ${formatColor(styles.secondary)};
  --secondary-foreground: ${formatColor(styles['secondary-foreground'])};
  --muted: ${formatColor(styles.muted)};
  --muted-foreground: ${formatColor(styles['muted-foreground'])};
  --accent: ${formatColor(styles.accent)};
  --accent-foreground: ${formatColor(styles['accent-foreground'])};
  --destructive: ${formatColor(styles.destructive)};
  --destructive-foreground: ${formatColor(styles['destructive-foreground'])};
  --border: ${formatColor(styles.border)};
  --input: ${formatColor(styles.input)};
  --ring: ${formatColor(styles.ring)};
  --info: ${formatColor(styles.info)};
  --info-foreground: ${formatColor(styles['info-foreground'])};
  --carbon: ${formatColor(styles.carbon)};
  --carbon-foreground: ${formatColor(styles['carbon-foreground'])};
  --success: ${formatColor(styles.success)};
  --success-foreground: ${formatColor(styles['success-foreground'])};
  --warning: ${formatColor(styles.warning)};
  --warning-foreground: ${formatColor(styles['warning-foreground'])};
  --sidebar-background: ${formatColor(styles['sidebar-background'])};
  --sidebar-foreground: ${formatColor(styles['sidebar-foreground'])};
  --sidebar-primary: ${formatColor(styles['sidebar-primary'])};
  --sidebar-primary-foreground: ${formatColor(styles['sidebar-primary-foreground'])};
  --sidebar-accent: ${formatColor(styles['sidebar-accent'])};
  --sidebar-accent-foreground: ${formatColor(styles['sidebar-accent-foreground'])};
  --sidebar-border: ${formatColor(styles['sidebar-border'])};
  --sidebar-ring: ${formatColor(styles['sidebar-ring'])};`;
};

/**
 * 生成字体变量
 * @param themeStyles 主题样式
 * @param mode 主题模式
 * @returns 字体变量字符串
 */
const generateFontVariables = (
  themeStyles: ThemeStyles,
  mode: ThemeMode
): string => {
  const styles = themeStyles[mode];
  return `
  --font-sans: ${styles['font-sans']};
  --font-serif: ${styles['font-serif']};
  --font-mono: ${styles['font-mono']};`;
};

/**
 * 生成主题变量
 * @param themeStyles 主题样式
 * @param mode 主题模式
 * @param formatColor 颜色格式化函数
 * @returns 主题变量字符串
 */
const generateThemeVariables = (
  themeStyles: ThemeStyles,
  mode: ThemeMode,
  formatColor: (color: string) => string
): string => {
  const selector = mode === 'dark' ? '.dark' : ':root';
  const colorVars = generateColorVariables(themeStyles, mode, formatColor);
  const fontVars = generateFontVariables(themeStyles, mode);
  const radiusVar = `\n  --radius: ${themeStyles[mode].radius};`;

  return `${selector} {${colorVars}${fontVars}${radiusVar}\n}`;
};

const generateTailwindV4ThemeInline = (themeStyles: ThemeStyles): string => {
  return `@theme inline {
 /* color */
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-carbon: var(--carbon);
  --color-carbon-foreground: var(--carbon-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  /* font */
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);

  /* radius */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* sidebar */
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  /* ring */
  --color-ring: var(--ring);
  /* input */
  --color-input: var(--input);

  /* border */
  --color-border: var(--border);
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  /* custom */
  --overlay-content: var(--overlay-content);
  --overlay: var(--overlay);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);

  --tracking-tighter: calc(var(--letter-spacing) - 0.05em);
  --tracking-tight: calc(var(--letter-spacing) - 0.025em);
  --tracking-normal: var(--letter-spacing);
  --tracking-wide: calc(var(--letter-spacing) + 0.025em);
  --tracking-wider: calc(var(--letter-spacing) + 0.05em);
  --tracking-widest: calc(var(--letter-spacing) + 0.1em);

  /* scroll area shadows */
  --scroll-shadow: var(--scroll-shadow);
  --scroll-shadow-left: linear-gradient(90deg, transparent, #000 24px);
  --scroll-shadow-right: linear-gradient(
    90deg,
    #000 0%,
    #000 calc(100% - 24px),
    transparent
  );
  --scroll-shadow-both: linear-gradient(
    90deg,
    transparent,
    #000 24px,
    #000 calc(100% - 24px),
    transparent 100%
  );
  --scroll-shadow-top: linear-gradient(
    to bottom,
    var(--scroll-shadow) 0%,
    transparent 100%
  );
  --scroll-shadow-bottom: linear-gradient(
    to top,
    var(--scroll-shadow) 0%,
    transparent 100%
  );

  @keyframes accordion-down {
    from {
      height: 0;
    }

    to {
      height: var(--radix-accordion-content-height);
    }
  }

  @keyframes accordion-up {
    from {
      height: var(--radix-accordion-content-height);
    }

    to {
      height: 0;
    }
  }
}`;
};
/**
 * 生成主题代码
 * @param themeEditorState 主题编辑器状态
 * @param colorFormat 颜色格式
 * @returns 主题代码字符串
 */
export const generateThemeCode = (
  themeEditorState: ThemeEditorState,
  colorFormat: ColorFormat = 'hsl'
): string => {
  if (
    !themeEditorState ||
    !('light' in themeEditorState.styles) ||
    !('dark' in themeEditorState.styles)
  ) {
    throw new Error('Invalid theme styles: missing light or dark mode');
  }

  const themeStyles = themeEditorState.styles as ThemeStyles;
  const formatColor = (color: string) => colorFormatter(color, colorFormat);

  const lightTheme = generateThemeVariables(themeStyles, 'light', formatColor);
  const darkTheme = generateThemeVariables(themeStyles, 'dark', formatColor);
  const tailwindV4Theme = `${generateTailwindV4ThemeInline(themeStyles)}`;
  const constantsTheme = `
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));
@layer base {
  *,
  ::after,
  ::before {
    @apply border-border;

    box-sizing: border-box;
    border-style: solid;
    border-width: 0;
  }

  html {
    @apply text-foreground bg-background text-[100%];

    font-variation-settings: normal;
    line-height: 1.15;
    text-size-adjust: 100%;
    font-synthesis-weight: none;
    scroll-behavior: smooth;
    text-rendering: optimizelegibility;
    -webkit-tap-highlight-color: transparent;
  }

  body,
  html {
    @apply size-full;
  }

  body {
    min-height: 100vh;
  }

  a,
  a:active,
  a:hover,
  a:link,
  a:visited {
    @apply no-underline;
  }

  input::placeholder,
  textarea::placeholder {
    @apply opacity-100;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    @apply m-0 appearance-none;
  }

  /* 只有非mac下才进行调整，mac下使用默认滚动条 */
  html:not([data-platform="macOs"]) {
    ::-webkit-scrollbar {
      @apply h-[10px] w-[10px];
    }

    ::-webkit-scrollbar-thumb {
      @apply bg-border rounded-sm border-none;
    }

    ::-webkit-scrollbar-track {
      @apply rounded-sm border-none bg-transparent shadow-none;
    }

    ::-webkit-scrollbar-button {
      @apply hidden;
    }
  }
}
  `;
  const otherTheme = `
:root {
  --popup-z-index: 2000;
}
.z-popup {
  z-index: var(--popup-z-index);
}
  `;
  return `${constantsTheme}\n\n${tailwindV4Theme}\n\n${lightTheme}\n\n${darkTheme}\n\n${otherTheme}`;
};
