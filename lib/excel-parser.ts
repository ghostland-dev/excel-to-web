import * as XLSX from "xlsx"

export interface ExcelAnalysis {
  id: string
  fileName: string
  fileSize: number
  uploadedAt: string
  sheets: SheetAnalysis[]
  formulas: FormulaAnalysis[]
  macros: MacroAnalysis[]
  namedRanges: NamedRange[]
  conversionReport: ConversionReport
}

export interface SheetAnalysis {
  name: string
  rowCount: number
  columnCount: number
  hasFormulas: boolean
  hasMacros: boolean
  tables: TableInfo[]
}

export interface TableInfo {
  name: string
  range: string
  columns: string[]
}

export interface FormulaAnalysis {
  sheet: string
  cell: string
  formula: string
  type: "math" | "lookup" | "text" | "date" | "logical" | "financial"
  complexity: "simple" | "medium" | "complex"
  canConvert: boolean
  dependencies: string[]
}

export interface MacroAnalysis {
  name: string
  type: "Sub" | "Function"
  module: string
  lineCount: number
  complexity: number
  canConvert: boolean
  dependencies: string[]
  code: string
}

export interface NamedRange {
  name: string
  range: string
  sheet: string
}

export interface ConversionReport {
  totalFormulas: number
  convertibleFormulas: number
  totalMacros: number
  convertibleMacros: number
  estimatedConversionRate: number
  issues: ConversionIssue[]
}

export interface ConversionIssue {
  type: "warning" | "error"
  category: "formula" | "macro" | "external" | "unsupported"
  message: string
  location?: string
}

export async function parseExcelFile(buffer: ArrayBuffer): Promise<ExcelAnalysis> {
  const workbook = XLSX.read(buffer, { type: "array", cellFormula: true })

  const sheets: SheetAnalysis[] = []
  const formulas: FormulaAnalysis[] = []
  const namedRanges: NamedRange[] = []
  const macros: MacroAnalysis[] = []

  // Parse each sheet
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName]
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")

    let hasFormulas = false
    const sheetFormulas: FormulaAnalysis[] = []

    // Scan for formulas
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
        const cell = worksheet[cellAddress]

        if (cell && cell.f) {
          hasFormulas = true
          const formula = cell.f
          const formulaType = detectFormulaType(formula)
          const complexity = detectComplexity(formula)

          sheetFormulas.push({
            sheet: sheetName,
            cell: cellAddress,
            formula: formula,
            type: formulaType,
            complexity: complexity,
            canConvert: canConvertFormula(formula),
            dependencies: extractDependencies(formula),
          })
        }
      }
    }

    formulas.push(...sheetFormulas)

    sheets.push({
      name: sheetName,
      rowCount: range.e.r - range.s.r + 1,
      columnCount: range.e.c - range.s.c + 1,
      hasFormulas,
      hasMacros: false,
      tables: [],
    })
  })

  // Parse named ranges
  if (workbook.Workbook?.Names) {
    workbook.Workbook.Names.forEach((name) => {
      namedRanges.push({
        name: name.Name,
        range: name.Ref,
        sheet: name.Sheet?.toString() || "Global",
      })
    })
  }

  // Check for VBA macros (basic detection)
  if (workbook.vbaraw) {
    macros.push(...parseVBAMacros(workbook.vbaraw))
  }

  // Generate conversion report
  const convertibleFormulas = formulas.filter((f) => f.canConvert).length
  const convertibleMacros = macros.filter((m) => m.canConvert).length

  const conversionReport: ConversionReport = {
    totalFormulas: formulas.length,
    convertibleFormulas,
    totalMacros: macros.length,
    convertibleMacros,
    estimatedConversionRate: formulas.length > 0 ? Math.round((convertibleFormulas / formulas.length) * 100) : 100,
    issues: generateConversionIssues(formulas, macros),
  }

  return {
    id: generateId(),
    fileName: "uploaded-file.xlsx",
    fileSize: buffer.byteLength,
    uploadedAt: new Date().toISOString(),
    sheets,
    formulas,
    macros,
    namedRanges,
    conversionReport,
  }
}

function detectFormulaType(formula: string): FormulaAnalysis["type"] {
  const upperFormula = formula.toUpperCase()
  if (/SUM|AVERAGE|COUNT|MAX|MIN|PRODUCT/.test(upperFormula)) return "math"
  if (/VLOOKUP|HLOOKUP|INDEX|MATCH|XLOOKUP/.test(upperFormula)) return "lookup"
  if (/CONCATENATE|TEXT|LEFT|RIGHT|MID|LEN/.test(upperFormula)) return "text"
  if (/DATE|TODAY|NOW|YEAR|MONTH|DAY/.test(upperFormula)) return "date"
  if (/IF|AND|OR|NOT|IFS/.test(upperFormula)) return "logical"
  if (/PMT|FV|PV|RATE|NPV|IRR/.test(upperFormula)) return "financial"
  return "math"
}

function detectComplexity(formula: string): "simple" | "medium" | "complex" {
  const nestingLevel = (formula.match(/\(/g) || []).length
  const length = formula.length

  if (nestingLevel <= 2 && length < 50) return "simple"
  if (nestingLevel <= 4 && length < 150) return "medium"
  return "complex"
}

function canConvertFormula(formula: string): boolean {
  const upperFormula = formula.toUpperCase()
  // List of unsupported functions
  const unsupported = ["GETPIVOTDATA", "CUBE", "RTD", "HYPERLINK"]
  return !unsupported.some((fn) => upperFormula.includes(fn))
}

function extractDependencies(formula: string): string[] {
  const cellRefs = formula.match(/[A-Z]+[0-9]+/g) || []
  return [...new Set(cellRefs)]
}

function parseVBAMacros(vbaraw: any): MacroAnalysis[] {
  // Basic VBA parsing - in production, use a proper VBA parser
  const macros: MacroAnalysis[] = []

  // Mock macro for demonstration
  macros.push({
    name: "CalculateTotal",
    type: "Function",
    module: "Module1",
    lineCount: 15,
    complexity: 3,
    canConvert: true,
    dependencies: ["Worksheet", "Range"],
    code: "Function CalculateTotal()\n  // VBA code here\nEnd Function",
  })

  return macros
}

function generateConversionIssues(formulas: FormulaAnalysis[], macros: MacroAnalysis[]): ConversionIssue[] {
  const issues: ConversionIssue[] = []

  const unconvertibleFormulas = formulas.filter((f) => !f.canConvert)
  if (unconvertibleFormulas.length > 0) {
    issues.push({
      type: "warning",
      category: "formula",
      message: `${unconvertibleFormulas.length} formulas contain unsupported functions`,
      location: unconvertibleFormulas[0].cell,
    })
  }

  const complexFormulas = formulas.filter((f) => f.complexity === "complex")
  if (complexFormulas.length > 0) {
    issues.push({
      type: "warning",
      category: "formula",
      message: `${complexFormulas.length} complex formulas may require manual review`,
    })
  }

  const unconvertibleMacros = macros.filter((m) => !m.canConvert)
  if (unconvertibleMacros.length > 0) {
    issues.push({
      type: "error",
      category: "macro",
      message: `${unconvertibleMacros.length} macros cannot be automatically converted`,
    })
  }

  return issues
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}
