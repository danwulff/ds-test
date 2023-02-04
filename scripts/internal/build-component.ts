import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

export function buildComponent(name: string): void {
  const tempTSConfig = JSON.parse(
    readFileSync(`components/ds-tsconfig.component.json`, "utf-8").replaceAll(
      "{{name}}",
      name
    )
  );
  writeFileSync(
    `components/${name}/tsconfig.component.json`,
    JSON.stringify(tempTSConfig)
  );

  execSync(`npx tsc --project components/${name}/tsconfig.component.json`, {
    stdio: "inherit",
  });
}
