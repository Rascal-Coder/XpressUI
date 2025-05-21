'use client';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { Props } from './types';

import { Separator } from "@/components/ui/separator"
import {
  DrawerContext,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from "@/lib/utils"
import { Button as XpressButton } from "@repo/button"
import { useIsMobile, useScrollLock } from '@repo/hooks';
import { X } from '@repo/icons';
import { XpressLoading } from '@repo/loading';
import { XpressHelpTooltip } from "@repo/tooltip"
import { forwardRef, useEffect, useId, useMemo, useRef } from 'react';

export const Drawer = forwardRef<HTMLDivElement, Props>(
  (
    {
      appendFooter,
      appendToMain = true,
      cancelText,
      className,
      closable = true,
      closeIcon,
      closeIconPlacement = 'right',
      closeOnClickModal = true,
      closeOnPressEscape = true,
      confirmLoading,
      confirmText,
      contentClass,
      customTitle,
      description,
      extra,
      footer,
      footerClass,
      headerClass,
      isOpen,
      modal = true,
      onDrawerBeforeClose,
      onDrawerCancel,
      onDrawerClosed,
      onDrawerConfirm,
      onDrawerOpened,
      overlayBlur = 1,
      placement = 'right',
      prependFooter,
      setIsOpen,
      showCancelButton = true,
      showConfirmButton = true,
      showFooter = true,
      showHeader = true,
      showLoading,
      title,
      titleTooltip,
      zIndex = 2000,
      children,
      appendId
    },
    ref,
  ) => {
    const { isMobile } = useIsMobile();
    const { lock, unlock } = useScrollLock(typeof document !== 'undefined' ? document.body : null);
    const id = useId();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const onOpenChange = (open: boolean) => {
      if (open) {
        setIsOpen(true);
      } else {
        const allowClose = onDrawerBeforeClose ? onDrawerBeforeClose() : true;
        if (allowClose) {
          setIsOpen(false);
        }
      }
    };
    const handleFocusOutside = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onClosed = () => {
      if (!isOpen) {
        onDrawerClosed?.();
      }
    };

    const onEscapeKeyDown = (e: KeyboardEvent) => {
      if (!closeOnPressEscape) {
        e.preventDefault();
      }
    };
    const onInteractOutside = (e: Event) => {
      if (!closeOnClickModal) {
        e.preventDefault();
      }
    };
    const onOpenAutoFocus = (e: Event) => {
      if (!closeOnPressEscape) {
        e.preventDefault();
      }
    };
    const onOpened = () => {
      if (isOpen) {
        onDrawerOpened?.();
      }
    };

    const onPointerDownOutside = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!closeOnClickModal && target?.dataset.dismissableDrawer !== id) {
        e.preventDefault();
      }
    };
    const getAppendTo = useMemo(() => {
      return appendToMain && appendId ? `#${appendId}` : undefined;
    }, [appendToMain, appendId]);
    const DefaultFooter = () => {
      return (
        <>
          {showCancelButton && (
            <XpressButton onClick={onDrawerCancel} variant="ghost">
              {cancelText || '取消'}
            </XpressButton>
          )}
          {showConfirmButton && (
            <XpressButton isLoading={confirmLoading} onClick={onDrawerConfirm}>
              {confirmText || '确定'}
            </XpressButton>
          )}
        </>
      );
    };
    useEffect(() => {
      if (showLoading && wrapperRef.current) {
        wrapperRef.current.scrollTo({
          top: 0,
        });
      }
    }, [showLoading]);
    useEffect(() => {
      if (isOpen) {
        lock();
      } else {
        unlock();
      }
    }, [isOpen, lock, unlock]);
    return (
      <DrawerContext.Provider value={{ id }}>
        <Sheet modal={false} onOpenChange={onOpenChange} open={isOpen}>
          <SheetContent
            className={cn('flex w-[520px] flex-col', className, {
              '!w-full':
                isMobile || placement === 'bottom' || placement === 'top',
              'max-h-[100vh]': placement === 'bottom' || placement === 'top',
            })}
            container={
              getAppendTo
                ? ((document.querySelector(getAppendTo) || undefined) as
                  | HTMLElement
                  | undefined)
                : undefined
            }
            modal={modal}
            onCloseAutoFocus={handleFocusOutside}
            onClosed={onClosed}
            onEscapeKeyDown={onEscapeKeyDown}
            onFocusOutside={handleFocusOutside}
            onInteractOutside={onInteractOutside}
            onOpenAutoFocus={onOpenAutoFocus}
            onOpened={onOpened}
            onPointerDownOutside={onPointerDownOutside}
            open={isOpen}
            overlayBlur={overlayBlur}
            ref={ref}
            side={placement}
            zIndex={zIndex}
          >
            {showHeader ? (
              <SheetHeader
                className={cn(
                  '!flex flex-row items-center justify-between border-b px-6 py-5',
                  headerClass,
                  {
                    'pl-2': closable && closeIconPlacement === 'left',
                    'px-4 py-3': closable,
                  },
                )}
              >
                <div className="flex items-center">
                  {closable && closeIconPlacement === 'left' && (
                    <>
                      <SheetClose
                        asChild
                        className='ml-[2px] cursor-pointer rounded-full opacity-80 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary'
                      >
                        {closeIcon || (
                          <X className="size-4" />
                        )}
                      </SheetClose>
                      <Separator
                        className='mr-2 ml-1 h-8'
                        decorative
                        orientation="vertical"
                      />
                    </>
                  )}
                  {title && (
                    <SheetTitle className="text-left">
                      {customTitle || (
                        <>
                          {title}
                          {titleTooltip && (
                            <XpressHelpTooltip trigger-class="pb-1">
                              {titleTooltip}
                            </XpressHelpTooltip>
                          )}
                        </>
                      )}
                    </SheetTitle>
                  )}
                  {description && (
                    <SheetDescription className='mt-1 ml-1 text-xs'>
                      {description}
                    </SheetDescription>
                  )}
                  {(!title || !description) && (
                    <VisuallyHidden>
                      {!title && <SheetTitle />}
                      {!description && <SheetDescription />}
                    </VisuallyHidden>
                  )}
                </div>
                <div className="flex-center">
                  {extra}
                  {closable && closeIconPlacement === 'right' && (
                    <SheetClose
                      asChild
                      className='ml-[2px] cursor-pointer rounded-full opacity-80 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary'
                    >
                      {closeIcon || (
                        <X className="size-4" />
                      )}
                    </SheetClose>
                  )}
                </div>
              </SheetHeader>
            ) : (
              <VisuallyHidden>
                <SheetTitle />
                <SheetDescription />
              </VisuallyHidden>
            )}
            <div
              className={cn(
                'relative flex-1 overflow-y-auto p-3',
                contentClass,
                {
                  'overflow-hidden': showLoading,
                },
              )}
              ref={wrapperRef}
            >
              {showLoading && <XpressLoading className="size-full" spinning />}
              {children}
            </div>
            {showFooter && (
              <SheetFooter
                className={cn(
                  'w-full flex-row items-center justify-end border-t p-2 px-3',
                  footerClass,
                )}
              >
                {prependFooter}
                {footer || <DefaultFooter />}
                {appendFooter}
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      </DrawerContext.Provider>
    );
  },
);

Drawer.displayName = 'Drawer';
