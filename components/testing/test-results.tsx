import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react"

interface TestResultsProps {
  test: {
    name: string
    excelResult: any
    webAppResult: any
    status: "passed" | "failed" | "warning"
    executionTime: number
    difference?: number
  }
}

export function TestResults({ test }: TestResultsProps) {
  const resultsMatch = test.excelResult === test.webAppResult

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Résultats de comparaison</h3>

      {/* Comparison Grid */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {/* Excel Result */}
        <div className="rounded-lg border border-border p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Résultat Excel</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{String(test.excelResult)}</span>
          </div>
        </div>

        {/* Web App Result */}
        <div className="rounded-lg border border-border p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Résultat Application Web</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{String(test.webAppResult)}</span>
            {resultsMatch ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
          <span className="text-sm font-medium">Statut</span>
          <div className="flex items-center gap-2">
            {test.status === "passed" && (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Test réussi</span>
              </>
            )}
            {test.status === "warning" && (
              <>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-500">Différence mineure détectée</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
          <span className="text-sm font-medium">Temps d'exécution</span>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{test.executionTime}ms</span>
          </div>
        </div>

        {test.difference !== undefined && (
          <div className="flex items-center justify-between rounded-lg bg-yellow-500/10 p-3">
            <span className="text-sm font-medium">Différence</span>
            <Badge variant="outline" className="text-yellow-500">
              ±{test.difference}
            </Badge>
          </div>
        )}
      </div>

      {/* Additional Info */}
      {test.status === "warning" && (
        <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-sm text-yellow-500">
            Une différence mineure a été détectée. Cela peut être dû à des arrondis ou des différences de précision
            numérique. Vérifiez si cette différence est acceptable pour votre cas d'usage.
          </p>
        </div>
      )}
    </Card>
  )
}
