import { readFileSync } from "fs";

// Depth first search
export function getBuildOrder(parentDir: string, names: string[]): string[] {
  const order: string[] = [];

  // create list of packages and dependencies
  const packages: Record<string, Record<string, boolean>> = {};
  names.forEach((name) => {
    const fullPackage = JSON.parse(
      readFileSync(`${parentDir}/${name}/package.json`, "utf-8")
    );
    const dependencies: Record<string, boolean> = {};
    if (fullPackage.peerDependencies) {
      Object.keys(
        fullPackage.peerDependencies as Record<string, string>
      ).forEach((packageName) => {
        if (packageName.startsWith("@danwulff/")) {
          const name = /@danwulff\/(.*)/.exec(packageName)?.[1];
          if (name) {
            dependencies[name] = true;
          }
        }
      });
    }
    packages[name] = dependencies;
  });

  // visit
  const visitedPackages: Record<string, boolean> = {};
  Object.entries(packages).forEach(([name, dependencies]) => {
    visitPackage(name, dependencies);
  });

  function visitPackage(
    name: string,
    dependencies: Record<string, boolean>
  ): void {
    if (visitedPackages[name]) {
      return;
    }

    visitedPackages[name] = true;

    if (Object.keys(dependencies).length !== 0) {
      Object.keys(dependencies).forEach((dependency) => {
        if (packages[dependency]) {
          visitPackage(dependency, packages[dependency]);
        }
      });
    }

    order.push(name);
  }

  return order;
}
