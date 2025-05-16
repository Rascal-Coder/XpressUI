import { z } from 'zod';

export type ThemePreset = {
  label?: string;
  styles: {
    light: Partial<ThemeStyleProps>;
    dark: Partial<ThemeStyleProps>;
  };
};
export interface ThemeFontSelectProps {
  fonts: Record<string, string>;
  defaultValue: string;
  currentFont: string | null;
  onFontChange: (font: string) => void;
}

export type ThemeStyles = z.infer<typeof themeStylesSchema>;
export type ThemeStyleProps = z.infer<typeof themeStylePropsSchema>;
// 基础颜色属性
const baseColorProps = {
  background: z.string(),
  foreground: z.string(),
  card: z.string(),
  'card-foreground': z.string(),
  popover: z.string(),
  'popover-foreground': z.string(),
  muted: z.string(),
  'muted-foreground': z.string(),
  primary: z.string(),
  'primary-foreground': z.string(),
  destructive: z.string(),
  'destructive-foreground': z.string(),
  info: z.string(),
  'info-foreground': z.string(),
  carbon: z.string(),
  'carbon-foreground': z.string(),
  success: z.string(),
  'success-foreground': z.string(),
  warning: z.string(),
  'warning-foreground': z.string(),
  secondary: z.string(),
  'secondary-foreground': z.string(),
  accent: z.string(),
  'accent-foreground': z.string(),
};

// 边框和输入框属性
const borderProps = {
  border: z.string(),
  input: z.string(),
  'input-placeholder': z.string(),
  'input-background': z.string(),
  ring: z.string(),
  radius: z.string(),
};

// 遮罩层属性
const overlayProps = {
  overlay: z.string(),
  'overlay-content': z.string(),
};

// 字体属性
const fontProps = {
  'font-sans': z.string(),
  'font-serif': z.string(),
  'font-mono': z.string(),
};

// 侧边栏属性
const sidebarProps = {
  'sidebar-foreground': z.string(),
  'sidebar-primary': z.string(),
  'sidebar-primary-foreground': z.string(),
  'sidebar-accent': z.string(),
  'sidebar-accent-foreground': z.string(),
  'sidebar-border': z.string(),
  'sidebar-ring': z.string(),
  'sidebar-background': z.string(),
};

// 阴影属性
const shadowProps = {
  'shadow-2xs': z.string(),
  'shadow-xs': z.string(),
  'shadow-sm': z.string(),
  'shadow-md': z.string(),
  'shadow-lg': z.string(),
  'shadow-xl': z.string(),
  'shadow-2xl': z.string(),
};

// 合并所有属性
export const themeStylePropsSchema = z.object({
  ...baseColorProps,
  ...borderProps,
  ...fontProps,
  ...shadowProps,
  ...sidebarProps,
  ...overlayProps,
  'scroll-shadow': z.string(),
});

// 主题模式
export const themeStylesSchema = z.object({
  light: themeStylePropsSchema,
  dark: themeStylePropsSchema,
});
