import Validator from '../src/validator'
import readlineSync from 'readline-sync'
const { Select, Input } = require('enquirer');
import fs from 'fs'

async function loadSamples() {
  const fileNames = fs.readdirSync('./scripts/sources/')

  const selector = await new Select({
    name: 'sample',
    message: 'Select a sample:',
    choices: fileNames
  })

  const prompt = new Input({
    message: 'How many programs do you want to validate? (default: all)'
  });
  let selectedFile = await selector.run()
  let n = await prompt.run()
  let programs = JSON.parse(fs.readFileSync(`./scripts/sources/${selectedFile}`, 'utf-8'))
  if (!n) n = programs.length
  n = Math.max(0, n)
  n = Math.min(n, programs.length)
  if (typeof programs[0] !== 'string' && typeof programs[0].code === 'string')
    programs = programs.map((p: any) => p.code)
  return { n, programs, selectedFile }
}

function sample(programs: string[], name: string) {
  let res = readlineSync.question(`Do you want to see the ${name} programs? (y/n)`)
  if (res === 'y') {
    let keep = true
    do {
      let i = Math.floor(Math.random() * programs.length)
      console.log(programs[i])
      keep = readlineSync.question(`Do you want to see another ${name} program? (y/n)`) === 'y'
    } while (keep)
  }
}

async function main() {
  let validator = new Validator()
  validator.setOptions({ libraries: { prohibited: ['string'] } })

  let [valid, invalid, errors] = [[], [], []]
  let { n, programs, selectedFile } = await loadSamples()
  console.log(`Validating ${n} programs from ${selectedFile}...`)
  let i = 0
  for (let source of programs.slice(0, n)) {
    i++
    try {
      let result = await validator.validate(source)
      if (result.valid) valid.push(source)
      else invalid.push(source)
    } catch (e) {
      if (e.message.includes('This code is not analyzable') || e.message.includes('Error preprocessing code')) { }
      else {
        console.log({ source, error: e })
      }
      errors.push(source)
    }
    if (i % 100 === 0) console.log(`${i}/${n} programs validated`)
    if (i % 1000 === 0) console.log(`Valid: ${(valid.length / i * 100).toFixed(2)}%, Invalid: ${(invalid.length / i * 100).toFixed(2)}%, Errors: ${(errors.length / i * 100).toFixed(2)}%`)
  }
  let total = n
  let result = `Valid: ${(valid.length / total * 100).toFixed(2)}%, Invalid: ${(invalid.length / total * 100).toFixed(2)}%, Errors: ${(errors.length / total * 100).toFixed(2)}%`
  console.log(result)
  sample(valid, 'valid')
  sample(invalid, 'invalid')
  sample(errors, 'error')
  console.log(result)
}

main()
