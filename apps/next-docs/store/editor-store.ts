import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultThemeState } from '#/config/theme';
import type { ThemeEditorState } from '#/types';

interface EditorStore {
  themeState: ThemeEditorState;
  updateThemeState: (newState: Partial<ThemeEditorState>) => void;
  updateThemeStyles: (key: string, value: string) => void;
}

const STORAGE_KEY = 'editor-storage';

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      themeState: defaultThemeState,
      updateThemeState: (newState) =>
        set((state) => ({
          themeState: { ...state.themeState, ...newState },
        })),
      updateThemeStyles: (key, value) =>
        set((state) => ({
          themeState: {
            ...state.themeState,
            styles: {
              light: {
                ...state.themeState.styles.light,
                [key]: value,
              },
              dark: {
                ...state.themeState.styles.dark,
                [key]: value,
              },
            },
          },
        })),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ themeState: state.themeState }),
    }
  )
);
