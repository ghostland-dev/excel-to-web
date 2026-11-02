import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { testCase } = body

    // Verify project ownership
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Simulate test execution
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock test results
    const result = {
      testId: testCase.id,
      status: "passed",
      excelResult: testCase.expectedResult,
      webAppResult: testCase.expectedResult,
      executionTime: Math.floor(Math.random() * 100) + 20,
      difference: 0,
    }

    // Store test result in database
    const { data: testResult, error: insertError } = await supabase
      .from("test_results")
      .insert({
        project_id: params.id,
        test_name: testCase.name,
        status: result.status,
        excel_result: result.excelResult,
        web_result: result.webAppResult,
        execution_time_ms: result.executionTime,
        difference: result.difference,
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Test result insert error:", insertError)
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error("[v0] Test execution error:", error)
    return NextResponse.json({ error: "Test execution failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch test results from database
    const { data: testResults, error } = await supabase
      .from("test_results")
      .select("*")
      .eq("project_id", params.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Fetch test results error:", error)
      return NextResponse.json({ error: "Failed to fetch test results" }, { status: 500 })
    }

    // Transform to expected format
    const testCases = testResults.map((result) => ({
      id: result.id,
      name: result.test_name,
      description: `Test exécuté le ${new Date(result.created_at).toLocaleDateString()}`,
      inputs: [],
      expectedResult: result.excel_result,
      status: result.status,
      executionTime: result.execution_time_ms,
      difference: result.difference,
    }))

    return NextResponse.json({ testCases })
  } catch (error) {
    console.error("[v0] Get test cases error:", error)
    return NextResponse.json({ error: "Failed to fetch test cases" }, { status: 500 })
  }
}
