import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type React from "react";
import { useMemo } from "react";
import type { ThemeFontSelectProps } from "#/types";



export const ThemeFontSelect: React.FC<ThemeFontSelectProps> = ({
    fonts,
    defaultValue,
    currentFont,
    onFontChange,
}) => {
    const fontNames = useMemo(() => ["System", ...Object.keys(fonts)], [fonts]);
    const value = currentFont ? fonts[currentFont] ?? defaultValue : defaultValue;

    return (
        <Select value={value || ""} onValueChange={onFontChange}>
            <div className='flex w-full items-center gap-1'>
                <SelectTrigger className="w-full bg-secondary text-secondary-foreground">
                    <SelectValue placeholder="Select theme font" />
                </SelectTrigger>
            </div>
            <SelectContent className="max-h-[400px]">
                <SelectGroup>
                    {fontNames.map((fontName) => (
                        <SelectItem key={fontName} value={fonts[fontName] ?? defaultValue}>
                            <span
                                style={{
                                    fontFamily: fonts[fontName] ?? defaultValue,
                                }}
                            >
                                {fontName}
                            </span>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};


