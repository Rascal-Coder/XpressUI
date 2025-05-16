import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Copy } from "@repo/icons";
import { useState } from "react";
import type { CodePanelProps, ColorFormat } from "#/types";
import { generateThemeCode } from "#/utils/theme-generator";

const CodePanel: React.FC<CodePanelProps> = ({ themeEditorState }) => {
  const [copied, setCopied] = useState(false);
  const [colorFormat, setColorFormat] = useState<ColorFormat>("oklch");

  const code = generateThemeCode(themeEditorState, colorFormat);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='mb-4 flex items-center gap-2 '>
        <Select
          value={colorFormat}
          onValueChange={(value: ColorFormat) => setColorFormat(value)}
        >
          <SelectTrigger className='w-fit gap-1 border-none bg-muted/50 outline-hidden focus:border-none focus:ring-transparent'>
            <SelectValue className="focus:ring-transparent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hsl">hsl</SelectItem>
            <SelectItem value="oklch">oklch</SelectItem>
            <SelectItem value="rgb">rgb</SelectItem>
            <SelectItem value="hex">hex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border'>
        <div className='flex flex-none items-center justify-between border-b bg-muted/50 px-4 py-2'>
          <span className='font-medium text-sm'>global.css</span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(code)}
              className="h-8"
              aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  <span className="sr-only md:not-sr-only">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span className="sr-only md:not-sr-only">Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <ScrollArea className='relative flex-1'>
          <pre className="h-full p-4 text-sm">
            <code>{code}</code>
          </pre>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CodePanel;
