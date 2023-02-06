import { execSync } from 'child_process';

import { buildPackage } from './internal/build-package';
import { buildStyle } from './internal/build-style';
import { getPackageNames } from './internal/get-package-names';
import { buildComponent } from './internal/build-component';
import { getBuildOrder } from './internal/get-build-order';

// build styles
{
  console.log('building styles packages...');
  const stylesDir = 'styles';
  const stylePackageNames = getPackageNames(stylesDir);
  const styleBuildOrder = getBuildOrder(stylesDir, stylePackageNames);
  styleBuildOrder.forEach((name) => {
    console.log(`building ${name}`);
    execSync(`rm -rf ${stylesDir}/${name}/dist`, { stdio: 'inherit' });
    buildStyle(name);
    buildPackage(stylesDir, name);
    // link any dependencies
  });
}

// build components
{
  console.log('building component packages...');
  const componentsDir = 'components';
  const componentPackageNames = getPackageNames(componentsDir);
  const componentBuildOrder = getBuildOrder(
    componentsDir,
    componentPackageNames
  );
  componentBuildOrder.forEach((name) => {
    console.log(`building ${name}`);
    execSync(`rm -rf ${componentsDir}/${name}/dist`, { stdio: 'inherit' });
    buildComponent(name);
    buildPackage(componentsDir, name);
    // link any dependencies
  });
}
