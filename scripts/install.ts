import { execSync } from "child_process";
import { getPackageNames } from "./internal/get-package-names";

// install style dependencies
const stylesDir = "styles";
const stylePackageNames = getPackageNames(stylesDir);

stylePackageNames.forEach((name) => {
  execSync(`cd ${stylesDir}/${name} && npm i`, { stdio: "inherit" });
});

// install component dependencies
const componentsDir = "components";
const componentPackageNames = getPackageNames(componentsDir);

componentPackageNames.forEach((name) => {
  execSync(`cd ${componentsDir}/${name} && npm i`, { stdio: "inherit" });
});
