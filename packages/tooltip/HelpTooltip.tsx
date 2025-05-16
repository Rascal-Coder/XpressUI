import { cn } from '@/lib/utils';

import { CircleHelp } from '@repo/icons';

import { XpressTooltip } from './Tooltip';

interface HelpTooltipProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  triggerClass?: string;
}

export function XpressHelpTooltip({
  trigger,
  triggerClass,
  children,
}: HelpTooltipProps) {
  return (
    <XpressTooltip
      delayDuration={300}
      side="right"
      trigger={
        trigger || (
          <CircleHelp
            className={cn(
              'inline-flex h-5 w-5 cursor-pointer text-foreground/80 hover:text-foreground',
              triggerClass,
            )}
          />
        )
      }
    >
      {children}
    </XpressTooltip>
  );
}
