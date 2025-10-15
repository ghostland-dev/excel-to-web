import type React from "react"
import { Card } from "@/components/ui/card"
import { FileSpreadsheet, Table2, Calculator, Code2 } from "lucide-react"

interface AnalysisOverviewProps {
  data: {
    fileName: string
    fileSize: number
    sheets: Array<{ name: string }>
    formulas: { total: number }
    macros: { total: number }
  }
}

export function AnalysisOverview({ data }: AnalysisOverviewProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Vue d'ensemble</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FileSpreadsheet className="h-5 w-5" />}
          label="Taille du fichier"
          value={`${data.fileSize} Mo`}
        />
        <StatCard icon={<Table2 className="h-5 w-5" />} label="Feuilles" value={data.sheets.length.toString()} />
        <StatCard icon={<Calculator className="h-5 w-5" />} label="Formules" value={data.formulas.total.toString()} />
        <StatCard icon={<Code2 className="h-5 w-5" />} label="Macros VBA" value={data.macros.total.toString()} />
      </div>
    </section>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  )
}
