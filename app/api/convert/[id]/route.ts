import { type NextRequest, NextResponse } from "next/server"
import { transpileFormula, helperFunctions } from "@/lib/formula-transpiler"
import { transpileVBAMacro } from "@/lib/vba-transpiler"
import { createClient } from "@/lib/supabase/server"

// Mock database
const projects = new Map()
const conversions = new Map()

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch project with analysis
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select(
        `
        *,
        analysis_results (*)
      `,
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const analysis = project.analysis_results[0]

    // Transpile formulas
    const formulaMappings = analysis.formulas.map((formula: any) => {
      const transpiled = transpileFormula(formula.formula, formula.cell)
      return {
        sheet: formula.sheet,
        cell: formula.cell,
        original: formula.formula,
        javascript: transpiled.javascript,
        typescript: transpiled.typescript,
        status: transpiled.canConvert ? "success" : "failed",
        notes: transpiled.notes,
      }
    })

    // Transpile macros
    const macroMappings = analysis.macros.map((macro: any) => {
      const transpiled = transpileVBAMacro(macro.code, macro.name)
      return {
        name: macro.name,
        module: macro.module,
        original: macro.code,
        typescript: transpiled.typescript,
        apiEndpoint: transpiled.apiEndpoint,
        status: transpiled.canConvert ? "success" : "failed",
        notes: transpiled.notes,
      }
    })

    // Generate project structure
    const projectStructure = {
      frontend: [
        { path: "app/page.tsx", type: "page", description: "Main dashboard" },
        { path: "components/data-table.tsx", type: "component", description: "Data display component" },
        { path: "lib/calculations.ts", type: "utility", description: "Formula calculations" },
      ],
      backend: [
        { path: "app/api/data/route.ts", type: "api", description: "Data API endpoint" },
        { path: "app/api/calculate/route.ts", type: "api", description: "Calculation endpoint" },
        ...macroMappings.map((m: any) => ({
          path: `app${m.apiEndpoint}/route.ts`,
          type: "api",
          description: `${m.name} macro endpoint`,
        })),
      ],
      database: [{ path: "lib/schema.ts", type: "schema", description: "Data models" }],
    }

    // Generate actual code files
    const generatedFiles = [
      {
        path: "lib/calculations.ts",
        content: `${helperFunctions}\n\n// Generated formula functions\n${formulaMappings.map((f: any) => f.typescript).join("\n\n")}`,
      },
      {
        path: "lib/schema.ts",
        content: generateSchemaCode(analysis.sheets),
      },
      {
        path: "app/api/calculate/route.ts",
        content: generateCalculateAPI(formulaMappings),
      },
    ]

    const conversionResult = {
      id: params.id,
      projectId: params.id,
      status: "completed",
      createdAt: new Date().toISOString(),
      formulaMappings,
      macroMappings,
      projectStructure,
      generatedFiles,
      stats: {
        totalFormulas: formulaMappings.length,
        convertedFormulas: formulaMappings.filter((f: any) => f.status === "success").length,
        totalMacros: macroMappings.length,
        convertedMacros: macroMappings.filter((m: any) => m.status === "success").length,
      },
    }

    const { data: conversion, error: conversionError } = await supabase
      .from("conversion_results")
      .insert({
        project_id: id,
        formula_mappings: formulaMappings,
        macro_mappings: macroMappings,
        generated_files: generatedFiles,
        conversion_stats: conversionResult.stats,
      })
      .select()
      .single()

    if (conversionError) {
      console.error("[v0] Conversion save error:", conversionError)
      return NextResponse.json({ error: "Failed to save conversion" }, { status: 500 })
    }

    // Update project status
    await supabase.from("projects").update({ status: "converted" }).eq("id", id).eq("user_id", user.id)

    return NextResponse.json({
      success: true,
      conversion,
    })
  } catch (error) {
    console.error("[v0] Conversion error:", error)
    return NextResponse.json({ error: "Failed to convert project" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: conversion, error } = await supabase
      .from("conversion_results")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !conversion) {
      return NextResponse.json({ error: "Conversion not found" }, { status: 404 })
    }

    return NextResponse.json({ conversion })
  } catch (error) {
    console.error("[v0] Get conversion error:", error)
    return NextResponse.json({ error: "Failed to fetch conversion" }, { status: 500 })
  }
}

function generateSchemaCode(sheets: any[]): string {
  return `// Generated data models from Excel sheets

${sheets
  .map(
    (sheet: any) => `
export interface ${sheet.name.replace(/[^A-Za-z0-9]/g, "")}Data {
  // Add fields based on sheet structure
  [key: string]: any
}
`,
  )
  .join("\n")}
`
}

function generateCalculateAPI(formulas: any[]): string {
  return `import { NextResponse } from 'next/server'
import * as calculations from '@/lib/calculations'

export async function POST(request: Request) {
  try {
    const { data } = await request.json()
    
    const results = {}
    
    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json(
      { error: 'Calculation failed' },
      { status: 500 }
    )
  }
}
`
}
