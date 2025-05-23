import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CodeIcon, EyeIcon } from '@repo/icons';
import { PreviewCode } from './code';
import { FullscreenButton } from './fullscreen-button';
import { FullscreenProvider } from './fullscreen-context';
import { PreviewRender } from './render';

type PreviewProps = {
    path: string;
    className?: string;
    type?: 'component' | 'block';
};

export const Preview = async ({
    path,
    className,
}: PreviewProps) => {
    const code = await readFile(
        join(process.cwd(), 'examples', `${path}.tsx`),
        'utf-8'
    );

    const Component = await import(`../../examples/${path}.tsx`).then(
        (module) => module.default
    );

    const parsedCode = code
        .replace(/@repo\/shadcn-ui\//g, '@/')
        .replace(/@repo\//g, '@/components/ui/xpress-ui/');

    return (
        <FullscreenProvider>
            <div
                className={cn(
                    'not-prose size-full max-h-[32rem] overflow-hidden rounded-lg border bg-background',
                    className
                )}
            >
                <Tabs defaultValue="preview" className="size-full gap-0">
                    <TabsList className="w-full rounded-none border-b">
                        <TabsTrigger value="code">
                            <CodeIcon size={16} className="text-muted-foreground" />
                            Code
                        </TabsTrigger>
                        <TabsTrigger value="preview">
                            <EyeIcon size={16} className="text-muted-foreground" />
                            Preview
                        </TabsTrigger>
                        <div className="ml-auto">
                            <FullscreenButton />
                        </div>
                    </TabsList>
                    <TabsContent
                        value="code"
                        className="size-full overflow-y-auto bg-background"
                    >
                        <PreviewCode code={parsedCode} language="tsx" filename="index.tsx" />
                    </TabsContent>
                    <TabsContent
                        value="preview"
                        className={cn(
                            'size-full overflow-auto',
                        )}
                        id='xpress-code-preview'
                    >
                        <PreviewRender>
                            <Component />
                        </PreviewRender>
                    </TabsContent>
                </Tabs>
            </div>
        </FullscreenProvider>
    );
};
