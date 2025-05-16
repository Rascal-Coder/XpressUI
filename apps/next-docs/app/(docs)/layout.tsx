import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { source } from '../../lib/source';
import pkg from '../../package.json';
type LayoutProps = {
  readonly children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <DocsLayout
      tree={source.pageTree}
      tabMode="navbar"
      sidebar={{ collapsible: false }}
      githubUrl="https://github.com/Rascal-Coder/xpress-ui"
      nav={{
        title: (
          <>
            <Image
              src="/logo.svg"
              alt="Xpress-UI"
              width={611}
              height={116}
              priority
              className="h-[36px] w-auto "
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm">Xpress-UI</span>
              <span className="text-xs">{pkg.version}</span>
            </div>
          </>
        ),
        mode: 'auto',
      }}
    >
      {children}
    </DocsLayout>
  )
};

export default Layout;
