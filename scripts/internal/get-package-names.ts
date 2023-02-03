import { readdirSync } from "fs";

export function getPackageNames(parentDirPath: string): string[] {
  return readdirSync(parentDirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((dir) => dir.startsWith("ds-"));
}
