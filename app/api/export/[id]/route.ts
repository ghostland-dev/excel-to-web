import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
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
    const { format } = body

    // Fetch conversion data from database
    const { data: conversion, error } = await supabase
      .from("conversion_results")
      .select("*")
      .eq("project_id", params.id)
      .single()

    if (error || !conversion) {
      return NextResponse.json({ error: "Conversion not found" }, { status: 404 })
    }

    // Verify project ownership
    const { data: project } = await supabase
      .from("projects")
      .select("id, file_name")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Generate export based on format
    let exportData: string
    let contentType: string
    let filename: string

    switch (format) {
      case "zip":
        // In production, create actual ZIP file
        exportData = JSON.stringify(conversion.generated_files, null, 2)
        contentType = "application/zip"
        filename = `${project.file_name.replace(/\.[^/.]+$/, "")}-export.zip`
        break
      case "docker":
        exportData = generateDockerfile(conversion)
        contentType = "text/plain"
        filename = "Dockerfile"
        break
      case "source":
        exportData = JSON.stringify(conversion.generated_files, null, 2)
        contentType = "application/json"
        filename = `${project.file_name.replace(/\.[^/.]+$/, "")}-source.json`
        break
      default:
        return NextResponse.json({ error: "Invalid format" }, { status: 400 })
    }

    // Upload to Blob storage
    const blob = await put(filename, exportData, {
      access: "public",
      contentType,
    })

    return NextResponse.json({
      success: true,
      downloadUrl: blob.url,
      filename,
    })
  } catch (error) {
    console.error("[v0] Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

function generateDockerfile(conversion: any): string {
  return `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
`
}
