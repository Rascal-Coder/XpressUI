'use client';

import { Card } from '@/components/ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import {
  DndContext,
  MouseSensor,
  useDraggable,
  useSensor,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { PlusIcon, TrashIcon } from '@repo/icons';
import { useMouse, useThrottle, useWindowScroll } from '@uidotdev/usehooks';
import { formatDate, getDate } from 'date-fns';
import { formatDistance, isSameDay } from 'date-fns';
import { format } from 'date-fns';
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  endOfDay,
  endOfMonth,
  getDaysInMonth,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { atom, useAtom } from 'jotai';
import throttle from 'lodash.throttle';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  CSSProperties,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefObject,
} from 'react';

const draggingAtom = atom(false);
const scrollXAtom = atom(0);

export const useGanttDragging = () => useAtom(draggingAtom);
export const useGanttScrollX = () => useAtom(scrollXAtom);

export type GanttStatus = {
  id: string;
  name: string;
  color: string;
};

export type GanttFeature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: GanttStatus;
  progress: number; // 0-100 的进度值
};

export type GanttMarkerProps = {
  id: string;
  date: Date;
  label: string;
};

export type Range = 'daily' | 'weekly' | 'monthly';

export type TimelineData = {
  year: number;
  quarters: {
    months: {
      days: number;
    }[];
  }[];
}[];

export type GanttContextProps = {
  zoom: number;
  range: Range;
  columnWidth: number;
  sidebarWidth: number;
  headerHeight: number;
  rowHeight: number;
  onAddItem: ((date: Date) => void) | undefined;
  placeholderLength: number;
  timelineData: TimelineData;
  ref: RefObject<HTMLDivElement | null> | null;
};

const getsDaysIn = (range: Range) => {
  switch (range) {
    case 'weekly':
      return () => 7; // 7天
    case 'monthly':
      return getDaysInMonth;
    default:
      return () => 1;
  }
};

const getDifferenceIn = (range: Range) => {
  switch (range) {
    case 'weekly':
      return (date1: Date | number | string, date2: Date | number | string) =>
        Math.floor(differenceInDays(date1, date2) / 7);
    case 'monthly':
      return differenceInMonths;
    default:
      return differenceInDays;
  }
};

const getInnerDifferenceIn = (range: Range) => {
  switch (range) {
    case 'weekly':
      return (date1: Date | number | string, date2: Date | number | string) =>
        differenceInDays(date1, date2) % 7;
    case 'monthly':
      return differenceInDays;
    default:
      return differenceInHours;
  }
};

const getStartOf = (range: Range) => {
  switch (range) {
    case 'weekly':
      return (date: Date | number | string) => {
        const d = new Date(date);
        const day = d.getDay();
        return addDays(startOfDay(d), -day);
      };
    case 'monthly':
      return startOfMonth;
    default:
      return startOfDay;
  }
};

const getEndOf = (range: Range) => {
  switch (range) {
    case 'weekly':
      return (date: Date | number | string) => {
        const d = new Date(date);
        const day = d.getDay();
        return addDays(endOfDay(d), 6 - day);
      };
    case 'monthly':
      return endOfMonth;
    default:
      return endOfDay;
  }
};

const getAddRange = (range: Range) => {
  switch (range) {
    case 'weekly':
      return (date: Date | number | string, amount: number) =>
        addDays(new Date(date), amount * 7);
    case 'monthly':
      return addMonths;
    default:
      return addDays;
  }
};

const getDateByMousePosition = (context: GanttContextProps, mouseX: number) => {
  const timelineStartDate = new Date(context.timelineData[0].year, 0, 1);
  const columnWidth = (context.columnWidth * context.zoom) / 100;
  const offset = Math.floor(mouseX / columnWidth);
  const daysIn = getsDaysIn(context.range);
  const addRange = getAddRange(context.range);
  const month = addRange(timelineStartDate, offset);
  const daysInMonth = daysIn(month);
  const pixelsPerDay = Math.round(columnWidth / daysInMonth);
  const dayOffset = Math.floor((mouseX % columnWidth) / pixelsPerDay);
  const actualDate = addDays(month, dayOffset);

  return actualDate;
};

const dateCalculationCache = new Map<string, number>();

const memoizedCalculation = (key: string, calculation: () => number) => {
  if (!dateCalculationCache.has(key)) {
    dateCalculationCache.set(key, calculation());
  }
  return dateCalculationCache.get(key) as number;
};

const getWidth = (startAt: Date, endAt: Date | null, context: GanttContextProps) => {
  const cacheKey = `width-${startAt.getTime()}-${endAt?.getTime() ?? 'null'}-${context.range}-${context.columnWidth}-${context.zoom}`;

  return memoizedCalculation(cacheKey, () => {
    const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;

    if (!endAt) {
      return parsedColumnWidth * 2;
    }

    const differenceIn = getDifferenceIn(context.range);

    if (context.range === 'daily') {
      const delta = differenceIn(endAt, startAt);
      return parsedColumnWidth * (delta ? delta : 1);
    }

    const daysInStartMonth = getDaysInMonth(startAt);
    const pixelsPerDayInStartMonth = parsedColumnWidth / daysInStartMonth;

    if (isSameDay(startAt, endAt)) {
      return pixelsPerDayInStartMonth;
    }

    const innerDifferenceIn = getInnerDifferenceIn(context.range);
    const startOf = getStartOf(context.range);

    if (isSameDay(startOf(startAt), startOf(endAt))) {
      return innerDifferenceIn(endAt, startAt) * pixelsPerDayInStartMonth;
    }

    const startRangeOffset = daysInStartMonth - getDate(startAt);
    const endRangeOffset = getDate(endAt);
    const fullRangeOffset = differenceIn(startOf(endAt), startOf(startAt));
    const daysInEndMonth = getDaysInMonth(endAt);
    const pixelsPerDayInEndMonth = parsedColumnWidth / daysInEndMonth;

    return (
      (fullRangeOffset - 1) * parsedColumnWidth +
      startRangeOffset * pixelsPerDayInStartMonth +
      endRangeOffset * pixelsPerDayInEndMonth
    );
  });
};

const getOffset = (date: Date, timelineStartDate: Date, context: GanttContextProps) => {
  const cacheKey = `offset-${date.getTime()}-${timelineStartDate.getTime()}-${context.range}-${context.columnWidth}-${context.zoom}`;

  return memoizedCalculation(cacheKey, () => {
    const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;
    const differenceIn = getDifferenceIn(context.range);
    const startOf = getStartOf(context.range);
    const fullColumns = differenceIn(startOf(date), timelineStartDate);

    if (context.range === 'daily') {
      return parsedColumnWidth * fullColumns;
    }

    const partialColumns = date.getDate();
    const daysInMonth = getDaysInMonth(date);
    const pixelsPerDay = parsedColumnWidth / daysInMonth;

    return fullColumns * parsedColumnWidth + partialColumns * pixelsPerDay;
  });
};

setInterval(() => {
  dateCalculationCache.clear();
}, 60000);

const createInitialTimelineData = (today: Date) => {
  const data: TimelineData = [];
  const currentYear = today.getFullYear();

  // 只创建当前月份和下个月的数据
  const months = [today.getMonth(), (today.getMonth() + 1) % 12];
  const years = months[1] === 0 ? [currentYear, currentYear + 1] : [currentYear];

  for (const year of years) {
    data.push({
      year,
      quarters: new Array(4).fill(null).map((_, quarterIndex) => ({
        months: new Array(3).fill(null).map((_, monthIndex) => {
          const month = quarterIndex * 3 + monthIndex;
          // 只返回我们需要的月份的数据
          if (months.includes(month)) {
            return {
              days: getDaysInMonth(new Date(year, month, 1)),
            };
          }
          // 其他月份返回空数据
          return { days: 0 };
        }),
      })),
    });
  }

  return data;
};

// 计算日期在时间单位内的偏移量
const calculateInnerOffset = (
  date: Date,
  range: Range,
  columnWidth: number
) => {
  const startOf = getStartOf(range);
  const endOf = getEndOf(range);
  const differenceIn = getInnerDifferenceIn(range);
  const startOfRange = startOf(date);
  const endOfRange = endOf(date);
  const totalRangeDays = differenceIn(endOfRange, startOfRange);
  const dayOfMonth = date.getDate();

  return (dayOfMonth / totalRangeDays) * columnWidth;
};

// 创建甘特图上下文
const GanttContext = createContext<GanttContextProps>({
  zoom: 100,
  range: 'monthly',
  columnWidth: 50,
  headerHeight: 60,
  sidebarWidth: 300,
  rowHeight: 36,
  onAddItem: undefined,
  placeholderLength: 2,
  timelineData: [],
  ref: null,
});

// 甘特图内容头部组件属性
export type GanttContentHeaderProps = {
  renderHeaderItem: (index: number) => ReactNode;
  title: string;
  columns: number;
};

// 甘特图内容头部组件
export const GanttContentHeader: FC<GanttContentHeaderProps> = ({
  title,
  columns,
  renderHeaderItem,
}) => {
  const id = useId();

  return (
    <div
      className="sticky top-0 z-20 grid w-full shrink-0 bg-backdrop/90 backdrop-blur-sm"
      style={{ height: 'var(--gantt-header-height)' }}
    >
      <div>
        <div
          className="sticky inline-flex whitespace-nowrap px-3 py-2 text-muted-foreground text-xs"
          style={{
            left: 'var(--gantt-sidebar-width)',
          }}
        >
          <p>{title}</p>
        </div>
      </div>
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${columns}, var(--gantt-column-width))`,
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={`${id}-${index}`}
            className="shrink-0 border-border/50 border-b py-1 text-center text-xs"
          >
            {renderHeaderItem(index)}
          </div>
        ))}
      </div>
    </div>
  );
};

// 周视图头部组件
const WeeklyHeader: FC = () => {
  const gantt = useContext(GanttContext);

  return gantt.timelineData.map((year) =>
    year.quarters
      .flatMap((quarter) => quarter.months)
      .map((month, monthIndex) => {
        const startDate = new Date(year.year, monthIndex, 1);
        const daysInMonth = getDaysInMonth(startDate);
        const weeksInMonth = Math.ceil(daysInMonth / 7);

        return (
          <div className="relative flex flex-col" key={`${year.year}-${monthIndex}`}>
            <GanttContentHeader
              title={format(startDate, 'MMMM yyyy')}
              columns={weeksInMonth}
              renderHeaderItem={(weekIndex: number) => {
                const weekStart = addDays(startDate, weekIndex * 7);
                const weekEnd = addDays(weekStart, 6);
                return (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p>Week {weekIndex + 1}</p>
                    <p className="text-muted-foreground">
                      {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
                    </p>
                  </div>
                );
              }}
            />
            <GanttColumns columns={weeksInMonth} />
          </div>
        );
      })
  );
};

// 日视图头部组件
const DailyHeader: FC = () => {
  const gantt = useContext(GanttContext);

  return gantt.timelineData.map((year) =>
    year.quarters
      .flatMap((quarter) => quarter.months)
      .map((month, index) => (
        <div className="relative flex flex-col" key={`${year.year}-${index}`}>
          <GanttContentHeader
            title={format(new Date(year.year, index, 1), 'MMMM yyyy')}
            columns={month.days}
            renderHeaderItem={(item: number) => (
              <div className="flex items-center justify-center gap-1">
                <p>
                  {format(addDays(new Date(year.year, index, 1), item), 'd')}
                </p>
                <p className="text-muted-foreground">
                  {format(
                    addDays(new Date(year.year, index, 1), item),
                    'EEEEE'
                  )}
                </p>
              </div>
            )}
          />
          <GanttColumns
            columns={month.days}
            isColumnSecondary={(item: number) =>
              [0, 6].includes(
                addDays(new Date(year.year, index, 1), item).getDay()
              )
            }
          />
        </div>
      ))
  );
};

// 月视图头部组件
const MonthlyHeader: FC = () => {
  const gantt = useContext(GanttContext);

  return gantt.timelineData.map((year) => (
    <div className="relative flex flex-col" key={year.year}>
      <GanttContentHeader
        title={`${year.year}`}
        columns={year.quarters.flatMap((quarter) => quarter.months).length}
        renderHeaderItem={(item: number) => (
          <p key={`${year.year}-${item}`}>{format(new Date(year.year, item, 1), 'MMM')}</p>
        )}
      />
      <GanttColumns
        columns={year.quarters.flatMap((quarter) => quarter.months).length}
      />
    </div>
  ));
};

// 更新头部组件映射表
const headers: Record<Range, FC> = {
  daily: DailyHeader,
  weekly: WeeklyHeader,
  monthly: MonthlyHeader,
};

// 甘特图头部组件属性
export type GanttHeaderProps = {
  className?: string;
};

// 甘特图头部组件
export const GanttHeader: FC<GanttHeaderProps> = ({ className }) => {
  const gantt = useContext(GanttContext);
  const Header = headers[gantt.range];

  return (
    <div
      className={cn(
        '-space-x-px flex h-full w-max divide-x divide-border/50',
        className
      )}
    >
      <Header />
    </div>
  );
};

// 甘特图侧边栏项目组件属性
export type GanttSidebarItemProps = {
  feature: GanttFeature;
  onSelectItem?: (id: string) => void;
  className?: string;
};

// 甘特图侧边栏项目组件
export const GanttSidebarItem: FC<GanttSidebarItemProps> = ({
  feature,
  onSelectItem,
  className,
}) => {
  const tempEndAt =
    feature.endAt && isSameDay(feature.startAt, feature.endAt)
      ? addDays(feature.endAt, 1)
      : feature.endAt;
  const duration = tempEndAt
    ? formatDistance(feature.startAt, tempEndAt)
    : `${formatDistance(feature.startAt, new Date())} so far`;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (event.target === event.currentTarget) {
      onSelectItem?.(feature.id);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === 'Enter') {
      onSelectItem?.(feature.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      key={feature.id}
      className={cn(
        'group relative flex w-full items-center px-4 py-2 text-xs transition-colors hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1',
        className
      )}
      style={{
        height: 'var(--gantt-row-height)',
      }}
    >
      <div className='flex min-w-0 flex-1 items-center gap-3'>
        <div
          className='pointer-events-none h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-background'
          style={{
            backgroundColor: feature.status.color,
          }}
        />
        <p className='pointer-events-none truncate font-medium'>
          {feature.name}
        </p>
      </div>
      <div className='ml-1 flex items-center justify-between' style={{ width: '120px' }}>
        <span className='pointer-events-none text-right text-muted-foreground'>{duration}</span>
        <span className='pointer-events-none text-right font-medium' style={{ color: feature.status.color }}>{feature.progress.toFixed(0)}%</span>
      </div>
    </button>
  );
};

// 甘特图侧边栏头部组件
export const GanttSidebarHeader: FC = () => (
  <div
    className='sticky top-0 z-10 flex shrink-0 items-center border-border/50 border-b bg-backdrop/90 px-4 py-2 font-medium text-muted-foreground text-xs backdrop-blur-sm'
    style={{ height: 'var(--gantt-header-height)' }}
  >
    <div className="flex min-w-0 max-w-[170px] flex-1 items-center">
      <span className="truncate font-semibold text-foreground">Issues</span>
    </div>
    <div className='flex shrink-0 items-center gap-8'>
      <span className="w-[120px] text-right">Duration</span>
      <span className="w-16 text-right">Progress</span>
    </div>
  </div>
);

// 甘特图侧边栏分组组件属性
export type GanttSidebarGroupProps = {
  children: ReactNode;
  name: string;
  className?: string;
};

// 甘特图侧边栏分组组件
export const GanttSidebarGroup: FC<GanttSidebarGroupProps> = ({
  children,
  name,
  className,
}) => (
  <div className={className}>
    <p
      style={{ height: 'var(--gantt-row-height)' }}
      className="w-full truncate p-2.5 text-left font-medium text-muted-foreground text-xs"
    >
      {name}
    </p>
    <div className="divide-y divide-border/50">{children}</div>
  </div>
);

// 甘特图侧边栏组件属性
export type GanttSidebarProps = {
  children: ReactNode;
  className?: string;
};

// 甘特图侧边栏组件
export const GanttSidebar: FC<GanttSidebarProps> = ({
  children,
  className,
}) => (
  <div
    data-roadmap-ui="gantt-sidebar"
    className={cn(
      'sticky left-0 z-30 h-max min-h-full overflow-clip border-border/50 border-r bg-background/90 backdrop-blur-md',
      className
    )}
  >
    <GanttSidebarHeader />
    <div className="space-y-4">{children}</div>
  </div>
);

// 甘特图添加功能助手组件属性
export type GanttAddFeatureHelperProps = {
  top: number;
  className?: string;
};

// 甘特图添加功能助手组件
export const GanttAddFeatureHelper: FC<GanttAddFeatureHelperProps> = ({
  top,
  className,
}) => {
  const [scrollX] = useGanttScrollX();
  const gantt = useContext(GanttContext);
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>();

  // 处理点击添加功能
  const handleClick = () => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x =
      mousePosition.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const currentDate = getDateByMousePosition(gantt, x);

    gantt.onAddItem?.(currentDate);
  };

  return (
    <div
      className={cn('absolute top-0 w-full px-0.5', className)}
      style={{
        marginTop: -gantt.rowHeight / 2,
        transform: `translateY(${top}px)`,
      }}
      ref={mouseRef}
    >
      <button
        onClick={handleClick}
        type="button"
        className="flex h-full w-full items-center justify-center rounded-md border border-dashed p-2"
      >
        <PlusIcon
          size={16}
          className="pointer-events-none select-none text-muted-foreground"
        />
      </button>
    </div>
  );
};

// 甘特图列组件属性
export type GanttColumnProps = {
  index: number;
  isColumnSecondary?: (item: number) => boolean;
};

// 甘特图列组件
export const GanttColumn: FC<GanttColumnProps> = ({
  index,
  isColumnSecondary,
}) => {
  const gantt = useContext(GanttContext);
  const [dragging] = useGanttDragging();
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>();
  const [hovering, setHovering] = useState(false);
  const [windowScroll] = useWindowScroll();

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => setHovering(false);

  const top = useThrottle(
    mousePosition.y -
    (mouseRef.current?.getBoundingClientRect().y ?? 0) -
    (windowScroll.y ?? 0),
    10
  );

  return (
    <div
      className={cn(
        'group relative h-full overflow-hidden border-border/50 border-r',
        isColumnSecondary?.(index) ? 'bg-secondary' : ''
      )}
      ref={mouseRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!dragging && hovering && gantt.onAddItem ? (
        <GanttAddFeatureHelper top={top} />
      ) : null}
    </div>
  );
};

// 甘特图列组属性
export type GanttColumnsProps = {
  columns: number;
  isColumnSecondary?: (item: number) => boolean;
};

// 甘特图列组组件
export const GanttColumns: FC<GanttColumnsProps> = ({
  columns,
  isColumnSecondary,
}) => {
  const id = useId();

  return (
    <div
      className='divide grid h-full w-full border-border/50 border-t border-l'
      style={{
        gridTemplateColumns: `repeat(${columns}, var(--gantt-column-width))`,
      }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <GanttColumn
          key={`${id}-${index}`}
          index={index}
          isColumnSecondary={isColumnSecondary}
        />
      ))}
    </div>
  );
};

// 甘特图创建标记触发器组件属性
export type GanttCreateMarkerTriggerProps = {
  onCreateMarker: (date: Date) => void;
  className?: string;
};

// 甘特图创建标记触发器组件
export const GanttCreateMarkerTrigger: FC<GanttCreateMarkerTriggerProps> = ({
  onCreateMarker,
  className,
}) => {
  const gantt = useContext(GanttContext);
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>();
  const [windowScroll] = useWindowScroll();

  // 计算鼠标水平位置
  const x = useThrottle(
    mousePosition.x -
    (mouseRef.current?.getBoundingClientRect().x ?? 0) -
    (windowScroll.x ?? 0),
    10
  );

  const date = getDateByMousePosition(gantt, x);

  const handleClick = () => onCreateMarker(date);

  return (
    <div
      className={cn(
        'group pointer-events-none absolute top-0 left-0 h-full w-full select-none overflow-visible',
        className
      )}
      ref={mouseRef}
    >
      <div
        className="-ml-2 pointer-events-auto sticky top-6 z-20 flex w-4 flex-col items-center justify-center gap-1 overflow-visible opacity-0 group-hover:opacity-100"
        style={{ transform: `translateX(${x}px)` }}
      >
        <button
          type="button"
          className="z-50 inline-flex h-4 w-4 items-center justify-center rounded-full bg-card"
          onClick={handleClick}
        >
          <PlusIcon size={12} className="text-muted-foreground" />
        </button>
        <div className="whitespace-nowrap rounded-full border border-border/50 bg-background/90 px-2 py-1 text-foreground text-xs backdrop-blur-lg">
          {formatDate(date, 'MMM dd, yyyy')}
        </div>
      </div>
    </div>
  );
};

// 甘特图功能拖拽助手组件属性
export type GanttFeatureDragHelperProps = {
  featureId: GanttFeature['id'];
  direction: 'left' | 'right';
  date: Date | null;
};

// 甘特图功能拖拽助手组件
export const GanttFeatureDragHelper: FC<GanttFeatureDragHelperProps> = ({
  direction,
  featureId,
  date,
}) => {
  const [, setDragging] = useGanttDragging();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `feature-drag-helper-${featureId}`,
  });

  const isPressed = Boolean(attributes['aria-pressed']);

  // 更新拖拽状态
  useEffect(() => setDragging(isPressed), [isPressed, setDragging]);

  return (
    <div
      className={cn(
        'group -translate-y-1/2 !cursor-col-resize absolute top-1/2 z-[3] h-full w-6 rounded-md outline-none',
        direction === 'left' ? '-left-2.5' : '-right-2.5'
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div
        className={cn(
          '-translate-y-1/2 absolute top-1/2 h-[80%] w-1 rounded-sm bg-muted-foreground opacity-0 transition-all',
          direction === 'left' ? 'left-2.5' : 'right-2.5',
          direction === 'left' ? 'group-hover:left-0' : 'group-hover:right-0',
          isPressed && (direction === 'left' ? 'left-0' : 'right-0'),
          'group-hover:opacity-100',
          isPressed && 'opacity-100'
        )}
      />
      {date && (
        <div
          className={cn(
            '-translate-x-1/2 absolute top-10 hidden whitespace-nowrap rounded-lg border border-border/50 bg-background/90 px-2 py-1 text-foreground text-xs backdrop-blur-lg group-hover:block',
            isPressed && 'block'
          )}
        >
          {format(date, 'MMM dd, yyyy')}
        </div>
      )}
    </div>
  );
};

// 甘特图功能项卡片组件属性
export type GanttFeatureItemCardProps = Pick<GanttFeature, 'id'> & {
  children?: ReactNode;
  progress?: number;
  status?: GanttStatus;
};

// 甘特图功能项卡片组件
export const GanttFeatureItemCard: FC<GanttFeatureItemCardProps> = ({
  id,
  children,
  progress = 0,
  status,
}) => {
  const [, setDragging] = useGanttDragging();
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  const isPressed = Boolean(attributes['aria-pressed']);

  useEffect(() => setDragging(isPressed), [isPressed, setDragging]);

  // 计算进度条颜色
  const progressColor = status?.color ? `${status.color}33` : 'rgba(0,200,0,0.1)'; // 33 是十六进制的 20% 透明度
  const progressColorAlt = status?.color ? `${status.color}66` : 'rgba(0,200,0,0.2)'; // 66 是十六进制的 40% 透明度

  return (
    <Card className="relative h-full w-full overflow-hidden rounded-md bg-background p-2 text-xs shadow-sm">
      {/* 进度条背景 */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${progressColor},
            ${progressColor} 10px,
            ${progressColorAlt} 10px,
            ${progressColorAlt} 20px
          )`,
          width: `${progress}%`,
          opacity: 0.5,
        }}
      />
      <div
        className={cn(
          'relative flex h-full w-full items-center justify-between gap-2 text-left',
          isPressed && 'cursor-grabbing'
        )}
        {...attributes}
        {...listeners}
        ref={setNodeRef}
      >
        {children}
      </div>
    </Card>
  );
};

// 甘特图功能项组件属性
export type GanttFeatureItemProps = GanttFeature & {
  onMove?: (id: string, startDate: Date, endDate: Date | null) => void;
  children?: ReactNode;
  className?: string;
  progress?: number;
  status?: GanttStatus;
  level?: number;
};

// 甘特图功能项组件
export const GanttFeatureItem: FC<GanttFeatureItemProps> = ({
  onMove,
  children,
  className,
  progress = 0,
  status,
  level = 0,
  ...feature
}) => {
  const [scrollX] = useGanttScrollX();
  const gantt = useContext(GanttContext);
  const timelineStartDate = new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1);
  const [startAt, setStartAt] = useState<Date>(feature.startAt);
  const [endAt, setEndAt] = useState<Date | null>(feature.endAt);
  const width = useMemo(() => getWidth(startAt, endAt, gantt), [startAt, endAt, gantt]);
  const offset = useMemo(() => getOffset(startAt, timelineStartDate, gantt), [startAt, timelineStartDate, gantt]);
  const addRange = getAddRange(gantt.range);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mousePosition] = useMouse<HTMLDivElement>();
  const stableId = useId();

  // 计算缩进距离
  const indentation = level * 20; // 每层缩进20px

  // Update mouseRef when mousePosition changes
  useEffect(() => {
    mouseRef.current = mousePosition;
  }, [mousePosition]);

  // 记录拖拽开始时的状态
  const dragStateRef = useRef({
    previousMouseX: 0,
    previousStartAt: startAt,
    previousEndAt: endAt
  });

  // 配置鼠标传感器，增加激活距离以减少误触发
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  // 处理整体拖拽开始
  const handleItemDragStart = useCallback(() => {
    dragStateRef.current = {
      previousMouseX: mouseRef.current.x,
      previousStartAt: startAt,
      previousEndAt: endAt
    };
  }, [startAt, endAt]);

  // 使用防抖处理拖拽移动
  const handleItemDragMove = useCallback(() => {
    const currentDate = getDateByMousePosition(gantt, mouseRef.current.x);
    const originalDate = getDateByMousePosition(gantt, dragStateRef.current.previousMouseX);
    const delta =
      gantt.range === 'daily'
        ? getDifferenceIn(gantt.range)(currentDate, originalDate)
        : getInnerDifferenceIn(gantt.range)(currentDate, originalDate);
    const newStartDate = addDays(dragStateRef.current.previousStartAt, delta);
    const newEndDate = dragStateRef.current.previousEndAt ? addDays(dragStateRef.current.previousEndAt, delta) : null;

    setStartAt(newStartDate);
    setEndAt(newEndDate);
  }, [gantt]);

  // 使用防抖处理左侧拖拽
  const handleLeftDragMove = useCallback(() => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x =
      mouseRef.current.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const newStartAt = getDateByMousePosition(gantt, x);
    setStartAt(newStartAt);
  }, [gantt, scrollX]);

  // 使用防抖处理右侧拖拽
  const handleRightDragMove = useCallback(() => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x =
      mouseRef.current.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const newEndAt = getDateByMousePosition(gantt, x);
    setEndAt(newEndAt);
  }, [gantt, scrollX]);

  // 处理拖拽结束
  const onDragEnd = useCallback(() => {
    onMove?.(feature.id, startAt, endAt);
  }, [feature.id, startAt, endAt, onMove]);

  return (
    <div
      className={cn('relative flex w-max min-w-full py-0.5', className)}
      style={{
        height: 'var(--gantt-row-height)',
        marginLeft: `${indentation}px`
      }}
    >
      <div
        className="pointer-events-auto absolute top-0.5"
        style={{
          height: 'calc(var(--gantt-row-height) - 4px)',
          width: Math.round(width),
          left: Math.round(offset),
          willChange: 'transform, width'
        }}
      >
        {onMove && (
          <DndContext
            id={`${stableId}-left`}
            sensors={[mouseSensor]}
            modifiers={[restrictToHorizontalAxis]}
            onDragMove={handleLeftDragMove}
            onDragEnd={onDragEnd}
          >
            <GanttFeatureDragHelper
              direction="left"
              featureId={feature.id}
              date={startAt}
            />
          </DndContext>
        )}
        <DndContext
          id={`${stableId}-main`}
          sensors={[mouseSensor]}
          modifiers={[restrictToHorizontalAxis]}
          onDragStart={handleItemDragStart}
          onDragMove={handleItemDragMove}
          onDragEnd={onDragEnd}
        >
          <GanttFeatureItemCard
            id={feature.id}
            progress={progress}
            status={status}
          >
            {children ?? (
              <p className="flex-1 truncate text-xs">{feature.name}</p>
            )}
          </GanttFeatureItemCard>
        </DndContext>
        {onMove && (
          <DndContext
            id={`${stableId}-right`}
            sensors={[mouseSensor]}
            modifiers={[restrictToHorizontalAxis]}
            onDragMove={handleRightDragMove}
            onDragEnd={onDragEnd}
          >
            <GanttFeatureDragHelper
              direction="right"
              featureId={feature.id}
              date={endAt ?? addRange(startAt, 2)}
            />
          </DndContext>
        )}
      </div>
    </div>
  );
};

// 甘特图功能列表分组组件属性
export type GanttFeatureListGroupProps = {
  children: ReactNode;
  className?: string;
};

// 甘特图功能列表分组组件
export const GanttFeatureListGroup: FC<GanttFeatureListGroupProps> = ({
  children,
  className,
}) => (
  <div className={className} style={{ paddingTop: 'var(--gantt-row-height)' }}>
    {children}
  </div>
);

// 甘特图功能列表组件属性
export type GanttFeatureListProps = {
  className?: string;
  children: ReactNode;
};

// 甘特图功能列表组件
export const GanttFeatureList: FC<GanttFeatureListProps> = ({
  className,
  children,
}) => (
  <div
    className={cn('absolute top-0 left-0 h-full w-max space-y-4', className)}
    style={{ marginTop: 'var(--gantt-header-height)' }}
  >
    {children}
  </div>
);

// 甘特图标记组件
export const GanttMarker: FC<
  GanttMarkerProps & {
    onRemove?: (id: string) => void;
    className?: string;
  }
> = ({ label, date, id, onRemove, className }) => {
  const gantt = useContext(GanttContext);
  const differenceIn = getDifferenceIn(gantt.range);
  const timelineStartDate = new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1);

  // 计算标记位置
  const offset = differenceIn(date, timelineStartDate);
  const innerOffset = calculateInnerOffset(
    date,
    gantt.range,
    (gantt.columnWidth * gantt.zoom) / 100
  );

  const handleRemove = () => onRemove?.(id);

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible"
      style={{
        width: 0,
        transform: `translateX(calc(var(--gantt-column-width) * ${offset} + ${innerOffset}px))`,
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              'group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-card px-2 py-1 text-foreground text-xs',
              className
            )}
          >
            {label}
            <span className="max-h-[0] overflow-hidden opacity-80 transition-all group-hover:max-h-[2rem]">
              {formatDate(date, 'MMM dd, yyyy')}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {onRemove ? (
            <ContextMenuItem
              className="flex items-center gap-2 text-destructive"
              onClick={handleRemove}
            >
              <TrashIcon size={16} />
              Remove marker
            </ContextMenuItem>
          ) : null}
        </ContextMenuContent>
      </ContextMenu>
      <div className={cn('h-full w-px bg-card', className)} />
    </div>
  );
};


export type GanttProviderProps = {
  range?: Range;
  zoom?: number;
  onAddItem?: (date: Date) => void;
  children: ReactNode;
  className?: string;
};

export const GanttProvider: FC<GanttProviderProps> = ({
  zoom = 100,
  range = 'monthly',
  onAddItem,
  children,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [timelineData, setTimelineData] = useState<TimelineData>(
    createInitialTimelineData(new Date())
  );
  const [, setScrollX] = useGanttScrollX();
  const sidebarElement = scrollRef.current?.querySelector(
    '[data-roadmap-ui="gantt-sidebar"]'
  );

  const headerHeight = 60;
  const sidebarWidth = sidebarElement ? 300 : 0;
  const rowHeight = 36;
  let columnWidth = 50;

  switch (range) {
    case 'daily':
      columnWidth = 50;
      break;
    case 'weekly':
      columnWidth = 120;
      break;
    case 'monthly':
      columnWidth = 150;
      break;
  }

  const cssVariables = {
    '--gantt-zoom': `${zoom}`,
    '--gantt-column-width': `${(zoom / 100) * columnWidth}px`,
    '--gantt-header-height': `${headerHeight}px`,
    '--gantt-row-height': `${rowHeight}px`,
    '--gantt-sidebar-width': `${sidebarWidth}px`,
  } as CSSProperties;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Re-render when props change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft =
        scrollRef.current.scrollWidth / 2 - scrollRef.current.clientWidth / 2;
      setScrollX(scrollRef.current.scrollLeft);
    }
  }, [range, zoom, setScrollX]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: "Throttled"
  const handleScroll = useCallback(
    throttle(() => {
      if (!scrollRef.current) {
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setScrollX(scrollLeft);

      if (scrollLeft === 0) {
        // Extend timelineData to the past
        const firstYear = timelineData[0]?.year;

        if (!firstYear) {
          return;
        }

        const newTimelineData: TimelineData = [...timelineData];
        newTimelineData.unshift({
          year: firstYear - 1,
          quarters: new Array(4).fill(null).map((_, quarterIndex) => ({
            months: new Array(3).fill(null).map((_, monthIndex) => {
              const month = quarterIndex * 3 + monthIndex;
              return {
                days: getDaysInMonth(new Date(firstYear, month, 1)),
              };
            }),
          })),
        });

        setTimelineData(newTimelineData);

        // Scroll a bit forward so it's not at the very start
        scrollRef.current.scrollLeft = scrollRef.current.clientWidth;
        setScrollX(scrollRef.current.scrollLeft);
      } else if (scrollLeft + clientWidth >= scrollWidth) {
        // Extend timelineData to the future
        const lastYear = timelineData.at(-1)?.year;

        if (!lastYear) {
          return;
        }

        const newTimelineData: TimelineData = [...timelineData];
        newTimelineData.push({
          year: lastYear + 1,
          quarters: new Array(4).fill(null).map((_, quarterIndex) => ({
            months: new Array(3).fill(null).map((_, monthIndex) => {
              const month = quarterIndex * 3 + monthIndex;
              return {
                days: getDaysInMonth(new Date(lastYear, month, 1)),
              };
            }),
          })),
        });

        setTimelineData(newTimelineData);

        // Scroll a bit back so it's not at the very end
        scrollRef.current.scrollLeft =
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        setScrollX(scrollRef.current.scrollLeft);
      }
    }, 100),
    [timelineData, setScrollX]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <GanttContext.Provider
      value={{
        zoom,
        range,
        headerHeight,
        columnWidth,
        sidebarWidth,
        rowHeight,
        onAddItem,
        timelineData,
        placeholderLength: 2,
        ref: scrollRef,
      }}
    >
      <div
        className={cn(
          'gantt relative grid h-full w-full flex-none select-none overflow-auto rounded-sm bg-secondary',
          range,
          className
        )}
        style={{
          ...cssVariables,
          gridTemplateColumns: 'var(--gantt-sidebar-width) 1fr',
        }}
        ref={scrollRef}
      >
        {children}
      </div>
    </GanttContext.Provider>
  );
};

// 甘特图时间线组件属性
export type GanttTimelineProps = {
  children: ReactNode;
  className?: string;
};

// 甘特图时间线组件
export const GanttTimeline: FC<GanttTimelineProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'relative flex h-full w-max flex-none overflow-clip',
      className
    )}
  >
    {children}
  </div>
);

// 甘特图今日标记组件属性
export type GanttTodayProps = {
  className?: string;
};

// 甘特图今日标记组件
export const GanttToday: FC<GanttTodayProps> = ({ className }) => {
  const label = 'Today';
  const date = new Date();
  const gantt = useContext(GanttContext);
  const differenceIn = getDifferenceIn(gantt.range);
  const timelineStartDate = new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1);

  // 计算今日标记位置
  const offset = differenceIn(date, timelineStartDate);
  const innerOffset = calculateInnerOffset(
    date,
    gantt.range,
    (gantt.columnWidth * gantt.zoom) / 100
  );

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible"
      style={{
        width: 0,
        transform: `translateX(calc(var(--gantt-column-width) * ${offset} + ${innerOffset}px))`,
      }}
    >
      <div
        className={cn(
          'group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-card px-2 py-1 text-foreground text-xs',
          className
        )}
      >
        {label}
        <span className="max-h-[0] overflow-hidden opacity-80 transition-all group-hover:max-h-[2rem]">
          {formatDate(date, 'MMM dd, yyyy')}
        </span>
      </div>
      <div className={cn('h-full w-px bg-card', className)} />
    </div>
  );
};
