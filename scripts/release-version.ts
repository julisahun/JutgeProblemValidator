const { Select, MultiSelect } = require('enquirer')
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

const versions = ['major', 'minor', 'patch']

const version = new Select({
  name: 'version',
  message: 'Select a version:',
  choices: versions
})

async function main() {
    const selectedVersion = await version.run()
    console.log(`Running tests...`)
    // await exec('npm test')
    console.log('Building...')
    await exec('npm run build')
    console.log(`Generating a new ${selectedVersion} version...`)
    await exec(`npm version ${selectedVersion}`)
    console.log('Pushing to git...')
    await exec('git push')
    console.log('Publishing to npm...')
    await exec('npm publish')
}

main()