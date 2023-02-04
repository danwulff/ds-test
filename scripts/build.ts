import { buildPackage } from "./internal/build-package";
import { buildStyle } from "./internal/build-style";
import { getPackageNames } from "./internal/get-package-names";
import { buildComponent } from "./internal/build-component";

// build styles
console.log("building styles packages...");
const stylesDir = "styles";
const stylePackageNames = getPackageNames(stylesDir);
stylePackageNames.forEach((name) => {
  console.log(`building ${name}`);
  buildStyle(name);
  buildPackage(stylesDir, name);
});

// build components
console.log("building component packages...");
const componentsDir = "components";
const componentPackageNames = getPackageNames(componentsDir);
componentPackageNames.forEach((name) => {
  console.log(`building ${name}`);
  buildComponent(name);
  buildPackage(componentsDir, name);
});
