import { analyzerResult } from 'cpp-node-analyzer/src/types';
import defaultOptions from './defaultOptions';
import { ValidatorOptions, Verdict } from './types';
import Analyzer from 'cpp-node-analyzer';

class Validator {
  options: ValidatorOptions;
  verdict: Verdict;
  constructor() {
    this.options = { ...defaultOptions };
    this.verdict = {
      valid: true,
      errors: []
    };
  }

  setOptions(options: ValidatorOptions) {
    this.options = { ...defaultOptions };
    for(let key in options) {
      if (Array.isArray(options[key])) {
        this.options[key] = [...this.options[key],...options[key]];
      } else if ('object' === typeof options[key]) {
        this.options[key] = { ...this.options[key],...options[key] };
      } else {
        this.options[key] = options[key];
      }
    }
  }

  validate(code: string) {
    this.verdict = {
      valid: true,
      errors: []
    };
    const cppNodeAnalyzer = new Analyzer();
    let result: analyzerResult;
    result = cppNodeAnalyzer.analyze(code);
    this.validateLibraries(result);
    this.validateProgramType(result);
    this.validateFunctions(result);
    this.validateProperties(result);
    return this.verdict;
  }

  validateLibraries(result: analyzerResult) {
    let usedLibraries = result.analysis.usedLibraries;
    const { forced: forcedLibraries, prohibited: prohibitedLibraries } = this.options.libraries;
    const usesForcedLibraries = forcedLibraries.every(forcedLibrary => usedLibraries.includes(forcedLibrary));
    if (!usesForcedLibraries) {
      this.verdict.valid = false;
      this.verdict.errors.push('The program does not use all the required libraries');
    }
    const usesProhibitedLibraries = prohibitedLibraries.some(prohibitedLibrary => usedLibraries.includes(prohibitedLibrary));
    if (usesProhibitedLibraries) {
      this.verdict.valid = false;
      this.verdict.errors.push('The program uses a prohibited library');
    }
  }

  validateProgramType(result: analyzerResult) {
    const { programType } = this.options;
    // console.log(programType, result.analysis.isRecursive, result.analysis.isIterative)
    if ('recursive' in programType && programType.recursive !== result.analysis.isRecursive) {
      this.verdict.valid = false;
      this.verdict.errors.push(`The program is ${programType.recursive ? 'not ' : ''}recursive`);
    }
    if ('iterative' in programType && programType.iterative !== result.analysis.isIterative) {
      this.verdict.valid = false;
      this.verdict.errors.push(`The program is ${programType.iterative ? 'not ' : ''}iterative`);
    }
  }

  validateFunctions(result: analyzerResult) {
    const { mustUseFunctions } = this.options;
    const functions = result.analysis.functions;
    const missingFunctions = mustUseFunctions.filter(mustUseFunction => {
      const functionUsed = functions.find(usedFunction => usedFunction.name === mustUseFunction.name);
      if (!functionUsed) return true;

      for (let i = 0; i < mustUseFunction.parameters.length; i++) {
        if (!functionUsed.parameters[i]) return true;
        const { name, type } = mustUseFunction.parameters[i];
        const { name: usedName, type: usedType } = functionUsed.parameters[i];
        if (name !== usedName) return true;
        if (type !== usedType) return true;
      }
      return false;
    })
    if (missingFunctions.length) {
      this.verdict.valid = false;
      this.verdict.errors.push('The program does not use all the required functions: ' + missingFunctions.map(({ name }) => name).join(', '));
    }
  }

  validateProperties(result: analyzerResult) {
    const { forced, prohibited } = this.options.properties;
    const properties = result.analysis.properties;
    const missingProperties = forced.filter(forcedProperty => !properties.some(property => property.name === forcedProperty.name && property.type === forcedProperty.type));
    const prohibitedProperties = prohibited.filter(prohibitedProperty => properties.some(property => property.name === prohibitedProperty.name && property.type === prohibitedProperty.type));
    if (missingProperties.length) {
      this.verdict.valid = false;
      this.verdict.errors.push('The program does not use all the required properties: ' + missingProperties.map(({ name }) => name).join(', '));
    }
    if (prohibitedProperties.length) {
      this.verdict.valid = false;
      this.verdict.errors.push('The program uses a prohibited property: ' + prohibitedProperties.map(({ name }) => name).join(', '));
    }
  }
}

export default Validator;