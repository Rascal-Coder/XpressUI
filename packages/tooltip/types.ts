declare const SIDE_OPTIONS: readonly ['top', 'right', 'bottom', 'left'];
type Side = (typeof SIDE_OPTIONS)[number];
export interface XpressTooltipProps {
  children: React.ReactNode;
  contentClass?: string;
  contentStyle?: React.CSSProperties;
  delayDuration?: number;
  side?: Side;
  trigger: React.ReactNode;
}
