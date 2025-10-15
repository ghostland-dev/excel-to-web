"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, ExternalLink } from "lucide-react"
import Link from "next/link"

interface MacrosAnalysisProps {
  macros: {
    total: number
    converted: number
    partial: number
    failed: number
    modules: Array<{
      name: string
      procedures: number
      lines: number
      status: "success" | "partial" | "failed"
    }>
  }
}

export function MacrosAnalysis({ macros }: MacrosAnalysisProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analyse des macros VBA</h2>
        <Link href="/vba/vba-123">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            Voir le détail
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </div>
      <Card className="p-6">
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{macros.total}</p>
            <p className="text-sm text-muted-foreground">Modules</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-500">{macros.converted}</p>
            <p className="text-sm text-muted-foreground">Convertis</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-500">{macros.partial}</p>
            <p className="text-sm text-muted-foreground">Partiels</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-500">{macros.failed}</p>
            <p className="text-sm text-muted-foreground">Échoués</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Modules VBA détectés</h3>
          {macros.modules.map((module, index) => (
            <div key={index} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{module.name}</span>
                </div>
                <StatusBadge status={module.status} />
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span>{module.procedures} procédures</span>
                <span>{module.lines} lignes de code</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

function StatusBadge({ status }: { status: "success" | "partial" | "failed" }) {
  const styles = {
    success: "bg-green-500/10 text-green-500",
    partial: "bg-yellow-500/10 text-yellow-500",
    failed: "bg-red-500/10 text-red-500",
  }

  const labels = {
    success: "Converti",
    partial: "Partiel",
    failed: "Échoué",
  }

  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>
}
