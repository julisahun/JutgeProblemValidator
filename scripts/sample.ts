import Validator from '../src/validator'
import programs from './P79817.json'
import readlineSync from 'readline-sync'


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

function main() {
  let validator = new Validator()
  validator.setOptions({ programType: { iterative: true, recursive: false }, libraries: { prohibited: ['cmath'] } })

  let [valid, invalid, errors] = [[], [], []]
  let n = programs.length
  let i = 0
  for (let source of programs.slice(0, n)) {
    i++
    try {
      let result = validator.validate(source)
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
  }
  let total = n
  let result = `Valid: ${valid.length / total * 100}%, Invalid: ${invalid.length / total * 100}%, Errors: ${errors.length / total * 100}%`
  console.log(result)
  sample(valid, 'valid')
  sample(invalid, 'invalid')
  sample(errors, 'error')
  console.log(result)
}

main()


