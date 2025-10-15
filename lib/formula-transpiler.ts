// Formula transpilation logic - converts Excel formulas to JavaScript

export interface TranspiledFormula {
  original: string
  javascript: string
  typescript: string
  dependencies: string[]
  canConvert: boolean
  notes?: string
}

export function transpileFormula(formula: string, cell: string): TranspiledFormula {
  const cleanFormula = formula.startsWith("=") ? formula.substring(1) : formula

  try {
    // Convert Excel formula to JavaScript
    let jsCode = cleanFormula

    // Replace Excel functions with JavaScript equivalents
    jsCode = jsCode.replace(/SUM$$([^)]+)$$/gi, (match, range) => {
      return `sum(${convertRange(range)})`
    })

    jsCode = jsCode.replace(/AVERAGE$$([^)]+)$$/gi, (match, range) => {
      return `average(${convertRange(range)})`
    })

    jsCode = jsCode.replace(/IF$$([^,]+),([^,]+),([^)]+)$$/gi, (match, condition, trueVal, falseVal) => {
      return `(${condition.trim()} ? ${trueVal.trim()} : ${falseVal.trim()})`
    })

    jsCode = jsCode.replace(/VLOOKUP$$([^)]+)$$/gi, (match, args) => {
      return `vlookup(${args})`
    })

    jsCode = jsCode.replace(/CONCATENATE$$([^)]+)$$/gi, (match, args) => {
      return `[${args}].join('')`
    })

    // Replace cell references with data access
    jsCode = jsCode.replace(/([A-Z]+)([0-9]+)/g, (match, col, row) => {
      return `data['${match}']`
    })

    // Replace operators
    jsCode = jsCode.replace(/&/g, "+")

    const dependencies = extractCellReferences(cleanFormula)

    return {
      original: formula,
      javascript: jsCode,
      typescript: `function calculate_${cell.replace(/[^A-Z0-9]/gi, "_")}(data: Record<string, any>): number | string {\n  return ${jsCode}\n}`,
      dependencies,
      canConvert: true,
    }
  } catch (error) {
    return {
      original: formula,
      javascript: "// Could not convert",
      typescript: "// Could not convert",
      dependencies: [],
      canConvert: false,
      notes: "Complex formula requires manual conversion",
    }
  }
}

function convertRange(range: string): string {
  // Convert Excel range notation to array access
  if (range.includes(":")) {
    return `getRange('${range}')`
  }
  return range
}

function extractCellReferences(formula: string): string[] {
  const refs = formula.match(/[A-Z]+[0-9]+/g) || []
  return [...new Set(refs)]
}

// Helper functions that would be included in generated code
export const helperFunctions = `
// Excel-like helper functions
function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0)
}

function average(values: number[]): number {
  return sum(values) / values.length
}

function vlookup(lookupValue: any, tableArray: any[][], colIndex: number, rangeLookup: boolean = false): any {
  for (const row of tableArray) {
    if (row[0] === lookupValue) {
      return row[colIndex - 1]
    }
  }
  return '#N/A'
}

function getRange(range: string): number[] {
  // Implementation would fetch data from the range
  return []
}
`
