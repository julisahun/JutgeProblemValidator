import { FunctionObject, PropertyObject } from 'cpp-node-analyzer';

export interface ValidatorOptions {
  libraries?: {
    forced?: string[];
    prohibited?: string[];
  }
  mustUseFunctions?: FunctionObject[];
  properties?: {
    forced?: PropertyObject[];
    prohibited?: PropertyObject[];
  }
  programType?: {
    iterative?: boolean;
    recursive?: boolean;
  }
}

export interface Verdict {
  valid: boolean;
  errors: string[];
}
