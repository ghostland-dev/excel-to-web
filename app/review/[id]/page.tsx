"use client"

import { CodeEditor } from "@/components/review/code-editor"
import { ConversionIssues } from "@/components/review/conversion-issues"
import { FileTree } from "@/components/review/file-tree"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ReviewPage({ params }: { params: { id: string } }) {
  const { data: conversionData, error, isLoading } = useSWR(`/api/convert/${params.id}`, fetcher)
  const { data: projectData } = useSWR(`/api/projects/${params.id}`, fetcher)

  const [selectedFileIndex, setSelectedFileIndex] = useState(0)
  const [code, setCode] = useState("")

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du code généré...</p>
        </div>
      </div>
    )
  }

  if (error || !conversionData?.generatedFiles) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Aucun code généré trouvé</p>
          <Link href={`/conversion/${params.id}`}>
            <Button className="mt-4">Lancer la conversion</Button>
          </Link>
        </div>
      </div>
    )
  }

  const files = conversionData.generatedFiles
  const selectedFile = files[selectedFileIndex] || files[0]

  if (code === "" && selectedFile) {
    setCode(selectedFile.code)
  }

  const handleFileSelect = (file: any) => {
    const index = files.findIndex((f: any) => f.id === file.id)
    setSelectedFileIndex(index)
    setCode(file.code)
  }

  const handleSave = async () => {
    console.log("[v0] Saving changes for:", selectedFile.path)
    try {
      await fetch(`/api/convert/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: selectedFile.id,
          code,
        }),
      })
    } catch (err) {
      console.error("[v0] Save error:", err)
    }
  }

  const issuesSummary = {
    total: files.reduce((acc: number, f: any) => acc + (f.issues?.length || 0), 0),
    critical: 0,
    warnings: files.reduce(
      (acc: number, f: any) => acc + (f.issues?.filter((i: any) => i.type === "warning").length || 0),
      0,
    ),
    todos: files.reduce(
      (acc: number, f: any) => acc + (f.issues?.filter((i: any) => i.type === "todo").length || 0),
      0,
    ),
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/conversion/${params.id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Revue et édition</h1>
                <p className="text-xs text-muted-foreground">{projectData?.file_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              <Button size="sm" className="gap-2" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - File Tree */}
        <div className="w-64 border-r border-border bg-card overflow-y-auto">
          <FileTree files={files} selectedFile={selectedFile} onSelectFile={handleFileSelect} />
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor file={selectedFile} code={code} onCodeChange={setCode} />
        </div>

        {/* Right Sidebar - Issues */}
        <div className="w-80 border-l border-border bg-card overflow-y-auto">
          <ConversionIssues file={selectedFile} issuesSummary={issuesSummary} />
        </div>
      </div>
    </div>
  )
}
