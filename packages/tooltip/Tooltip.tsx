import type { XpressTooltipProps } from './types';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
export function XpressTooltip({
  contentClass,
  contentStyle,
  delayDuration = 0,
  side = 'right',
  trigger,
  children,
}: XpressTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild tabIndex={-1}>
          {trigger}
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            'side-content z-popup rounded-md bg-accent text-popover-foreground',
            contentClass,
          )}
          side={side}
          style={contentStyle}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
