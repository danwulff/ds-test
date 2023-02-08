const execSync = require('child_process').execSync;

const [_exec, _path, labels, pullRequestNum, commitSha] = process.argv;

const parsedSemverLabels = JSON.parse(labels).filter(
  (label) => label === 'patch' || label === 'minor' || label === 'major'
);

if (parsedSemverLabels.length !== 1) {
  console.log('Unexpected number of labels. Please add "patch", "minor" or "major" label to the PR.');
  process.exit(1);
}

const version = parsedSemverLabels[0];
const distTag = `pr${ pullRequestNum }`;
// Note: ideally preId and distTag would be the same but this issue exists: https://github.com/lerna/lerna/issues/3065
const preId = `${distTag}.${commitSha}`

execSync(`lerna publish --canary "${ version }" --preid "${ preId }" --dist-tag "${ distTag }" --yes`, { stdio: 'inherit' });
