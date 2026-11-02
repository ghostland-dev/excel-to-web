import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check database connection
    const { error: dbError } = await supabase.from("projects").select("count").limit(1)

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: dbError ? "unhealthy" : "healthy",
        api: "healthy",
      },
      version: "1.0.0",
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Service check failed",
      },
      { status: 503 },
    )
  }
}
