"use client"

import { ConversionOverview } from "@/components/conversion/conversion-overview"
import { FormulaMapping } from "@/components/conversion/formula-mapping"
import { MacroMapping } from "@/components/conversion/macro-mapping"
import { ProjectStructure } from "@/components/conversion/project-structure"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Download, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ConversionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isConverting, setIsConverting] = useState(false)

  const { data, error, isLoading, mutate } = useSWR(`/api/convert/${params.id}`, fetcher)

  useEffect(() => {
    if (!isLoading && !data && !error && !isConverting) {
      setIsConverting(true)
      fetch(`/api/convert/${params.id}`, { method: "POST" })
        .then(() => {
          mutate()
          setIsConverting(false)
        })
        .catch(() => setIsConverting(false))
    }
  }, [isLoading, data, error, isConverting, params.id, mutate])

  const handleTest = () => {
    router.push(`/testing/${params.id}`)
  }

  const handleDownload = () => {
    // Download generated project as ZIP
    const blob = new Blob([JSON.stringify(data?.conversion, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `conversion-${params.id}.json`
    a.click()
  }

  if (isLoading || isConverting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Conversion en cours...</p>
        </div>
      </div>
    )
  }

  if (error || !data?.conversion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erreur de conversion</h2>
          <p className="text-muted-foreground mb-6">Impossible de convertir le projet</p>
          <Link href={`/analysis/${params.id}`}>
            <Button>Retour à l'analyse</Button>
          </Link>
        </div>
      </div>
    )
  }

  const conversion = data.conversion

  const conversionData = {
    fileName: conversion.projectId,
    status: conversion.status,
    generatedAt: conversion.createdAt,
    formulas: conversion.formulaMappings.map((f: any) => ({
      original: f.original,
      location: `${f.sheet}!${f.cell}`,
      converted: f.javascript,
      language: "JavaScript",
      status: f.status,
    })),
    macros: conversion.macroMappings.map((m: any) => ({
      original: m.name,
      type: m.module,
      converted: m.name,
      language: "TypeScript",
      endpoint: m.apiEndpoint,
      status: m.status,
      code: m.typescript,
    })),
    projectStructure: conversion.projectStructure,
  }

  const successRate = Math.round(
    ((conversion.stats.convertedFormulas + conversion.stats.convertedMacros) /
      (conversion.stats.totalFormulas + conversion.stats.totalMacros)) *
      100,
  )

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
                <h1 className="text-2xl font-bold">Résultats de conversion</h1>
                <p className="text-sm text-muted-foreground">Projet {conversion.projectId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="gap-2" onClick={handleTest}>
                <Play className="h-4 w-4" />
                Tester l'application
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Overview */}
          <ConversionOverview
            totalFormulas={conversion.stats.totalFormulas}
            totalMacros={conversion.stats.totalMacros}
            successRate={successRate}
          />

          {/* Formula Mapping */}
          <FormulaMapping formulas={conversionData.formulas} />

          {/* Macro Mapping */}
          <MacroMapping macros={conversionData.macros} />

          {/* Project Structure */}
          <ProjectStructure structure={conversionData.projectStructure} />
        </div>
      </div>
    </div>
  )
}
