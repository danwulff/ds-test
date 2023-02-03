import { buildPackage } from "./internal/build-package";
import { buildStyle } from "./internal/build-style";
import { getPackageNames } from "./internal/get-package-names";

// build styles
const stylesDir = "styles";
const stylePackageNames = getPackageNames(stylesDir);
stylePackageNames.forEach((name) => {
  buildStyle(name);
  buildPackage(stylesDir, name);
});

// build components
