import { execSync } from "child_process";
import { getPackageNames } from "./internal/get-package-names";

// postinstall gets triggered on both "install" and "ci"
// perform the same command in all packages
const installCommand = `npm ${process.env.npm_command ?? "install"}`;

// install within style dependencies
{
  const stylesDir = "styles";
  const stylePackageNames = getPackageNames(stylesDir);
  stylePackageNames.forEach((name) => {
    execSync(`cd ${stylesDir}/${name} && ${installCommand}`, {
      stdio: "inherit",
    });
  });
}

// install within component dependencies
{
  const componentsDir = "components";
  const componentPackageNames = getPackageNames(componentsDir);
  componentPackageNames.forEach((name) => {
    execSync(`cd ${componentsDir}/${name} && ${installCommand}`, {
      stdio: "inherit",
    });
  });
}

// install within storybook
execSync(`cd storybook && ${installCommand}`, {
  stdio: "inherit",
});
