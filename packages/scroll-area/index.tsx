import { cn } from '@/lib/utils';

import { forwardRef, useCallback, useMemo, useState } from 'react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ScrollAreaProps {
    children?: React.ReactNode;
    className?: string;
    horizontal?: boolean;
    onScrollAt?: (positions: {
        bottom: boolean;
        left: boolean;
        right: boolean;
        top: boolean;
    }) => void;
    scrollBarClass?: string;
    shadow?: boolean;
    shadowBorder?: boolean;
    shadowBottom?: boolean;
    shadowLeft?: boolean;
    shadowRight?: boolean;
    shadowTop?: boolean;
    style?: React.CSSProperties;
}

export const XpressScrollbar = forwardRef<HTMLDivElement, ScrollAreaProps>(
    (
        {
            className = '',
            horizontal = false,
            onScrollAt,
            scrollBarClass,
            shadow = false,
            shadowBorder = false,
            shadowBottom = true,
            shadowLeft = false,
            shadowRight = false,
            shadowTop = true,
            children,
            ...props
        },
        ref,
    ) => {
        const [isAtTop, setIsAtTop] = useState(true);
        const [isAtRight, setIsAtRight] = useState(false);
        const [isAtBottom, setIsAtBottom] = useState(false);
        const [isAtLeft, setIsAtLeft] = useState(true);

        const showShadowTop = shadow && shadowTop;
        const showShadowBottom = shadow && shadowBottom;
        const showShadowLeft = shadow && shadowLeft;
        const showShadowRight = shadow && shadowRight;

        const computedShadowClasses = useMemo(() => {
            const classes = {
                'both-shadow':
                    !isAtLeft && !isAtRight && showShadowLeft && showShadowRight,
                'left-shadow': !isAtLeft && showShadowLeft,
                'right-shadow': !isAtRight && showShadowRight,
            };

            return Object.entries(classes)
                .filter(([, value]) => value)
                .map(([key]) => {
                    switch (key) {
                        case 'both-shadow':
                            return '[mask-image:var(--scroll-shadow-both)]';
                        case 'left-shadow':
                            return '[mask-image:var(--scroll-shadow-left)]';
                        case 'right-shadow':
                            return '[mask-image:var(--scroll-shadow-right)]';
                        default:
                            return '';
                    }
                })
                .join(' ');
        }, [isAtLeft, isAtRight, showShadowLeft, showShadowRight]);

        const handleScroll = useCallback(
            (event: React.UIEvent<HTMLDivElement>) => {
                const target = event.target as HTMLElement;
                const scrollTop = target?.scrollTop ?? 0;
                const scrollLeft = target?.scrollLeft ?? 0;
                const offsetHeight = target?.offsetHeight ?? 0;
                const offsetWidth = target?.offsetWidth ?? 0;
                const scrollHeight = target?.scrollHeight ?? 0;
                const scrollWidth = target?.scrollWidth ?? 0;

                setIsAtTop(scrollTop <= 0);
                setIsAtLeft(scrollLeft <= 0);
                setIsAtBottom(scrollTop + offsetHeight >= scrollHeight);
                setIsAtRight(Math.ceil(scrollLeft + offsetWidth) >= scrollWidth);

                onScrollAt?.({
                    bottom: scrollTop + offsetHeight >= scrollHeight,
                    left: scrollLeft <= 0,
                    right: Math.ceil(scrollLeft + offsetWidth) >= scrollWidth,
                    top: scrollTop <= 0,
                });
            },
            [onScrollAt],
        );

        return (
            <ScrollArea
                className={cn(
                    'relative',
                    className,
                    computedShadowClasses,
                )}
                onScroll={handleScroll}
                ref={ref}
                {...props}
            >
                {showShadowTop && (
                    <div
                        className={cn(
                            '[background:var(--scroll-shadow-top)]',
                            'pointer-events-none absolute top-0 z-10 h-12 w-full opacity-0 transition-opacity duration-300 ease-in-out will-change-[opacity]',
                            {
                                'border-border border-t': shadowBorder && !isAtTop,
                                'opacity-100': !isAtTop,
                            },
                        )}
                    />
                )}
                {children}
                {showShadowBottom && (
                    <div
                        className={cn(
                            '[background:var(--scroll-shadow-bottom)]',
                            'pointer-events-none absolute bottom-0 z-10 h-12 w-full opacity-0 transition-opacity duration-300 ease-in-out will-change-[opacity]',
                            {
                                'border-border border-b':
                                    shadowBorder && !isAtTop && !isAtBottom,
                                'opacity-100': !isAtTop && !isAtBottom,
                            },
                        )}
                    />
                )}
                {horizontal && (
                    <ScrollBar className={scrollBarClass} orientation="horizontal" />
                )}
            </ScrollArea>
        );
    },
);

XpressScrollbar.displayName = 'XpressScrollbar';
