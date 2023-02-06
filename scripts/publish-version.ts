import { execSync } from "child_process";

import { buildPackage } from "./internal/build-package";
import { comparePackagesForChanges } from "./internal/compare-packages";
import { getPackageNames } from "./internal/get-package-names";
import { publishPackage } from "./internal/publish-package";

const [_exec, _path, pullRequestNum, labels] = process.argv;

// ensure labels are correct
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
const tag = "latest";

let aChangeWasPublished = false;

{
  // deploy style package snapshot
  const stylesDir = "styles";
  const stylePackageNames = getPackageNames(stylesDir);
  stylePackageNames.forEach((name) => {
    let changes = comparePackagesForChanges(name, stylesDir, tag);
    // if no changes, return early
    // if not found (should never happen), return early
    if (changes === "no-change" || changes === "not-found") {
      console.log("-");
      return;
    }
    // set new version
    const packageDir = `${stylesDir}/${name}`;
    execSync(`cd ${packageDir} && npm version ${increment}`, {
      stdio: "inherit",
    });
    buildPackage(stylesDir, name);
    // publish
    publishPackage(name, stylesDir, tag);
    aChangeWasPublished = true;
    console.log(`Run 'npm i @danwulff/${name}@${tag}' to install`);
    console.log("-");
  });
}

{
  // deploy component packages
  const componentsDir = "components";
  const componentPackageNames = getPackageNames(componentsDir);
  componentPackageNames.forEach((name) => {
    let changes = comparePackagesForChanges(name, componentsDir, tag);
    // if no changes, return early
    // if not found (should never happen), return early
    if (changes === "no-change" || changes === "not-found") {
      console.log("-");
      return;
    }
    // set new version
    const packageDir = `${componentsDir}/${name}`;
    execSync(`cd ${packageDir} && npm version ${increment}`, {
      stdio: "inherit",
    });
    buildPackage(componentsDir, name);
    // publish
    publishPackage(name, componentsDir, tag);
    aChangeWasPublished = true;
    console.log(`Run 'npm i @danwulff/${name}@${tag}' to install`);
    console.log("-");
  });
}

// sync back changes
if (aChangeWasPublished) {
  execSync('git config user.email "danielwulff.ee@gmail.com"', {
    stdio: "inherit",
  });
  execSync('git config user.name "Daniel Wulff"', { stdio: "inherit" });

  execSync(`git add .`, { stdio: "inherit" });
  execSync(
    `git commit -m "[automation] Sync published versions from PR-${pullRequestNum}"`,
    { stdio: "inherit" }
  );
  execSync(`git push`, { stdio: "inherit" });
}
