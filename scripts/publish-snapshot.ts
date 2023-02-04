import { readFileSync } from "fs";
import { execSync } from "child_process";
import { getPackageNames } from "./internal/get-package-names";

const [_exec, _path, pullRequestNum, commitSHA] = process.argv;

// set git user to make "npm version" happy
execSync(`git config user.email "danielwulff.ee@gmail.com"`, {
  stdio: "inherit",
});
execSync(`git config user.name "Daniel Wulff"`, { stdio: "inherit" });

// deploy style package snapshot
const stylesDir = "styles";
const stylePackageNames = getPackageNames(stylesDir);
stylePackageNames.forEach((name) => {
  // set package version
  const currentVersion = JSON.parse(
    readFileSync(`${stylesDir}/${name}/dist/package.json`, "utf-8")
  ).version;
  const newVersion = `${currentVersion}-pr${pullRequestNum}-${commitSHA}`;
  execSync(`npm version ${newVersion}`, { stdio: "inherit" });
  // publish snapshot
  execSync(`npm publish`, { stdio: "inherit" });
});

// deploy component packages
const componentsDir = "components";
const componentPackageNames = getPackageNames(componentsDir);
componentPackageNames.forEach((name) => {
  // set package version
  const currentVersion = JSON.parse(
    readFileSync(`${componentsDir}/${name}/dist/package.json`, "utf-8")
  ).version;
  const newVersion = `${currentVersion}-pr${pullRequestNum}-${commitSHA}`;
  execSync(`npm version ${newVersion}`, { stdio: "inherit" });
  // publish snapshot
  execSync(`npm publish`, { stdio: "inherit" });
});
