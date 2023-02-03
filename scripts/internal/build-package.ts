import { readFileSync, writeFileSync } from "fs";

export function buildPackage(parentDir: string, name: string) {
  var _a;
  // template package
  const tempPackage = JSON.parse(
    readFileSync(`${parentDir}/ds-package.json`, "utf-8").replaceAll(
      "{{name}}",
      name
    )
  );
  // module package
  const modulePackage = JSON.parse(
    readFileSync(`${parentDir}/${name}/package.json`, "utf-8")
  );
  // add properties from module package
  tempPackage.version = modulePackage.version;
  (_a = tempPackage.peerDependencies) !== null && _a !== void 0
    ? _a
    : (tempPackage.peerDependencies = {});
  Object.entries(modulePackage.peerDependencies || {}).forEach(
    ([key, value]) => {
      tempPackage.peerDependencies[key] = value;
    }
  );
  writeFileSync(
    `${parentDir}/${name}/dist/package.json`,
    JSON.stringify(tempPackage)
  );
}
