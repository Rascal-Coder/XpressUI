'use client';

import { Button } from '@repo/button';
import { Maximize, Minimize } from '@repo/icons';
import { useFullscreen } from './fullscreen-context';

export const FullscreenButton = () => {
    const { isFullscreen, setIsFullscreen } = useFullscreen();

    const toggleFullscreen = () => {
        const previewContent = document.querySelector('#xpress-code-preview');
        if (!previewContent) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
        } else {
            previewContent.requestFullscreen();
            setIsFullscreen(true);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="mx-1 h-8 w-8 p-0"
        >
            {isFullscreen ? (
                <Minimize size={16} className="text-muted-foreground" />
            ) : (
                <Maximize size={16} className="text-muted-foreground" />
            )}
        </Button>
    );
}; 