// clambers through all the individual components/styles and installs any dependencies
import { execSync } from "child_process";
import { readdirSync } from "fs";

// install style dependencies
const styleDirs = readdirSync("./styles", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter((dir) => dir.startsWith("ds-"));

styleDirs.forEach((directory) => {
  execSync(`cd styles/${directory} && npm i`, { stdio: "inherit" });
});

// install component dependencies
const componentDirs = readdirSync("./components", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter((dir) => dir.startsWith("ds-"));

componentDirs.forEach((directory) => {
  execSync(`cd components/${directory} && npm i`, { stdio: "inherit" });
});
