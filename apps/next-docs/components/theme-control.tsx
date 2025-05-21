'use client';
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from '@repo/button';
import { Braces, MoonStar, RotateCcw, Sun, SunMoon } from "@repo/icons";
import { XpressTooltip } from '@repo/tooltip';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_FONT_MONO, DEFAULT_FONT_SANS, DEFAULT_FONT_SERIF, defaultThemeState } from '#/config/theme';
import { useEditorStore } from '#/store/editor-store';
import { getAppliedThemeFont, monoFonts, sansSerifFonts, serifFonts } from '#/utils/theme-fonts';
import { type ThemeModeType, updateCSSVariables } from '#/utils/update-css-variables';
import { CodePanelDialog } from './code-panel-dialog'
import ColorPicker from './color-picker';
import ControlSection from './control-section';
import { ThemeDrawer } from './theme-drawer';
import { ThemeFontSelect } from './theme-font-select';

const disableTransitionsTemporarily = () => {
    const style = document.createElement('style');
    style.textContent = '* { transition: none !important; }';
    document.head.appendChild(style);
    requestAnimationFrame(() => document.head.removeChild(style));
};


export function ThemeControl() {
    const { themeState, updateThemeState, updateThemeStyles } = useEditorStore();
    const { currentMode, styles } = themeState;
    const [isOpen, setIsOpen] = useState(false);
    const [isCodeViewerOpen, setIsCodeViewerOpen] = useState(false);

    const handleThemeChange = useCallback((mode: ThemeModeType) => {
        if (mode === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            updateThemeState({ currentMode: prefersDark ? 'dark' : 'light' });
        } else {
            updateThemeState({ currentMode: mode });
        }
        disableTransitionsTemporarily();
    }, [updateThemeState]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent, mode: ThemeModeType) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleThemeChange(mode);
        }
    }, [handleThemeChange]);

    // 初始化主题
    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedThemeState = localStorage.getItem('editor-storage');

        if (!savedThemeState) {
            // 如果没有保存的主题状态，使用系统偏好
            updateThemeState({
                currentMode: prefersDark ? 'dark' : 'light'
            });
        }
    }, [updateThemeState]);

    // 监听系统主题变化
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('editor-storage')) {
                updateThemeState({
                    currentMode: e.matches ? 'dark' : 'light'
                });
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [updateThemeState]);

    const currentStyles = useMemo(
        () => ({
            ...defaultThemeState.styles[currentMode],
            ...styles?.[currentMode],
        }),
        [currentMode, styles]
    );

    // 监听主题状态变化并更新 CSS 变量
    useEffect(() => {
        updateCSSVariables(themeState);
    }, [themeState]);

    const updateStyle = useCallback(
        <K extends keyof typeof currentStyles>(key: K, value: (typeof currentStyles)[K]) => {
            updateThemeStyles(key, value);
            disableTransitionsTemporarily();
        },
        [updateThemeStyles]
    );
    type Icon =
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        | ((props: any) => React.ReactNode)
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        | React.ComponentType<any>
        | string;
    const THEME_PRESET: Array<{ icon: Icon; label: string; name: ThemeModeType }> =
        [
            {
                icon: Sun,
                name: 'light',
                label: '浅色',
            },
            {
                icon: MoonStar,
                name: 'dark',
                label: '深色',
            },
            {
                icon: SunMoon,
                name: 'auto',
                label: '跟随系统',
            },
        ];

    const footerRender = () => {
        return (
            <div className="flex items-center justify-end gap-2">
                <XpressTooltip
                    side='top'
                    trigger={
                        <Button
                            type="button"
                            onClick={() => {
                                updateThemeState({
                                    ...defaultThemeState,
                                    currentMode: themeState.currentMode
                                });
                                disableTransitionsTemporarily();
                            }}
                            buttonColor="primary"
                            variant="solid"
                            startIcon={<RotateCcw size={18} />}
                            className="w-full"
                        >
                            Reset
                        </Button>
                    }>
                    Reset to preset defaults
                </XpressTooltip>


            </div>
        )
    }
    return (
        <div className='flex items-center gap-2 rounded-lg border border-border bg-background p-2 shadow-md'>
            <ThemeDrawer isOpen={isOpen} setIsOpen={setIsOpen} footer={footerRender()}>
                <div className='mb-6 grid grid-cols-3 gap-4'>
                    {THEME_PRESET.map((item) => (
                        <button
                            type="button"
                            className="flex cursor-pointer flex-col border-0 bg-transparent p-0"
                            key={item.name}
                            onClick={() => handleThemeChange(item.name)}
                            onKeyDown={(e) => handleKeyPress(e, item.name)}
                        >
                            <div
                                className={`flex-center py-4 outline-box transition-all ${currentMode === item.name ? 'outline-box-active' : ''
                                    }`}
                            >
                                <item.icon className="mx-9 size-5" />
                            </div>
                            <div className='mt-2 text-center text-muted-foreground text-xs'>
                                {item.label}
                            </div>
                        </button>
                    ))}
                </div>
                <ControlSection title="Primary Colors" id="primary-colors" expanded>
                    <ColorPicker
                        color={currentStyles.primary}
                        onChange={(color) => updateStyle("primary", color)}
                        label="Primary"
                    />
                    <ColorPicker
                        color={currentStyles["primary-foreground"]}
                        onChange={(color) => updateStyle("primary-foreground", color)}
                        label="Primary Foreground"
                    />
                </ControlSection>

                <ControlSection title="Border Colors" id="border-colors" expanded>
                    <ColorPicker
                        color={currentStyles.border}
                        onChange={(color) => updateStyle("border", color)}
                        label="Border"
                    />
                    <ColorPicker
                        color={currentStyles.input}
                        onChange={(color) => updateStyle("input", color)}
                        label="Input"
                    />
                    <ColorPicker
                        color={currentStyles.ring}
                        onChange={(color) => updateStyle("ring", color)}
                        label="Ring"
                    />
                </ControlSection>

                <ControlSection title="Muted Colors" id="muted-colors" expanded>
                    <ColorPicker
                        color={currentStyles.muted}
                        onChange={(color) => updateStyle("muted", color)}
                        label="Muted"
                    />
                    <ColorPicker
                        color={currentStyles["muted-foreground"]}
                        onChange={(color) => updateStyle("muted-foreground", color)}
                        label="Muted Foreground"
                    />
                </ControlSection>

                <ControlSection title="Accent Colors" id="accent-colors" expanded>
                    <ColorPicker
                        color={currentStyles.accent}
                        onChange={(color) => updateStyle("accent", color)}
                        label="Accent"
                    />
                    <ColorPicker
                        color={currentStyles["accent-foreground"]}
                        onChange={(color) => updateStyle("accent-foreground", color)}
                        label="Accent Foreground"
                    />
                </ControlSection>

                <ControlSection title="Card Colors" id="card-colors" expanded>
                    <ColorPicker
                        color={currentStyles.card}
                        onChange={(color) => updateStyle("card", color)}
                        label="Card"
                    />
                    <ColorPicker
                        color={currentStyles["card-foreground"]}
                        onChange={(color) => updateStyle("card-foreground", color)}
                        label="Card Foreground"
                    />
                </ControlSection>

                <ControlSection title="Secondary Colors" id="secondary-colors" expanded>
                    <ColorPicker
                        color={currentStyles.secondary}
                        onChange={(color) => updateStyle("secondary", color)}
                        label="Secondary"
                    />
                    <ColorPicker
                        color={currentStyles["secondary-foreground"]}
                        onChange={(color) => updateStyle("secondary-foreground", color)}
                        label="Secondary Foreground"
                    />
                </ControlSection>

                <ControlSection title="Destructive Colors" id="destructive-colors" expanded>
                    <ColorPicker
                        color={currentStyles.destructive}
                        onChange={(color) => updateStyle("destructive", color)}
                        label="Destructive"
                    />
                    <ColorPicker
                        color={currentStyles["destructive-foreground"]}
                        onChange={(color) => updateStyle("destructive-foreground", color)}
                        label="Destructive Foreground"
                    />
                </ControlSection>

                <ControlSection title="Popover Colors" id="popover-colors" expanded>
                    <ColorPicker
                        color={currentStyles.popover}
                        onChange={(color) => updateStyle("popover", color)}
                        label="Popover"
                    />
                    <ColorPicker
                        color={currentStyles["popover-foreground"]}
                        onChange={(color) => updateStyle("popover-foreground", color)}
                        label="Popover Foreground"
                    />
                </ControlSection>

                <ControlSection title="Font Family" expanded>
                    <div className="mb-4">
                        <Label htmlFor="font-sans" className="mb-1.5 block text-xs">
                            Sans-Serif Font
                        </Label>
                        <ThemeFontSelect
                            fonts={{ ...sansSerifFonts, ...serifFonts, ...monoFonts }}
                            defaultValue={DEFAULT_FONT_SANS}
                            currentFont={getAppliedThemeFont(themeState, "font-sans")}
                            onFontChange={(value) => updateStyle("font-sans", value)}
                        />
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-4">
                        <Label htmlFor="font-serif" className="mb-1.5 block text-xs">
                            Serif Font
                        </Label>
                        <ThemeFontSelect
                            fonts={{ ...serifFonts, ...sansSerifFonts, ...monoFonts }}
                            defaultValue={DEFAULT_FONT_SERIF}
                            currentFont={getAppliedThemeFont(themeState, "font-serif")}
                            onFontChange={(value) => updateStyle("font-serif", value)}
                        />
                    </div>

                    <Separator className="my-4" />
                    <div>
                        <Label htmlFor="font-mono" className="mb-1.5 block text-xs">
                            Monospace Font
                        </Label>
                        <ThemeFontSelect
                            fonts={{ ...monoFonts, ...sansSerifFonts, ...serifFonts }}
                            defaultValue={DEFAULT_FONT_MONO}
                            currentFont={getAppliedThemeFont(themeState, "font-mono")}
                            onFontChange={(value) => updateStyle("font-mono", value)}
                        />
                    </div>
                </ControlSection>
            </ThemeDrawer>
            <XpressTooltip
                side='top'
                trigger={
                    <button
                        type="button"
                        className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border transition-colors hover:bg-muted'
                        aria-label="切换主题"
                        onClick={() => setIsOpen(true)}
                    >
                        <svg
                            className='h-4 w-4'
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                            />
                        </svg>
                    </button>
                }>
                Theme Settings
            </XpressTooltip>
            <XpressTooltip side='top' trigger={
                <Button
                    buttonColor='primary'
                    variant="soft"
                    startIcon={<Braces size={18} aria-hidden="true" />}
                    onClick={() => setIsCodeViewerOpen(true)}
                >
                    Code
                </Button>
            }>
                View theme code
            </XpressTooltip>
            <CodePanelDialog open={isCodeViewerOpen} onOpenChange={setIsCodeViewerOpen} themeEditorState={themeState} />
        </div>
    );
} 