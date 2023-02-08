const execSync = require('child_process').execSync;

const [_exec, _path, labels, pullRequestNum] = process.argv;

const parsedSemverLabels = JSON.parse(labels).filter(
  (label) => label === 'patch' || label === 'minor' || label === 'major'
);

if (parsedSemverLabels.length !== 1) {
  console.log('Unexpected number of labels. Please add "patch", "minor" or "major" label to the PR.');
  process.exit(1);
}

const version = parsedSemverLabels[0];
const prPrefix = `pr${ pullRequestNum }`;

execSync(`lerna publish --canary "${ version }" --preid "${ prPrefix }" --dist-tag "${ prPrefix }" --yes`, { stdio: 'inherit' });
