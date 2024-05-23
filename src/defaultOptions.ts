import { ValidatorOptions } from "./types";
const defaultOptions: ValidatorOptions = {
  libraries: {
    forced: [],
    prohibited: []
  },
  mustUseFunctions: [],
  properties: {
    forced: [],
    prohibited: []
  },
  programType: {}
}

export default defaultOptions;