import { Button as XpressButton } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogContext,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Expand, Shrink } from '@repo/icons';
import { XpressLoading } from '@repo/loading';
import { XpressHelpTooltip } from '@repo/tooltip';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { cn } from "@/lib/utils";

function useModalDraggable(
  targetRef: React.RefObject<HTMLElement>,
  dragRef: React.RefObject<HTMLElement>,
  draggable: boolean
) {
  // 使用ref存储最新位置
  const positionRef = useRef({ x: 0, y: 0 });
  // 是否已经拖拽过
  const hasDraggedRef = useRef(false);

  // 只有拖拽过后才应用保存的位置
  useEffect(() => {
    if (targetRef.current && draggable && hasDraggedRef.current) {
      targetRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    }
  }, [targetRef, draggable]);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!targetRef.current) return;

      // 阻止事件冒泡和默认行为
      e.stopPropagation();
      // e.preventDefault();

      // 记录初始鼠标位置
      const startX = e.clientX;
      const startY = e.clientY;

      // 获取当前transform值
      const computedStyle = window.getComputedStyle(targetRef.current);
      const transform = computedStyle.transform || '';

      // 提取当前translate值
      let translateX = 0;
      let translateY = 0;

      if (transform !== 'none' && transform !== '') {
        // 提取transform矩阵值
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        const values = matrix?.[1]?.split(', ') ?? [];
        if (values.length >= 6) {
          translateX = Number.parseFloat(values[4] ?? '0') || 0;
          translateY = Number.parseFloat(values[5] ?? '0') || 0;
        }
      }

      let hasMoved = false;

      const handleMouseMove = (e: MouseEvent) => {
        if (!targetRef.current) return;

        // 计算移动距离
        const moveX = e.clientX - startX;
        const moveY = e.clientY - startY;

        // 新位置 = 当前translate值 + 移动距离
        const newX = translateX + moveX;
        const newY = translateY + moveY;

        // 标记已经移动过
        if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
          hasMoved = true;
        }

        // 更新位置引用
        positionRef.current = { x: newX, y: newY };

        // 应用变换
        targetRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        targetRef.current.style.transition = 'none';
      };

      const handleMouseUp = () => {
        if (targetRef.current) {
          targetRef.current.style.transition = 'transform 0.2s ease-out';
        }

        // 只有在实际移动后才标记为已拖拽
        if (hasMoved) {
          hasDraggedRef.current = true;
        }

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [targetRef]
  );

  // 重置位置
  const resetPosition = useCallback(() => {
    positionRef.current = { x: 0, y: 0 };
    hasDraggedRef.current = false;
    if (targetRef.current) {
      targetRef.current.style.transform = '';
    }
  }, [targetRef]);

  // 添加拖拽事件
  const addDraggableEvents = useCallback(() => {
    if (dragRef.current && targetRef.current) {
      dragRef.current.addEventListener('mousedown', handleMouseDown);
    }
  }, [dragRef, targetRef, handleMouseDown]);

  // 移除拖拽事件
  const removeDraggableEvents = useCallback(() => {
    if (dragRef.current && targetRef.current) {
      dragRef.current.removeEventListener('mousedown', handleMouseDown);
    }
  }, [dragRef, targetRef, handleMouseDown]);

  // 响应draggable属性变化
  useEffect(() => {
    if (draggable) {
      addDraggableEvents();
    } else {
      removeDraggableEvents();
    }

    return () => {
      removeDraggableEvents();
    };
  }, [draggable, addDraggableEvents, removeDraggableEvents]);

  return {
    getCurrentPosition: () => positionRef.current,
    hasDragged: () => hasDraggedRef.current,
    resetPosition,
  };
}

interface ModalProps {
  appendFooter?: React.ReactNode;
  appendToMain?: boolean;
  appendToId?: string;
  bordered?: boolean;
  cancelText?: string;
  centered?: boolean;
  children?: React.ReactNode;
  closeClass?: string;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  confirmLoading?: boolean;
  confirmText?: string;
  contentClass?: string;
  customFooter?: React.ReactNode;
  customTitle?: React.ReactNode;
  description?: string;
  draggable?: boolean;
  footerClass?: string;
  headerClass?: string;
  isOpen: boolean;
  modal?: boolean;
  modalClass?: string;
  onModalBeforeClose?: () => void;
  onModalCancel?: () => void;
  onModalClosed?: () => void;
  onModalConfirm?: () => void;
  onModalOpened?: () => void;
  openAutoFocus?: boolean;
  overlayBlur?: number;
  prependFooter?: React.ReactNode;
  setIsOpen: (open: boolean) => void;
  showCancelButton?: boolean;
  showClose?: boolean;
  showConfirmButton?: boolean;
  showFullScreenButton?: boolean;
  showHeader?: boolean;
  showLoading?: boolean;
  title?: string;
  titleTooltip?: string;
  zIndex?: number;
}
export const Modal = ({
  appendToMain = false,
  bordered = true,
  cancelText,
  centered,
  closeOnPressEscape = true,
  confirmLoading,
  confirmText,
  customFooter = false,
  draggable,
  isOpen,
  modal,
  modalClass,
  onModalBeforeClose,
  onModalCancel,
  onModalClosed,
  onModalConfirm,
  onModalOpened,
  overlayBlur,
  setIsOpen,
  showCancelButton = true,
  showConfirmButton = true,
  showHeader = true,
  zIndex,
  children,
  appendToId,
  ...props
}: ModalProps) => {
  const id = useId();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleClose = () => {
    const allowClose = onModalBeforeClose ? onModalBeforeClose() : true;
    if (allowClose) {
      setIsOpen(false);
    }
  };
  const getAppendTo = useMemo(() => {
    return appendToMain ? `#${appendToId}` : undefined;
  }, [appendToMain, appendToId]);


  const shouldFullscreen = useMemo(() => {
    return isFullscreen && showHeader;
  }, [isFullscreen, showHeader]);

  const shouldDraggable = useMemo(() => {
    return draggable && !shouldFullscreen && showHeader;
  }, [draggable, shouldFullscreen, showHeader]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [modalRendered, setModalRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 等待下一帧，确保 Modal 已经渲染到 DOM
      requestAnimationFrame(() => {
        if (dialogRef.current) {
          setModalRendered(true);
        }
      });
    } else {
      setModalRendered(false);
    }
  }, [isOpen]);
  useModalDraggable(
    (modalRendered ? dialogRef : { current: null }) as unknown as React.RefObject<HTMLElement>,
    (modalRendered ? headerRef : { current: null }) as unknown as React.RefObject<HTMLElement>,
    shouldDraggable ?? false,
  );

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const handerOpenAutoFocus = (e: Event) => {
    if (!props.openAutoFocus) {
      e.preventDefault();
    }
  };
  const onClosed = () => {
    if (!isOpen) {
      onModalClosed?.();
    }
  };
  const onEscapeKeyDown = (e: KeyboardEvent) => {
    if (closeOnPressEscape) {
      handleClose();
    } else {
      e.preventDefault();
    }
  };
  const onInteractOutside = (e: Event) => {
    if (!props.closeOnClickModal) {
      e.preventDefault();
    }
  };
  const onOpened = () => {
    if (isOpen) {
      onModalOpened?.();
    }
  };

  const onPointerDownOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!props.closeOnClickModal && target?.dataset.dismissableModal !== id) {
      e.preventDefault();
    }
  };
  const wrapperRef = useRef<HTMLDivElement>(null);

  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.showLoading && wrapperRef.current) {
      wrapperRef.current.scrollTo({
        top: 0,
      });
    }
  }, [props.showLoading]);
  const DefaultFooter = () => {
    return (
      <>
        {showCancelButton && (
          <XpressButton onClick={onModalCancel} variant="ghost">
            {cancelText || '取消'}
          </XpressButton>
        )}
        {showConfirmButton && (
          <XpressButton isLoading={confirmLoading} onClick={onModalConfirm}>
            {confirmText || '确定'}
          </XpressButton>
        )}
      </>
    );
  };
  return (
    <DialogContext.Provider value={{ id }}>
      <Dialog modal={modal} open={isOpen}>
        <DialogContent
          className={cn('sm:rounded-[var(--radius)]', modalClass, {
            'border border-border': bordered,
            '!max-w-full fixed inset-0 h-full translate-x-0 translate-y-0 gap-0 rounded-none':
              shouldFullscreen,
            'shadow-3xl': !bordered,
            '!-translate-y-1/2 top-1/2': centered && !shouldFullscreen,
          })}
          closeClass={props.closeClass}
          container={
            getAppendTo
              ? ((document.querySelector(getAppendTo) || undefined) as
                | HTMLElement
                | undefined)
              : undefined
          }
          modal={modal}
          onClose={handleClose}
          onCloseAutoFocus={(e: Event) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClosed={onClosed}
          onEscapeKeyDown={onEscapeKeyDown}
          onFocusOutside={(e: Event) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onInteractOutside={onInteractOutside}
          onOpenAutoFocus={handerOpenAutoFocus}
          onOpened={onOpened}
          onPointerDownOutside={onPointerDownOutside}
          open={isOpen}
          overlayBlur={overlayBlur}
          ref={dialogRef}
          showClose={props.showClose}
          zIndex={zIndex}
        >
          <DialogHeader
            className={cn(
              'px-5 py-2',
              {
                'border-b': bordered,
                'cursor-move select-none': shouldDraggable,
                hidden: !showHeader,
              },
              props.headerClass,
            )}
            data-draggable={shouldDraggable}
            ref={headerRef}
          >
            <DialogTitle className="text-left">
              {props.customTitle || (
                <>
                  {props.title}
                  {props.titleTooltip && (
                    <XpressHelpTooltip trigger-class="pb-1">
                      {props.titleTooltip}
                    </XpressHelpTooltip>
                  )}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {props.description && (
            <DialogDescription className='mt-1 ml-1 text-xs'>
              {props.description}
            </DialogDescription>
          )}
          {(!props.title || !props.description) && (
            <VisuallyHidden>
              {!props.title && <DialogTitle />}
              {!props.description && <DialogDescription />}
            </VisuallyHidden>
          )}
          <div
            className={cn(
              'relative min-h-40 flex-1 overflow-y-auto p-3',
              props.contentClass,
              {
                'h-[calc(100vh-8rem)]': shouldFullscreen,
                'overflow-hidden': props.showLoading,
              },
            )}
            ref={wrapperRef}
          >
            {props.showLoading && (
              <XpressLoading className="size-full h-auto min-h-full" spinning />
            )}
            {children}
          </div>
          {props.showFullScreenButton && (
            <button
              type="button"
              className='absolute top-3 right-10 hidden size-6 flex-center rounded-full px-1 text-foreground/80 text-lg opacity-70 transition-opacity hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus:outline-none disabled:pointer-events-none sm:block'
              onClick={handleFullscreen}
            >
              {isFullscreen ? (
                <Shrink className="size-3.5" />
              ) : (
                <Expand className="size-3.5" />
              )}
            </button>
          )}

          <DialogFooter
            className={cn(
              'box-border flex-row items-center justify-end p-2',
              {
                'border-t': bordered,
              },
              props.footerClass,
              {
                'hidden': !showConfirmButton && !showCancelButton
              }
            )}
            ref={footerRef}
          >
            {props.prependFooter}
            {customFooter || <DefaultFooter />}
            {props.appendFooter}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

Modal.displayName = 'Modal';
