import type { VariantProps } from 'tailwind-variants';

import { cn } from "@repo/shadcn-ui/lib/utils"

import { LoaderCircle } from '@repo/icons';
import type * as React from 'react';
import { useMemo } from 'react';
import { tv } from 'tailwind-variants';

const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center font-medium transition-all-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  compoundVariants: [
    {
      buttonColor: 'destructive',
      class: `bg-destructive text-destructive-foreground hover:bg-destructive/80 active:bg-destructive-active`,
      variant: 'solid',
    },
    {
      buttonColor: 'success',
      class: `bg-success text-success-foreground hover:bg-success/80 active:bg-success-600`,
      variant: 'solid',
    },
    {
      buttonColor: 'warning',
      class: `bg-warning text-warning-foreground hover:bg-warning/80 active:bg-warning-600`,
      variant: 'solid',
    },
    {
      buttonColor: 'info',
      class: `bg-info text-info-foreground hover:bg-info/80 active:bg-info-600`,
      variant: 'solid',
    },
    {
      buttonColor: 'carbon',
      class: `bg-carbon text-carbon-foreground hover:bg-carbon/80 active:bg-carbon-600`,
      variant: 'solid',
    },
    {
      buttonColor: 'secondary',
      class: `bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary-foreground/20`,
      variant: 'solid',
    },
    {
      buttonColor: 'accent',
      class: `bg-accent text-accent-foreground hover:bg-accent/80 active:bg-accent-foreground/20`,
      variant: 'solid',
    },
    {
      buttonColor: 'primary',
      class: 'text-primary',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
    },
    {
      buttonColor: 'destructive',
      class: 'text-destructive',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
    },
    {
      buttonColor: 'success',
      class: 'text-success',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
    },
    {
      buttonColor: 'warning',
      class: 'text-warning',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
    },
    {
      buttonColor: 'info',
      class: 'text-info',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
    },
    {
      buttonColor: 'carbon',
      class: 'text-carbon',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
    },
    {
      buttonColor: 'secondary',
      class: 'text-secondary-foreground',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
    },
    {
      buttonColor: 'accent',
      class: 'text-accent-foreground',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
    },
    {
      buttonColor: 'primary',
      class: 'hover:bg-primary/10 active:bg-primary/20',
      variant: ['outline', 'dashed', 'ghost'],
    },
    {
      buttonColor: 'destructive',
      class: 'hover:bg-destructive/10 active:bg-destructive/20',
      variant: ['outline', 'dashed', 'ghost'],
    },
    {
      buttonColor: 'success',
      class: 'hover:bg-success/10 active:bg-success/20',
      variant: ['outline', 'dashed', 'ghost'],
    },
    {
      buttonColor: 'warning',
      class: 'hover:bg-warning/10 active:bg-warning/20',
      variant: ['outline', 'dashed', 'ghost'],
    },
    {
      buttonColor: 'info',
      class: 'hover:bg-info/10 active:bg-info/20',
      variant: ['outline', 'dashed', 'ghost'],
    },
    {
      buttonColor: 'carbon',
      class: 'hover:bg-carbon/10 active:bg-carbon/20',
      variant: ['outline', 'dashed', 'ghost'],
    },
    {
      buttonColor: 'secondary',
      class:
        'hover:bg-secondary-foreground/10 active:bg-secondary-foreground/20',
      variant: ['outline', 'dashed', 'ghost'],
    },
    {
      buttonColor: 'accent',
      class: 'hover:bg-accent-foreground/10 active:bg-accent-foreground/20',
      variant: ['outline', 'dashed', 'ghost'],
    },
    {
      buttonColor: 'primary',
      class: 'hover:border-primary hover:text-primary',
      variant: 'plain',
    },
    {
      buttonColor: 'destructive',
      class: 'hover:border-destructive hover:text-destructive',
      variant: 'plain',
    },
    {
      buttonColor: 'success',
      class: 'hover:border-success hover:text-success',
      variant: 'plain',
    },
    {
      buttonColor: 'warning',
      class: 'hover:border-warning hover:text-warning',
      variant: 'plain',
    },
    {
      buttonColor: 'info',
      class: 'hover:border-info hover:text-info',
      variant: 'plain',
    },
    {
      buttonColor: 'carbon',
      class: 'hover:border-carbon hover:text-carbon',
      variant: 'plain',
    },
    {
      buttonColor: 'secondary',
      class:
        'hover:border-secondary-foreground hover:text-secondary-foreground',
      variant: 'plain',
    },
    {
      buttonColor: 'accent',
      class: 'hover:border-accent-foreground hover:text-accent-foreground',
      variant: 'plain',
    },
    {
      buttonColor: 'primary',
      class: 'border-primary',
      variant: ['outline', 'dashed'],
    },
    {
      buttonColor: 'destructive',
      class: 'border-destructive',
      variant: ['outline', 'dashed'],
    },
    {
      buttonColor: 'success',
      class: 'border-success',
      variant: ['outline', 'dashed'],
    },
    {
      buttonColor: 'warning',
      class: 'border-warning',
      variant: ['outline', 'dashed'],
    },
    {
      buttonColor: 'info',
      class: 'border-info',
      variant: ['outline', 'dashed'],
    },
    {
      buttonColor: 'carbon',
      class: 'border-carbon',
      variant: ['outline', 'dashed'],
    },
    {
      buttonColor: 'secondary',
      class: 'border-secondary-foreground',
      variant: ['outline', 'dashed'],
    },
    {
      buttonColor: 'accent',
      class: 'border-accent-foreground',
      variant: ['outline', 'dashed'],
    },
    {
      buttonColor: 'destructive',
      class:
        'bg-destructive/10 hover:bg-destructive/10 active:bg-destructive/20',
      variant: 'soft',
    },
    {
      buttonColor: 'success',
      class: 'bg-success/10 hover:bg-success/10 active:bg-success/20',
      variant: 'soft',
    },
    {
      buttonColor: 'warning',
      class: 'bg-warning/10 hover:bg-warning/10 active:bg-warning/20',
      variant: 'soft',
    },
    {
      buttonColor: 'info',
      class: 'bg-info/10 hover:bg-info/10 active:bg-info/20',
      variant: 'soft',
    },
    {
      buttonColor: 'carbon',
      class: 'bg-carbon/10 hover:bg-carbon/10 active:bg-carbon/20',
      variant: 'soft',
    },
    {
      buttonColor: 'secondary',
      class:
        'bg-secondary-foreground/10 hover:bg-secondary-foreground/10 active:bg-secondary-foreground/20',
      variant: 'soft',
    },
    {
      buttonColor: 'accent',
      class:
        'bg-accent-foreground/10 hover:bg-accent-foreground/10 active:bg-accent-foreground/20',
      variant: 'soft',
    },
    {
      class: 'h-6 w-6',
      shape: ['square', 'circle'],
      size: 'xs',
    },
    {
      class: 'h-7 w-7',
      shape: ['square', 'circle'],
      size: 'sm',
    },
    {
      class: 'h-9 w-9',
      shape: ['square', 'circle'],
      size: 'lg',
    },
    {
      class: 'h-10 w-10',
      shape: ['square', 'circle'],
      size: 'xl',
    },
    {
      class: 'h-12 w-12',
      shape: ['square', 'circle'],
      size: '2xl',
    },
    {
      class: 'shadow-none',
      shadow: ['sm', 'md', 'lg'],
      variant: ['ghost', 'link'],
    },
    {
      class: 'active:shadow-md',
      shadow: 'sm',
      variant: 'plain',
    },
    {
      class: 'active:shadow-lg',
      shadow: 'md',
      variant: 'plain',
    },
    {
      class: 'active:shadow-xl',
      shadow: 'lg',
      variant: 'plain',
    },
    {
      class: 'active:shadow-sm',
      shadow: 'sm',
      variant: 'pure',
    },
    {
      class: 'active:shadow-md',
      shadow: 'md',
      variant: 'pure',
    },
    {
      class: 'active:shadow-lg',
      shadow: 'lg',
      variant: 'pure',
    },
  ],
  defaultVariants: {
    buttonColor: 'primary',
    fitContent: false,
    shadow: 'sm',
    shape: 'auto',
    size: 'md',
    variant: 'solid',
  },
  variants: {
    buttonColor: {
      accent: `focus-visible:ring-accent-foreground/20`,
      carbon: `focus-visible:ring-carbon`,
      destructive: `focus-visible:ring-destructive`,
      info: `focus-visible:ring-info`,
      primary: `focus-visible:ring-primary`,
      secondary: `focus-visible:ring-secondary-foreground/20`,
      success: `focus-visible:ring-success`,
      warning: `focus-visible:ring-warning`,
    },
    disabled: {
      true: '',
    },
    fitContent: {
      true: 'w-fit! h-fit! p-0.5',
    },
    isLoading: {
      true: 'relative cursor-wait',
    },
    shadow: {
      lg: 'shadow-lg',
      md: 'shadow-md',
      none: 'shadow-none',
      sm: 'shadow-sm',
    },
    shape: {
      auto: 'rounded-md',
      circle:
        'aspect-square !p-0  rounded-full flex items-center justify-center',
      rounded: 'rounded-full',
      square: 'aspect-square !p-0  rounded-md flex items-center justify-center',
    },
    size: {
      '2xl': 'h-12 px-10 gap-6 text-xl [&_svg]:size-6',
      lg: 'h-9 px-6 gap-4 text-base [&_svg]:size-5',
      md: 'h-8 px-4 gap-3 text-sm [&_svg]:size-5',
      sm: 'h-7 px-2 gap-2 text-xs [&_svg]:size-4',
      xl: 'h-10 px-8 gap-5 text-lg [&_svg]:size-6',
      xs: 'h-6 px-1.5 gap-1 text-2xs [&_svg]:size-3',
    },
    variant: {
      dashed: 'border border-dashed bg-background',
      ghost: 'bg-transparent',
      link: 'bg-transparent underline-offset-4 hover:underline',
      outline: 'border bg-background',
      plain: 'border border-border bg-background text-foreground',
      pure: 'border border-border bg-background text-accent-foreground hover:bg-accent/60 active:bg-accent',
      soft: 'bg-primary/10 hover:bg-primary/10 active:bg-primary/20',
      solid:
        'bg-primary text-primary-foreground hover:bg-primary/80 active:bg-primary-600',
    },
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type ButtonColor = NonNullable<ButtonVariants['buttonColor']>;
export type ButtonVariant = NonNullable<ButtonVariants['variant']>;
export type ButtonShadow = NonNullable<ButtonVariants['shadow']>;
export type ButtonShape = NonNullable<ButtonVariants['shape']>;
export type ButtonSize = NonNullable<ButtonVariants['size']>;

export interface ButtonProps
  extends React.ComponentProps<'button'> {
  /**
   * 用于显示在按钮结束位置的图标
   */
  endIcon?: React.ReactNode;
  /**
   * 是否处于加载状态
   */
  isLoading?: boolean;
  /**
   * 加载状态时显示的组件
   */
  loadingIndicator?: React.ReactNode;
  /**
   * 用于显示在按钮开始位置的图标
   */
  startIcon?: React.ReactNode;
  /**
   * 按钮颜色
   */
  buttonColor?: ButtonColor;
  /**
   * 按钮阴影
   */
  shadow?: ButtonShadow;
  /**
   * 按钮形状
   */
  shape?: ButtonShape;
  /**
   * 按钮大小
   */
  size?: ButtonSize;
  /**
   * 按钮变体
   */
  variant?: ButtonVariant;
}

function Button({
  buttonColor,
  className,
  endIcon,
  isLoading,
  loadingIndicator,
  shadow = 'sm',
  shape,
  size,
  startIcon,
  variant,
  children,
  ...props
}: ButtonProps) {
  const loadingIndicatorRender = useMemo(() => {
    return loadingIndicator || <LoaderCircle className="size-4 animate-spin" />;
  }, [loadingIndicator]);
  return (
    <button
      className={cn(
        "cursor-pointer",
        buttonVariants({
          buttonColor,
          className,
          isLoading,
          shadow,
          shape,
          size,
          variant,
        }),

      )}
      data-slot="button"
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
          {loadingIndicatorRender}
        </span>
      )}
      <span
        className={cn('flex items-center justify-center gap-2', {
          'opacity-0': isLoading && loadingIndicatorRender,
        })}
      >
        {startIcon && <span className="button-icon">{startIcon}</span>}
        {children}
        {endIcon && <span className="button-icon">{endIcon}</span>}
      </span>
    </button>
  );
}

export { Button, buttonVariants };
