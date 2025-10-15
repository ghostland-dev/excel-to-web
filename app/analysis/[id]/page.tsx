"use client"

import { AnalysisOverview } from "@/components/analysis/analysis-overview"
import { SheetsAnalysis } from "@/components/analysis/sheets-analysis"
import { FormulasAnalysis } from "@/components/analysis/formulas-analysis"
import { MacrosAnalysis } from "@/components/analysis/macros-analysis"
import { ConversionReport } from "@/components/analysis/conversion-report"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { useRouter } from "next/navigation"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AnalysisPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const { data, error, isLoading } = useSWR(`/api/projects/${params.id}`, fetcher)

  const handleConvert = async () => {
    // Navigate to conversion page
    router.push(`/conversion/${params.id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data?.project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Projet non trouvé</h2>
          <p className="text-muted-foreground mb-6">Le projet demandé n'existe pas ou a été supprimé</p>
          <Link href="/projects">
            <Button>Retour aux projets</Button>
          </Link>
        </div>
      </div>
    )
  }

  const project = data.project
  const analysis = project.analysis

  const analysisData = {
    id: analysis.id,
    fileName: analysis.fileName,
    fileSize: analysis.fileSize / (1024 * 1024), // Convert to MB
    uploadedAt: analysis.uploadedAt,
    status: project.status,
    sheets: analysis.sheets.map((sheet: any) => ({
      name: sheet.name,
      rows: sheet.rowCount,
      columns: sheet.columnCount,
      formulas: analysis.formulas.filter((f: any) => f.sheet === sheet.name).length,
      namedRanges: analysis.namedRanges.filter((nr: any) => nr.sheet === sheet.name).length,
      tables: sheet.tables.length,
    })),
    formulas: {
      total: analysis.formulas.length,
      converted: analysis.formulas.filter((f: any) => f.canConvert).length,
      partial: 0,
      failed: analysis.formulas.filter((f: any) => !f.canConvert).length,
      types: Object.entries(
        analysis.formulas.reduce((acc: any, f: any) => {
          acc[f.type] = (acc[f.type] || 0) + 1
          return acc
        }, {}),
      ).map(([name, count]) => ({
        name,
        count,
        status: "success" as const,
      })),
    },
    macros: {
      total: analysis.macros.length,
      converted: analysis.macros.filter((m: any) => m.canConvert).length,
      partial: 0,
      failed: analysis.macros.filter((m: any) => !m.canConvert).length,
      modules: analysis.macros.map((m: any) => ({
        name: m.module,
        procedures: 1,
        lines: m.lineCount,
        status: m.canConvert ? ("success" as const) : ("failed" as const),
      })),
    },
    conversionRate: {
      formulas: analysis.conversionReport.estimatedConversionRate,
      macros:
        analysis.macros.length > 0
          ? Math.round((analysis.macros.filter((m: any) => m.canConvert).length / analysis.macros.length) * 100)
          : 100,
      overall: analysis.conversionReport.estimatedConversionRate,
    },
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/projects">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{analysisData.fileName}</h1>
                <p className="text-sm text-muted-foreground">
                  Analysé le {new Date(analysisData.uploadedAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
            <Button size="lg" className="gap-2" onClick={handleConvert}>
              <Play className="h-4 w-4" />
              Lancer la conversion
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Overview */}
          <AnalysisOverview data={analysisData} />

          {/* Conversion Report */}
          <ConversionReport data={analysisData.conversionRate} />

          {/* Sheets Analysis */}
          <SheetsAnalysis sheets={analysisData.sheets} />

          {/* Formulas Analysis */}
          <FormulasAnalysis formulas={analysisData.formulas} />

          {/* Macros Analysis */}
          <MacrosAnalysis macros={analysisData.macros} />
        </div>
      </div>
    </div>
  )
}
