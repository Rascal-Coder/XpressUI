
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "@repo/icons";
import { useState } from "react";
import type { ControlSectionProps } from "#/types";

const ControlSection = ({
  title,
  children,
  expanded = false,
  className,
  id,
}: ControlSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div
      id={id}
      className={cn('mb-4 overflow-hidden rounded-lg border', className)}
    >
      {/* biome-ignore lint/nursery/noStaticElementInteractions: <explanation> */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className='flex cursor-pointer items-center justify-between bg-background p-3 hover:bg-muted'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-medium text-sm">{title}</h3>
        <button
          type="button"
          className='text-muted-foreground transition-colors hover:text-foreground'
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className='border-t bg-background p-3'>{children}</div>
      </div>
    </div>
  );
};

export default ControlSection;
