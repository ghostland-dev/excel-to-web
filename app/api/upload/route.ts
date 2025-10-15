import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { parseExcelFile } from "@/lib/excel-parser"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
    ]

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx?|xlsm)$/i)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an Excel file (.xls, .xlsx, .xlsm)" },
        { status: 400 },
      )
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 100MB" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    })

    // Parse Excel file
    const arrayBuffer = await file.arrayBuffer()
    const analysis = await parseExcelFile(arrayBuffer)

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name: file.name,
        file_name: file.name,
        file_url: blob.url,
        file_size: file.size,
        status: "analyzed",
      })
      .select()
      .single()

    if (projectError) {
      console.error("[v0] Project creation error:", projectError)
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    const { error: analysisError } = await supabase.from("analysis_results").insert({
      project_id: project.id,
      sheets: analysis.sheets,
      formulas: analysis.formulas,
      macros: analysis.macros,
      named_ranges: analysis.namedRanges || [],
      dependencies: analysis.dependencies || {},
      conversion_readiness: {
        formulasReady: analysis.formulas.filter((f: any) => f.canConvert).length,
        macrosReady: analysis.macros.filter((m: any) => m.canConvert).length,
        totalFormulas: analysis.formulas.length,
        totalMacros: analysis.macros.length,
      },
    })

    if (analysisError) {
      console.error("[v0] Analysis creation error:", analysisError)
      return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      projectId: project.id,
      project,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}

export const runtime = "nodejs"
