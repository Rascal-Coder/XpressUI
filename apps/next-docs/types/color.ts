export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';
export type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  label: string;
};
