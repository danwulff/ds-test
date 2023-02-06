import { execSync } from 'child_process';

export function buildStyle(name: string) {
  const inputPath = `styles/${name}/${name}.scss`;
  const outputFile = `styles/${name}/dist/${name}.css`;
  const outputMinFile = `styles/${name}/dist/${name}.min.css`;
  execSync(`npx sass ${inputPath} ${outputFile}`, { stdio: 'inherit' });
  execSync(`npx sass ${inputPath} ${outputMinFile} --style=compressed`, {
    stdio: 'inherit',
  });
}
