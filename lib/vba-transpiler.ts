// VBA to TypeScript transpilation

export interface TranspiledMacro {
  original: string
  typescript: string
  apiEndpoint: string
  canConvert: boolean
  notes?: string
}

export function transpileVBAMacro(vbaCode: string, macroName: string): TranspiledMacro {
  try {
    let tsCode = vbaCode

    // Convert VBA syntax to TypeScript
    tsCode = tsCode.replace(/Sub\s+(\w+)\s*\(/gi, "export async function $1(")
    tsCode = tsCode.replace(/Function\s+(\w+)\s*\(/gi, "export async function $1(")
    tsCode = tsCode.replace(/End Sub/gi, "}")
    tsCode = tsCode.replace(/End Function/gi, "}")

    // Convert variable declarations
    tsCode = tsCode.replace(/Dim\s+(\w+)\s+As\s+(\w+)/gi, "let $1: $2")

    // Convert types
    tsCode = tsCode.replace(/As String/gi, ": string")
    tsCode = tsCode.replace(/As Integer/gi, ": number")
    tsCode = tsCode.replace(/As Long/gi, ": number")
    tsCode = tsCode.replace(/As Double/gi, ": number")
    tsCode = tsCode.replace(/As Boolean/gi, ": boolean")

    // Convert common VBA functions
    tsCode = tsCode.replace(/MsgBox\s+/gi, "console.log(")
    tsCode = tsCode.replace(/Range$$"([^"]+)"$$\.Value/gi, 'data["$1"]')

    const apiEndpoint = `/api/macros/${macroName.toLowerCase()}`

    return {
      original: vbaCode,
      typescript: tsCode,
      apiEndpoint,
      canConvert: true,
    }
  } catch (error) {
    return {
      original: vbaCode,
      typescript: "// Could not convert - requires manual implementation",
      apiEndpoint: "",
      canConvert: false,
      notes: "VBA macro uses features that cannot be automatically converted",
    }
  }
}
