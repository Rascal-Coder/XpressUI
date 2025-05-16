import { Label } from "@/components/ui/label";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import type { ColorPickerProps } from "#/types";
import { debounce } from "#/utils/debounce";

const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);

  // Update localColor if the prop changes externally
  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  // Create a stable debounced onChange handler
  const debouncedOnChange = useMemo(
    () => debounce((value: string) => onChange(value), 20),
    [onChange]
  );

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setLocalColor(newColor);
    debouncedOnChange(newColor);
  };

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  return (
    <div className="mb-3">
      <div className='mb-1.5 flex items-center justify-between'>
        <Label
          htmlFor={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
          className='font-medium text-xs'
        >
          {label}
        </Label>
      </div>
      <div className="flex items-center gap-1">
        {/* biome-ignore lint/nursery/noStaticElementInteractions: <explanation> */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          className='relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded border'
          style={{ backgroundColor: localColor }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <input
            type="color"
            id={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
            value={localColor}
            onChange={handleColorChange}
            className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
          />
        </div>
        <input
          type="text"
          value={localColor}
          onChange={handleColorChange}
          className='h-8 flex-1 rounded border border-border/20 bg-input/25 px-2 text-sm'
        />
      </div>
    </div>
  );
};

export default ColorPicker;
