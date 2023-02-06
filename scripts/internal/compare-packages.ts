import { readFileSync } from "fs";
import { execSync } from "child_process";

type compareResult = "not-found" | "change" | "no-change";
interface CompareTo {
  version: string;
  integrity: string;
}

export function comparePackagesForChanges(
  name: string,
  parentDir: string,
  compareToPackageTag: string
): compareResult {
  console.log(`Checking @danwulff/${name} for changes...`);

  // get current version
  const distDir = `${parentDir}/${name}/dist`;
  const localVersion = JSON.parse(
    readFileSync(`${distDir}/package.json`, "utf-8")
  ).version;

  // pick a version to compare our current version to
  let compareTo: CompareTo;
  let viewResult: string;
  try {
    viewResult = execSync(
      `npm view @danwulff/${name}@${compareToPackageTag} --json`
    ).toString();
  } catch (e) {
    viewResult = "E404";
  }

  // if compareToPackageTag doesn't exist, return
  if (viewResult.includes("E404")) {
    console.log(`@danwulff/${name}@${compareToPackageTag} not found.`);
    return "not-found";
  }

  // gather tag version and hash
  console.log(`@danwulff/${name}@${compareToPackageTag} found`);
  const parsedResult = JSON.parse(viewResult);
  compareTo = {
    version: parsedResult["dist-tags"][compareToPackageTag],
    integrity: parsedResult.dist.integrity,
  };

  // comparison
  console.log(`Comparing package to: ${compareTo.version}`);
  if (localVersion !== compareTo.version) {
    execSync(`cd ${distDir} && npm version ${compareTo.version}`);
  }
  const localIntegrity = JSON.parse(
    execSync(`cd ${distDir} && npm pack --dry-run --json`).toString()
  )[0].integrity;

  // result
  if (compareTo.integrity === localIntegrity) {
    console.log(`No changes for ${name}.`);
    return "no-change";
  } else {
    console.log(`Changes found for ${name}.`);
    return "change";
  }
}
