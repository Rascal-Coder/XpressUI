'use client';
import type { ReactNode } from 'react';
import { useState } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

type PreviewRenderProps = {
  children: ReactNode;
};

export const PreviewRender = ({ children }: PreviewRenderProps) => {
  const [device, setDevice] = useState<DeviceType>('desktop');

  return (
    <div className='py-4'>
      <div className='mb-6 flex justify-center gap-4'>
        <button
          type="button"
          onClick={() => setDevice('mobile')}
          className={`cursor-pointer rounded-md p-2 transition-colors ${device === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
          aria-label="Mobile view"
        >
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
        </button>
        <button
          type="button"
          onClick={() => setDevice('tablet')}
          className={`cursor-pointer rounded-md p-2 transition-colors ${device === 'tablet' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
          aria-label="Tablet view"
        >
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><line x1="12" x2="12.01" y1="18" y2="18" /></svg>
        </button>
        <button
          type="button"
          onClick={() => setDevice('desktop')}
          className={`cursor-pointer rounded-md p-2 transition-colors ${device === 'desktop' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
          aria-label="Desktop view"
        >
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
        </button>
      </div>

      <div className="flex justify-center">
        <div
          className={`rounded-lg border bg-background shadow-lg transition-all duration-300 ${device === 'mobile' ? 'w-[320px]' :
            // biome-ignore lint/nursery/noNestedTernary: <explanation>
            device === 'tablet' ? 'w-[768px]' :
              'w-full max-w-4xl'}
          `}
        >
          <div className='flex items-center gap-1.5 border-b bg-muted/20 px-4 py-2'>
            <div className='h-3 w-3 rounded-full bg-rose-500' />
            <div className='h-3 w-3 rounded-full bg-amber-500' />
            <div className='h-3 w-3 rounded-full bg-emerald-500' />
          </div>
          <div className='flex w-full flex-col items-center gap-4 p-4'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
