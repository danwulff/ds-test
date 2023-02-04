import { execSync } from "child_process";
import { getPackageNames } from "./internal/get-package-names";

const [_exec, _path, pullRequestNum, labels] = process.argv;

execSync('git config user.email "danielwulff.ee@gmail.com"', {
  stdio: "inherit",
});
execSync('git config user.name "Daniel Wulff"', { stdio: "inherit" });

const parsedSemverLabels = JSON.parse(labels).filter(
  (label: string) => label === "patch" || label === "minor" || label === "major"
);

if (parsedSemverLabels.length !== 1) {
  console.log(
    `Unexpected number of labels. ${
      parsedSemverLabels.length
    } labels found: ${parsedSemverLabels.join(", ")}`
  );
  process.exit(1);
}

const increment = parsedSemverLabels[0];

// deploy style package snapshot
const stylesDir = "styles";
const stylePackageNames = getPackageNames(stylesDir);
stylePackageNames.forEach((name) => {
  const distDir = `${stylesDir}/${name}/dist`;
  // set package version
  execSync(`cd ${distDir} && npm version ${increment}`, { stdio: "inherit" });
  // publish snapshot
  execSync(`cd ${distDir} && npm publish`, { stdio: "inherit" });
});

// deploy component packages
const componentsDir = "components";
const componentPackageNames = getPackageNames(componentsDir);
componentPackageNames.forEach((name) => {
  const distDir = `${componentsDir}/${name}/dist`;
  // set package version
  execSync(`cd ${distDir} && npm version ${increment}`, { stdio: "inherit" });
  // publish snapshot
  execSync(`cd ${distDir} && npm publish`, { stdio: "inherit" });
});

// sync back changes
execSync(`git add .`, { stdio: "inherit" });
execSync(
  `git commit -m "[automation] Sync published versions from PR-${pullRequestNum}"`,
  { stdio: "inherit" }
);
execSync(`git push`, { stdio: "inherit" });
