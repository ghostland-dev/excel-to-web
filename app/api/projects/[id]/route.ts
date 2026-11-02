import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { del } from "@vercel/blob"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch project with analysis results
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select(
        `
        *,
        analysis_results (*)
      `,
      )
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("[v0] Get project error:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    const { data: project, error } = await supabase
      .from("projects")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error || !project) {
      return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error("[v0] Update project error:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch project to get file URL before deletion
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("file_url")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Delete associated records (cascade should handle this, but being explicit)
    await supabase.from("test_results").delete().eq("project_id", params.id)
    await supabase.from("conversion_results").delete().eq("project_id", params.id)
    await supabase.from("analysis_results").delete().eq("project_id", params.id)

    // Delete the project
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", params.id).eq("user_id", user.id)

    if (deleteError) {
      console.error("[v0] Delete project error:", deleteError)
      return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }

    // Delete the file from Blob storage
    if (project.file_url) {
      try {
        await del(project.file_url)
      } catch (blobError) {
        console.error("[v0] Delete blob error:", blobError)
        // Continue even if blob deletion fails
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete project error:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
