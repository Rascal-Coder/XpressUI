import { ThemeScript } from '#/components/theme-script';
import './global.css';
import { cn } from "@/lib/utils"
import { RootProvider } from 'fumadocs-ui/provider';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
type LayoutProps = {
  readonly children: ReactNode;
};

export const metadata: Metadata = {
  title: 'Xpress-UI  Generator for shadcn/ui',
  description:
    'Xpress UI components use the shadcn/ui CSS variables and are designed to work neatly with the existing primitives.Much like the core shadcn/ ui primitives, the Xpress UI components are effectively a collection of building blocks that can be used to create more complex components.They encompass a wide range of use - cases and are designed to reduce boilerplate code without sacrificing flexibility and responsive design.While shadcn / ui focuses on wrapping primitives from Radix UI, Xpress UI is designed to be a more comprehensive library of components that can be used to build more complex applications.The components wrap more complex logic from various headless libraries to provide a more seamless experience.',
};

const Layout = ({ children }: LayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <ThemeScript />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Code:wght@300..700&family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@100..900&family=Oxanium:wght@200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body className={cn('flex min-h-screen flex-col')} suppressHydrationWarning>
      <RootProvider theme={{
        enabled: false,
      }}>{children}</RootProvider>
    </body>
  </html>
);

export default Layout;
