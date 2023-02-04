import { readFileSync } from "fs";
import { execSync } from "child_process";
import { getPackageNames } from "./internal/get-package-names";

const [_exec, _path, pullRequestNum, commitSHA] = process.argv;

// set git user to make "npm version" happy
// execSync(`git config user.email "danielwulff.ee@gmail.com"`, {
//   stdio: "inherit",
// });
// execSync(`git config user.name "Daniel Wulff"`, { stdio: "inherit" });

// deploy style package snapshot
const stylesDir = "styles";
const stylePackageNames = getPackageNames(stylesDir);
stylePackageNames.forEach((name) => {
  const distDir = `${stylesDir}/${name}/dist`;
  // set package version
  const currentVersion = JSON.parse(
    readFileSync(`${distDir}/package.json`, "utf-8")
  ).version;
  const newVersion = `${currentVersion}-pr${pullRequestNum}-${commitSHA}`;
  execSync(`cd ${distDir} && npm version ${newVersion}`, { stdio: "inherit" });
  // publish snapshot
  execSync(`cd ${distDir} && npm publish`, { stdio: "inherit" });
});

// deploy component packages
const componentsDir = "components";
const componentPackageNames = getPackageNames(componentsDir);
componentPackageNames.forEach((name) => {
  const distDir = `${componentsDir}/${name}/dist`;
  // set package version
  const currentVersion = JSON.parse(
    readFileSync(`${distDir}/package.json`, "utf-8")
  ).version;
  const newVersion = `${currentVersion}-pr${pullRequestNum}-${commitSHA}`;
  execSync(`cd ${distDir} && npm version ${newVersion}`, { stdio: "inherit" });
  // publish snapshot
  execSync(`cd ${distDir} && npm publish`, { stdio: "inherit" });
});
