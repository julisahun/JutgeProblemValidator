import fs from 'node:fs';
import Validator from '../src/validator'



export function readSources(path: string) {
  return fs.readdirSync(path).map(file => ({
    name: file.replace('.cpp', ''),
    source: fs.readFileSync(path + '/' + file, 'utf8')
  }))
}

export function evaluate(source: string, validator: Validator) {
  return validator.validate(source)
}
