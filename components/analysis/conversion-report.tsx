"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ConversionReportProps {
  data: {
    formulas: number
    macros: number
    overall: number
  }
}

export function ConversionReport({ data }: ConversionReportProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Rapport de conversion</h2>
      <Card className="p-6">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Taux de conversion global</span>
            <span className="text-2xl font-bold">{data.overall}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary transition-all" style={{ width: `${data.overall}%` }} />
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <ConversionMetric
            icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
            label="Formules converties"
            value={`${data.formulas}%`}
            status="success"
          />
          <ConversionMetric
            icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
            label="Macros converties"
            value={`${data.macros}%`}
            status="success"
          />
          <ConversionMetric
            icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
            label="Prêt pour tests"
            value="Oui"
            status="success"
          />
        </div>

        <Link href="/conversion/conversion-123">
          <Button className="w-full gap-2">
            Voir les résultats de conversion
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </Card>
    </section>
  )
}

function ConversionMetric({
  icon,
  label,
  value,
  status,
}: {
  icon: React.ReactNode
  label: string
  value: string
  status: "success" | "warning" | "error"
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-4">
      {icon}
      <div>
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
