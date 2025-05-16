import type { ThemeEditorState } from '../types/editor';

export const DEFAULT_FONT_SANS =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

export const DEFAULT_FONT_SERIF =
  'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

export const DEFAULT_FONT_MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// Default light theme styles
export const defaultLightThemeStyles = {
  'scroll-shadow': '#ffffffd9',
  background: '#ffffff',
  foreground: '#353a3f',
  card: '#ffffff',
  'card-foreground': '#0a0d0c',
  popover: '#ffffff',
  'popover-foreground': '#0a0d0c',
  muted: '#f7f7f7',
  'muted-foreground': '#8e8e8e',
  primary: '#0066e6',
  'primary-foreground': '#fafafa',
  destructive: '#e61f1f',
  'destructive-foreground': '#fafafa',
  info: '#0066e6',
  'info-foreground': '#ffffff',
  carbon: '#292a2a',
  'carbon-foreground': '#fafafa',
  success: '#4cd964',
  'success-foreground': '#fafafa',
  warning: '#e6b800',
  'warning-foreground': '#fafafa',
  secondary: '#f5f5f6',
  'secondary-foreground': '#1a1a1a',
  accent: '#f5f5f6',
  'accent-foreground': '#1a1a1a',
  border: '#e6e6e6',
  input: '#e6e6e6',
  'input-placeholder': '#a6a6a6',
  'input-background': '#ffffff',
  ring: '#0a0d0c',
  radius: '0.5rem',
  overlay: '#00000073',
  'overlay-content': '#f2f2f273',
  // font
  'font-sans': DEFAULT_FONT_SANS,
  'font-serif': DEFAULT_FONT_SERIF,
  'font-mono': DEFAULT_FONT_MONO,
  // sidebar
  'sidebar-background': '#fafafa',
  'sidebar-foreground': '#424242',
  'sidebar-primary': '#6b8aff',
  'sidebar-primary-foreground': '#fafafa',
  'sidebar-accent': '#f5f5f6',
  'sidebar-accent-foreground': '#1a1a1a',
  'sidebar-border': '#e8e8e8',
  'sidebar-ring': '#4d8aff',
  // shadow
  'shadow-2xs': '0px 4px 8px -1px rgba(26, 26, 26, 0.05)',
  'shadow-xs': '0px 4px 8px -1px rgba(26, 26, 26, 0.05)',
  'shadow-sm':
    '0px 4px 8px -1px rgba(26, 26, 26, 0.1), 0px 1px 2px -2px rgba(26, 26, 26, 0.1)',
  'shadow-md':
    '0px 4px 8px -1px rgba(26, 26, 26, 0.1), 0px 2px 4px -2px rgba(26, 26, 26, 0.1)',
  'shadow-lg':
    '0px 4px 8px -1px rgba(26, 26, 26, 0.1), 0px 4px 6px -2px rgba(26, 26, 26, 0.1)',
  'shadow-xl':
    '0px 4px 8px -1px rgba(26, 26, 26, 0.1), 0px 8px 10px -2px rgba(26, 26, 26, 0.1)',
  'shadow-2xl': '0px 4px 8px -1px rgba(26, 26, 26, 0.25)',
};

// Default dark theme styles
export const defaultDarkThemeStyles = {
  ...defaultLightThemeStyles,
  'scroll-shadow': '#00000040',
  background: '#1f2023',
  foreground: '#f2f2f2',
  card: '#1f2023',
  'card-foreground': '#f0f4f8',
  popover: '#1e1f22',
  'popover-foreground': '#f0f4f8',
  muted: '#282828',
  'muted-foreground': '#a6a6a6',
  primary: '#6b8aff',
  'primary-foreground': '#fafafa',
  destructive: '#e61f1f',
  'destructive-foreground': '#fafafa',
  info: '#0066e6',
  'info-foreground': '#ffffff',
  carbon: '#f5f5f6',
  'carbon-foreground': '#1c1c1c',
  success: '#4cd964',
  'success-foreground': '#fafafa',
  warning: '#e6b800',
  'warning-foreground': '#fafafa',
  secondary: '#2b2b2b',
  'secondary-foreground': '#fafafa',
  accent: '#2f3033',
  'accent-foreground': '#fafafa',
  border: '#383838',
  input: 'rgba(255, 255, 255, 0.1)',
  'input-placeholder': '#a6a6a6',
  'input-background': 'rgba(255, 255, 255, 0.05)',
  ring: '#0a0d0c',
  // Actual has radius but not in Expected, keeping it as is
  radius: '0.5rem',
  overlay: 'rgba(0, 0, 0, 0.4)',
  'overlay-content': 'rgba(0, 0, 0, 0.4)',
};

// Default theme state
export const defaultThemeState: ThemeEditorState = {
  styles: {
    light: defaultLightThemeStyles,
    dark: defaultDarkThemeStyles,
  },
  currentMode:
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
};
