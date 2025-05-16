import type { ThemeStyles } from './theme';

export type ControlSectionProps = {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  className?: string;
  id?: string;
};
export interface CodePanelProps {
  themeEditorState: ThemeEditorState;
}

export interface CodePanelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themeEditorState: ThemeEditorState;
}
// Base interface for any editor's state
export interface BaseEditorState {
  styles: ThemeStyles;
}

export interface ThemeEditorState extends BaseEditorState {
  preset?: string;
  styles: ThemeStyles;
  currentMode: 'light' | 'dark';
}
