'use client';
import {
    Button,
    type ButtonColor,
    type ButtonShadow,
    type ButtonShape,
    type ButtonSize,
    type ButtonVariant,
} from '@/components/ui/button';
import { LoaderCircle } from '@repo/icons';

import { useState } from 'react';

// 自定义加载指示器组件
// const LoadingSpinner = () => (
//   <svg
//     className="h-5 w-5 animate-spin"
//     fill="none"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <title>加载中</title>
//     <circle
//       className="opacity-25"
//       cx="12"
//       cy="12"
//       r="10"
//       stroke="currentColor"
//       strokeWidth="4"
//     />
//     <path
//       className="opacity-75"
//       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//       fill="currentColor"
//     />
//   </svg>
// );

// 简单的图标组件
const PlusIcon = () => (
    <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>添加</title>
        <path d="M12 5v14M5 12h14" />
    </svg>
);

const CheckIcon = () => (
    <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>确认</title>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

function Demo() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadingClick = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    // 按视觉强度排序按钮类型
    const variants: ButtonVariant[] = [
        'solid', // 实心
        'soft', // 柔和
        'outline', // 轮廓
        'dashed', // 虚线
        'pure', // 纯色
        'plain', // 普通
        'ghost', // 幽灵
        'link', // 链接
    ];

    const colors: ButtonColor[] = [
        'primary',
        'destructive',
        'success',
        'warning',
        'info',
        'carbon',
        'secondary',
        'accent',
    ];
    const sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const shapes: ButtonShape[] = ['auto', 'rounded', 'circle', 'square'];
    const shadows: ButtonShadow[] = ['none', 'sm', 'md', 'lg'];

    return (
        <div className="space-y-8 p-4">
            <div>
                <h2 className="mb-2 font-medium text-lg">颜色变体</h2>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <Button buttonColor={color} key={color} variant="solid">
                            {color}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="mb-2 font-medium text-lg">按钮类型</h2>
                <div className="space-y-4">
                    {colors.map((color) => (
                        <div className="space-y-1" key={color}>
                            <h3 className="mb-1 font-medium text-gray-500 text-sm">
                                {color}
                            </h3>
                            <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap">
                                {variants.map((variant) => (
                                    <Button
                                        buttonColor={color}
                                        className="min-w-[75px] justify-center"
                                        key={`${color}-${variant}`}
                                        variant={variant}
                                    >
                                        {variant}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="mb-2 font-medium text-lg">按钮尺寸</h2>
                <div className="flex flex-wrap items-end gap-2">
                    {sizes.map((size) => (
                        <Button key={size} size={size}>
                            {size}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="mb-2 font-medium text-lg">按钮形状</h2>
                <div className="flex flex-wrap items-center gap-8 rounded-md">
                    {shapes.map((shape) => (
                        <div className="flex flex-col items-center gap-2" key={shape}>
                            <Button buttonColor="primary" shape={shape} size="lg">
                                {shape === 'circle' || shape === 'square' ? (
                                    <PlusIcon />
                                ) : (
                                    shape
                                )}
                            </Button>
                            <span className="mt-2 font-medium text-sm">{shape}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="mb-2 font-medium text-lg">阴影效果</h2>
                <div className="flex flex-wrap items-center gap-8 rounded-md ">
                    {shadows.map((shadow) => (
                        <div className="flex flex-col items-center gap-2" key={shadow}>
                            <Button
                                buttonColor="primary"
                                className="min-w-[120px]"
                                shadow={shadow}
                                size="lg"
                                variant="solid"
                            >
                                Shadow {shadow}
                            </Button>
                            <span className="mt-2 font-medium text-sm">{shadow}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="mb-2 font-medium text-lg">图标按钮</h2>
                <div className="flex flex-wrap gap-2">
                    <Button startIcon={<PlusIcon />}>带开始图标</Button>
                    <Button endIcon={<CheckIcon />}>带结束图标</Button>
                    <Button endIcon={<CheckIcon />} startIcon={<PlusIcon />}>
                        双侧图标
                    </Button>
                    <Button startIcon={<PlusIcon />} variant="ghost">
                        Ghost + 图标
                    </Button>
                    <Button aria-label="添加" shape="circle" variant="ghost">
                        <PlusIcon />
                    </Button>
                    <Button aria-label="添加" buttonColor="success" shape="circle">
                        <PlusIcon />
                    </Button>
                    <Button aria-label="确认" buttonColor="destructive" shape="square">
                        <CheckIcon />
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="mb-2 font-medium text-lg">加载状态</h2>
                <div className="flex flex-wrap gap-2">
                    <Button
                        isLoading={isLoading}
                        loadingIndicator={<LoaderCircle className='mr-2 size-4 flex-shrink-0 animate-spin text-md' />}
                        onClick={handleLoadingClick}
                    >
                        {isLoading ? '加载中...' : '点击加载'}
                    </Button>
                    <Button
                        buttonColor="success"
                        isLoading={isLoading}
                        loadingIndicator={<LoaderCircle className='mr-2 size-4 flex-shrink-0 animate-spin text-md' />}
                        onClick={handleLoadingClick}
                        startIcon={<CheckIcon />}
                        variant="soft"
                    >
                        带图标的加载
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="mb-2 font-medium text-lg">
                    secondary & accent 按钮类型
                </h2>
                <div className="flex flex-wrap gap-2">
                    <Button buttonColor="secondary" variant="solid">
                        Solid
                    </Button>
                    <Button buttonColor="secondary" variant="soft">
                        Soft
                    </Button>
                    <Button buttonColor="secondary" variant="outline">
                        Outline
                    </Button>
                    <Button buttonColor="secondary" variant="dashed">
                        Dashed
                    </Button>
                    <Button buttonColor="secondary" variant="pure">
                        Pure
                    </Button>
                    <Button buttonColor="secondary" variant="plain">
                        Plain
                    </Button>
                    <Button buttonColor="secondary" variant="ghost">
                        Ghost
                    </Button>
                    <Button buttonColor="secondary" variant="link">
                        Link
                    </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button buttonColor="accent" variant="solid">
                        Solid
                    </Button>
                    <Button buttonColor="accent" variant="soft">
                        Soft
                    </Button>
                    <Button buttonColor="accent" variant="outline">
                        Outline
                    </Button>
                    <Button buttonColor="accent" variant="dashed">
                        Dashed
                    </Button>
                    <Button buttonColor="accent" variant="pure">
                        Pure
                    </Button>
                    <Button buttonColor="accent" variant="plain">
                        Plain
                    </Button>
                    <Button buttonColor="accent" variant="ghost">
                        Ghost
                    </Button>
                    <Button buttonColor="accent" variant="link">
                        Link
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="mb-2 font-medium text-lg">info & carbon 按钮类型</h2>
                <div className="flex flex-wrap gap-2">
                    <Button buttonColor="info" variant="solid">
                        Solid
                    </Button>
                    <Button buttonColor="info" variant="soft">
                        Soft
                    </Button>
                    <Button buttonColor="info" variant="outline">
                        Outline
                    </Button>
                    <Button buttonColor="info" variant="dashed">
                        Dashed
                    </Button>
                    <Button buttonColor="info" variant="pure">
                        Pure
                    </Button>
                    <Button buttonColor="info" variant="plain">
                        Plain
                    </Button>
                    <Button buttonColor="info" variant="ghost">
                        Ghost
                    </Button>
                    <Button buttonColor="info" variant="link">
                        Link
                    </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button buttonColor="carbon" variant="solid">
                        Solid
                    </Button>
                    <Button buttonColor="carbon" variant="soft">
                        Soft
                    </Button>
                    <Button buttonColor="carbon" variant="outline">
                        Outline
                    </Button>
                    <Button buttonColor="carbon" variant="dashed">
                        Dashed
                    </Button>
                    <Button buttonColor="carbon" variant="pure">
                        Pure
                    </Button>
                    <Button buttonColor="carbon" variant="plain">
                        Plain
                    </Button>
                    <Button buttonColor="carbon" variant="ghost">
                        Ghost
                    </Button>
                    <Button buttonColor="carbon" variant="link">
                        Link
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="mb-2 font-medium text-lg">组合示例</h2>
                <div className="flex flex-wrap gap-4">
                    <Button
                        buttonColor="primary"
                        shadow="lg"
                        shape="rounded"
                        size="lg"
                        startIcon={<PlusIcon />}
                        variant="solid"
                    >
                        创建新项目
                    </Button>

                    <Button
                        buttonColor="success"
                        endIcon={<CheckIcon />}
                        shadow="md"
                        variant="soft"
                    >
                        确认提交
                    </Button>

                    <Button
                        buttonColor="destructive"
                        shadow="sm"
                        shape="square"
                        variant="outline"
                    >
                        <svg
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>删除</title>
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Demo;
