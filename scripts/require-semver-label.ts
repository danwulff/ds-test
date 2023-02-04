const [_exec, _path, labels] = process.argv;

const parsedSemverLabels = JSON.parse(labels).filter(
  (label: string) => label === "patch" || label === "minor" || label === "major"
);

if (parsedSemverLabels.length === 1) {
  process.exit(0);
}

console.log(
  'Unexpected number of labels. Please add "patch", "minor" or "major" label to the PR.'
);
process.exit(1);
