"use client";
import { useEffect, useRef, useState } from 'react';
import { ThemeControl } from './theme-control';

const STORAGE_KEY = 'themeControlPosition';

export const DraggableThemeControl = () => {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    // ignore JSON parse error
                }
            }
        }
        return { right: 16, bottom: 96 };
    });
    const [dragging, setDragging] = useState(false);
    const startPos = useRef<{ mouseX: number; mouseY: number; right: number; bottom: number } | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            const timer = setTimeout(() => setVisible(true), 30);
            return () => clearTimeout(timer);
        }
    }, [mounted]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging || !startPos.current) return;
            const dx = e.clientX - startPos.current.mouseX;
            const dy = e.clientY - startPos.current.mouseY;
            setPosition({
                right: Math.max(0, startPos.current.right - dx),
                bottom: Math.max(0, startPos.current.bottom - dy),
            });
        };
        const handleMouseUp = () => {
            setDragging(false);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
        };
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, position]);

    // 拖拽手柄事件
    const handleDragStart = (e: React.MouseEvent) => {
        setDragging(true);
        startPos.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            right: position.right,
            bottom: position.bottom,
        };
        e.preventDefault();
    };

    // biome-ignore lint/style/useBlockStatements: <explanation>
    if (!mounted) return null;

    return (
        <div
            className={`fixed z-50 hidden items-center transition-opacity duration-300 sm:flex ${visible ? 'opacity-100' : 'opacity-0'}`}
            style={{ right: position.right, bottom: position.bottom, pointerEvents: 'auto' }}
        >
            {/* biome-ignore lint/nursery/noStaticElementInteractions: <explanation> */}
            <div
                className='mr-2 flex h-4 w-4 cursor-grab items-center justify-center rounded-full bg-gray-300 active:cursor-grabbing dark:bg-gray-700'
                onMouseDown={handleDragStart}
                title="拖拽移动"
            >
                <svg width="10" height="10" viewBox="0 0 10 10">
                    <title>拖拽移动</title>
                    <circle cx="5" cy="5" r="4" fill="currentColor" />
                </svg>
            </div>
            <ThemeControl />
        </div>
    );
} 