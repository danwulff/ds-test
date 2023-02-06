import { execSync } from "child_process";

export function publishPackage(
  name: string,
  parentDir: string,
  newVersion: "patch" | "minor" | "major" | string,
  tag: string
): void {
  console.log(`Publishing @danwulff/${name} changes...`);
  const distDir = `${parentDir}/${name}/dist`;
  execSync(`cd ${distDir} && npm version ${newVersion}`, { stdio: "inherit" });
  execSync(`cd ${distDir} && npm publish --tag ${tag}`, {
    stdio: "inherit",
  });
  console.log(`Published ${name} ${newVersion} with tag ${tag}`);
}
