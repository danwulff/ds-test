import { readFileSync } from "fs";
import { execSync } from "child_process";
import { getPackageNames } from "./internal/get-package-names";

interface CompareTo {
  version: string;
  integrity: string;
}

const [_exec, _path, pullRequestNum, commitSHA] = process.argv;

const tag = `pr-${pullRequestNum}`;

// deploy style package snapshot
const stylesDir = "styles";
const stylePackageNames = getPackageNames(stylesDir);
stylePackageNames.forEach((name) => {
  console.log(`Publishing snapshot: ${name}`);
  console.log("Checking for changes...");

  // get current version
  const distDir = `${stylesDir}/${name}/dist`;
  const localVersion = JSON.parse(
    readFileSync(`${distDir}/package.json`, "utf-8")
  ).version;
  console.log("Local version:", localVersion);

  // pick a version to compare our current version to
  let compareTo: CompareTo;
  let viewResult: string;
  try {
    viewResult = execSync(
      `npm view @danwulff/${name}@${tag} --json`
    ).toString();
  } catch (e) {
    console.log("error", e);
    viewResult = "E404";
  }
  console.log("viewResult:", viewResult);
  if (!viewResult.includes("E404")) {
    console.log(`@danwulff/${name}@${tag} found`);
    const parsedResult = JSON.parse(viewResult);
    compareTo = {
      version: parsedResult["dist-tags"][tag],
      integrity: parsedResult.dist.integrity,
    };
  } else {
    console.log(`@danwulff/${name}@${tag} not found`);
    viewResult = execSync(
      `npm view @danwulff/${name}@latest --json`
    ).toString();
    const parsedResult = JSON.parse(viewResult);
    compareTo = {
      version: parsedResult["dist-tags"].latest,
      integrity: parsedResult.dist.integrity,
    };
  }
  console.log("Compare to:", compareTo.version);
  if (localVersion !== compareTo.version) {
    execSync(`cd ${distDir} && npm version ${compareTo.version}`);
  }
  const localIntegrity = JSON.parse(
    execSync(`cd ${distDir} && npm pack --dry-run --json`).toString()
  )[0].integrity;
  // TODO: remove these logs
  console.log("integrities:");
  console.log(compareTo.integrity);
  console.log(localIntegrity);
  if (compareTo.integrity === localIntegrity) {
    console.log(`No changes found for ${name}.`);
    return;
  }

  // set snapshot version
  const newVersion = `${localVersion}-${commitSHA}`;
  execSync(`cd ${distDir} && npm version ${newVersion}`, { stdio: "inherit" });
  // // publish snapshot
  // execSync(`cd ${distDir} && npm publish --tag ${tag}`, {
  //   stdio: "inherit",
  // });
  // console.log(`Published ${name} ${newVersion}`);
  // console.log(`Run 'npm i @danwulff/${name}@${tag}' to install.`);
});

// // deploy component packages
// const componentsDir = "components";
// const componentPackageNames = getPackageNames(componentsDir);
// componentPackageNames.forEach((name) => {
//   const distDir = `${componentsDir}/${name}/dist`;
//   // set package version
//   const currentVersion = JSON.parse(
//     readFileSync(`${distDir}/package.json`, "utf-8")
//   ).version;
//   const newVersion = `${currentVersion}-${commitSHA}`;
//   execSync(`cd ${distDir} && npm version ${newVersion}`, { stdio: "inherit" });
//   // publish snapshot
//   execSync(`cd ${distDir} && npm publish --tag ${tag}`, {
//     stdio: "inherit",
//   });
// });
