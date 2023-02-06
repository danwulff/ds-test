import { readFileSync } from 'fs';
import { execSync } from 'child_process';

import { getPackageNames } from './internal/get-package-names';
import { comparePackagesForChanges } from './internal/compare-packages';
import { publishPackage } from './internal/publish-package';

const [_exec, _path, pullRequestNum, commitSHA] = process.argv;

const tag = `pr-${pullRequestNum}`;

// deploy style package snapshot
{
  const stylesDir = 'styles';
  const stylePackageNames = getPackageNames(stylesDir);
  stylePackageNames.forEach((name) => {
    // check for "pr-#" tag changes
    let changes = comparePackagesForChanges(name, stylesDir, tag);
    // if no changes, check for "latest" tag changes
    if (changes === 'not-found') {
      changes = comparePackagesForChanges(name, stylesDir, 'latest');
    }

    // if no changes, return early
    // if not found (should never happen), return early
    if (changes === 'no-change' || changes === 'not-found') {
      console.log('-');
      return;
    }

    // set snapshot version
    const localVersion = JSON.parse(
      readFileSync(`${stylesDir}/${name}/package.json`, 'utf-8')
    ).version;
    const newVersion = `${localVersion}-${commitSHA}`;
    execSync(`cd ${stylesDir}/${name}/dist && npm version ${newVersion}`, {
      stdio: 'inherit',
    });
    // publish
    publishPackage(name, stylesDir, tag);
    console.log(`Run 'npm i @danwulff/${name}@${tag}' to install`);
    console.log('-');
  });
}

// deploy component packages
{
  const componentsDir = 'components';
  const componentPackageNames = getPackageNames(componentsDir);
  componentPackageNames.forEach((name) => {
    // check for "pr-#" tag changes
    let changes = comparePackagesForChanges(name, componentsDir, tag);
    // if no changes, check for "latest" tag changes
    if (changes === 'not-found') {
      changes = comparePackagesForChanges(name, componentsDir, 'latest');
    }

    // if no changes, return early
    // if not found (should never happen), return early
    if (changes === 'no-change' || changes === 'not-found') {
      console.log('-');
      return;
    }

    // set snapshot version
    const localVersion = JSON.parse(
      readFileSync(`${componentsDir}/${name}/package.json`, 'utf-8')
    ).version;
    const newVersion = `${localVersion}-${commitSHA}`;
    execSync(`cd ${componentsDir}/${name}/dist && npm version ${newVersion}`, {
      stdio: 'inherit',
    });
    // publish
    publishPackage(name, componentsDir, tag);
    console.log(`Run 'npm i @danwulff/${name}@${tag}' to install`);
    console.log('-');
  });
}
