"use client"

import { VBAModulesList } from "@/components/vba/vba-modules-list"
import { VBACodeViewer } from "@/components/vba/vba-code-viewer"
import { VBADependencies } from "@/components/vba/vba-dependencies"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function VBAPage({ params }: { params: { id: string } }) {
  const { data: analysisData, error, isLoading } = useSWR(`/api/projects/${params.id}`, fetcher)

  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de l'analyse VBA...</p>
        </div>
      </div>
    )
  }

  if (error || !analysisData?.analysis?.macros) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Aucune macro VBA trouvée dans ce projet</p>
          <Link href={`/analysis/${params.id}`}>
            <Button className="mt-4">Retour à l'analyse</Button>
          </Link>
        </div>
      </div>
    )
  }

  const vbaData = analysisData.analysis.macros
  const selectedModule = vbaData.modules?.[selectedModuleIndex] || vbaData.modules?.[0]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/analysis/${params.id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Analyse VBA</h1>
                <p className="text-sm text-muted-foreground">{analysisData.file_name}</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exporter l'analyse
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar - Modules List */}
          <div>
            <VBAModulesList
              modules={vbaData.modules || []}
              selectedModule={selectedModule}
              onSelectModule={(module) => {
                const index = vbaData.modules.findIndex((m: any) => m.id === module.id)
                setSelectedModuleIndex(index)
              }}
            />
            <div className="mt-6">
              <VBADependencies
                dependencies={vbaData.dependencies || { internal: [], external: [], comReferences: [] }}
              />
            </div>
          </div>

          {/* Main Content - Code Viewer */}
          <div>
            <VBACodeViewer module={selectedModule} />
          </div>
        </div>
      </div>
    </div>
  )
}
