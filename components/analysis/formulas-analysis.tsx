import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"

interface FormulasAnalysisProps {
  formulas: {
    total: number
    converted: number
    partial: number
    failed: number
    types: Array<{
      name: string
      count: number
      status: "success" | "partial" | "failed"
    }>
  }
}

export function FormulasAnalysis({ formulas }: FormulasAnalysisProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Analyse des formules</h2>
      <Card className="p-6">
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{formulas.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-500">{formulas.converted}</p>
            <p className="text-sm text-muted-foreground">Converties</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-500">{formulas.partial}</p>
            <p className="text-sm text-muted-foreground">Partielles</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-500">{formulas.failed}</p>
            <p className="text-sm text-muted-foreground">Échouées</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Types de formules détectées</h3>
          {formulas.types.map((type, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                {type.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                {type.status === "partial" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                {type.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                <span className="font-mono text-sm">{type.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{type.count} occurrences</span>
                <StatusBadge status={type.status} />
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
    success: "Convertie",
    partial: "Partielle",
    failed: "Échouée",
  }

  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>
}
