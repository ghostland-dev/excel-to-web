"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Loader2,
  Trash2,
  Download,
} from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const statusConfig = {
  analyzed: { label: "Analysé", color: "bg-blue-500/10 text-blue-500", icon: CheckCircle2 },
  converting: { label: "En conversion", color: "bg-yellow-500/10 text-yellow-500", icon: Clock },
  completed: { label: "Terminé", color: "bg-green-500/10 text-green-500", icon: CheckCircle2 },
  failed: { label: "Échec", color: "bg-red-500/10 text-red-500", icon: AlertCircle },
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ProjectsPage() {
  const { data, error, isLoading, mutate } = useSWR("/api/projects", fetcher, {
    refreshInterval: 5000,
  })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) {
      return
    }

    try {
      setDeletingId(projectId)
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      // Refresh the projects list
      mutate()
    } catch (error) {
      console.error("[v0] Delete project error:", error)
      alert("Erreur lors de la suppression du projet")
    } finally {
      setDeletingId(null)
    }
  }

  const handleExport = async (projectId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const response = await fetch(`/api/export/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "zip" }),
      })

      const data = await response.json()
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank")
      }
    } catch (error) {
      console.error("[v0] Export project error:", error)
      alert("Erreur lors de l'export du projet")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-gray-400">Erreur lors du chargement des projets</p>
          </div>
        </div>
      </div>
    )
  }

  const projects = data?.projects || []

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mes Projets</h1>
          <p className="text-gray-400">Gérez vos conversions Excel vers Web</p>
        </div>

        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun projet</h3>
            <p className="text-muted-foreground mb-6">Commencez par télécharger un fichier Excel</p>
            <Link href="/">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Télécharger un fichier
              </button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {projects.map((project: any) => {
              const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.analyzed
              const StatusIcon = status.icon
              const analysis = project.analysis

              return (
                <Card key={project.id} className="p-6 hover:bg-white/5 transition-colors group">
                  <div className="flex items-start justify-between">
                    <Link href={`/analysis/${project.id}`} className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <FileSpreadsheet className="h-6 w-6 text-blue-500" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{project.name}</h3>
                          <Badge className={status.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <span>Uploadé le {new Date(project.createdAt).toLocaleDateString("fr-FR")}</span>
                          <span>{analysis?.formulas?.length || 0} formules</span>
                          <span>{analysis?.macros?.length || 0} macros</span>
                          {analysis?.conversionReport && (
                            <span className="text-blue-500 font-medium">
                              {analysis.conversionReport.estimatedConversionRate}% converti
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => handleExport(project.id, e)}>
                          <Download className="mr-2 h-4 w-4" />
                          Exporter
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => handleDelete(project.id, e)}
                          disabled={deletingId === project.id}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deletingId === project.id ? "Suppression..." : "Supprimer"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
