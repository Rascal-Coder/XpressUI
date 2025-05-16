import { promises as fs } from 'node:fs';
import { readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { type NextRequest, NextResponse } from 'next/server';

type RegistryParams = {
  params: Promise<{ component: string }>;
};

const getPackage = async (packageName: string) => {
  const packageDir = join(process.cwd(), '..', '..', 'packages', packageName);
  const packagePath = join(packageDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packagePath, 'utf-8'));

  const XpressDependencies = Object.keys(packageJson.dependencies || {}).filter(
    (dep) => dep.startsWith('@repo') && dep !== '@repo/shadcn-ui'
  );

  const dependencies = Object.keys(packageJson.dependencies || {}).filter(
    (dep) =>
      ![
        'react',
        'react-dom',
        '@repo/shadcn-ui',
        ...XpressDependencies,
      ].includes(dep)
  );

  const devDependencies = Object.keys(packageJson.devDependencies || {}).filter(
    (dep) => !['@types/react', '@types/react-dom', 'typescript'].includes(dep)
  );

  const packageFiles = readdirSync(packageDir, { withFileTypes: true });
  const allFiles = packageFiles.filter(
    (file) =>
      file.isFile() && (file.name.endsWith('.ts') || file.name.endsWith('.tsx'))
  );

  const files: {
    type: string;
    path: string;
    content: string;
    target: string;
  }[] = [];

  const fileContents = await Promise.all(
    allFiles.map(async (file) => {
      const filePath = join(packageDir, file.name);
      const content = await fs.readFile(filePath, 'utf-8');

      return {
        type: 'registry:ui',
        path: file.name,
        content,
        target: `components/ui/xpress-ui/${packageName}/${file.name}`,
      };
    })
  );

  files.push(...fileContents);

  const registryDependencies =
    files
      .map((f) => f.content)
      .join('\n')
      .match(/@\/components\/ui\/([a-z-]+)/g)
      ?.map((path) => path.split('/').pop())
      .filter((name): name is string => !!name) || [];

  for (const dep of XpressDependencies) {
    const packageName = dep.replace('@repo/', '');

    registryDependencies.push(
      `https://xpress-ui.ras-cal.cc/registry/${packageName}.json`
    );
  }

  return {
    name: packageName,
    dependencies,
    devDependencies,
    registryDependencies,
    files,
  };
};

export const GET = async (_: NextRequest, { params }: RegistryParams) => {
  const { component } = await params;

  if (!component.endsWith('.json')) {
    return NextResponse.json(
      { error: 'Component must end with .json' },
      { status: 400 }
    );
  }

  const packageName = component.replace('.json', '');

  try {
    const pkg = await getPackage(packageName);

    const response = {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      homepage: `https://xpress-ui.ras-cal.cc/components/${pkg.name}`,
      name: pkg.name,
      type: 'registry:ui',
      author: 'Rascal-Coder',
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies,
      registryDependencies: pkg.registryDependencies,
      files: pkg.files,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get package', details: error },
      { status: 500 }
    );
  }
};
