import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { platform, environment } = body

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

    // Simulate deployment
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const deployment = {
      projectId: params.id,
      platform,
      environment,
      status: "active",
      url: `https://project-${params.id}.vercel.app`,
      deployedAt: new Date().toISOString(),
      version: "v1.0.0",
    }

    // Update project status
    await supabase
      .from("projects")
      .update({
        status: "deployed",
        deployed_url: deployment.url,
      })
      .eq("id", params.id)

    return NextResponse.json({
      success: true,
      deployment,
    })
  } catch (error) {
    console.error("[v0] Deployment error:", error)
    return NextResponse.json({ error: "Deployment failed" }, { status: 500 })
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

    // Fetch project deployment info
    const { data: project, error } = await supabase
      .from("projects")
      .select("deployed_url, status, updated_at")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const deployments = project.deployed_url
      ? [
          {
            id: "deploy-1",
            environment: "Production",
            url: project.deployed_url,
            status: project.status === "deployed" ? "active" : "inactive",
            deployedAt: project.updated_at,
            version: "v1.0.0",
          },
        ]
      : []

    return NextResponse.json({ deployments })
  } catch (error) {
    console.error("[v0] Get deployments error:", error)
    return NextResponse.json({ error: "Failed to fetch deployments" }, { status: 500 })
  }
}
