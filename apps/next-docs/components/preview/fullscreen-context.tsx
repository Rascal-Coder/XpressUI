'use client';

import { createContext, useContext, useState } from 'react';

type FullscreenContextType = {
    isFullscreen: boolean;
    setIsFullscreen: (value: boolean) => void;
};

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const FullscreenProvider = ({ children }: { children: React.ReactNode }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    return (
        <FullscreenContext.Provider value={{ isFullscreen, setIsFullscreen }}>
            {children}
        </FullscreenContext.Provider>
    );
};

export const useFullscreen = () => {
    const context = useContext(FullscreenContext);
    if (context === undefined) {
        throw new Error('useFullscreen must be used within a FullscreenProvider');
    }
    return context;
}; 