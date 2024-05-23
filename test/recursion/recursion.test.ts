import { readSources, evaluate } from '../test';
import Validator from '../../src/validator';
import verdicts from './verdicts.json';

function validateProgram(programId: string, validator: Validator) {
  let sources = readSources(__dirname + '/sources/' + programId)
  for (let { source, name } of sources) {
    it(`program ${programId} - ${name}`, () => {
      let result = evaluate(source, validator)
      expect(result).toEqual(verdicts[programId][name])
    })
  }
}

describe('should validate recursive programs', () => {
  let validator = new Validator()
  validator.setOptions({ programType: { recursive: true }, mustUseFunctions: [{ name: 'factorial', type: 'int', parameters: [{ type: 'int', name: 'n' }] }] })
  const programs = ['P12509']
  for (let program of programs) {
    validateProgram(program, validator)
  }
})

describe('should validate iterative programs', () => {
  let validator = new Validator()
  validator.setOptions({ programType: { iterative: true, recursive: false } })
  const programs = ['P79817']
  for (let program of programs) {
    validateProgram(program, validator)
  }
})