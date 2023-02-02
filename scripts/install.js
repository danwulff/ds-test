// clambers through all the individual components and installs any dependencies
const { execSync } = require("child_process");
const { readdirSync } = require("fs");

const components = readdirSync("./components", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

components.forEach((directory) => {
  execSync(`cd components/${directory} && npm i`, { stdio: "inherit" });
});
