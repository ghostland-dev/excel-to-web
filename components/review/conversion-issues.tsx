import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react"

interface ConversionIssuesProps {
  file: {
    path: string
    hasIssues: boolean
    issues?: Array<{
      line: number
      type: string
      message: string
    }>
  }
  issuesSummary: {
    total: number
    critical: number
    warnings: number
    todos: number
  }
}

export function ConversionIssues({ file, issuesSummary }: ConversionIssuesProps) {
  return (
    <div className="p-4">
      <h3 className="mb-4 text-sm font-semibold">Problèmes de conversion</h3>

      {/* Summary */}
      <Card className="mb-4 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold">{issuesSummary.total}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              Critiques
            </span>
            <span className="font-semibold">{issuesSummary.critical}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="h-4 w-4" />
              Avertissements
            </span>
            <span className="font-semibold">{issuesSummary.warnings}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-blue-500">
              <Info className="h-4 w-4" />À faire
            </span>
            <span className="font-semibold">{issuesSummary.todos}</span>
          </div>
        </div>
      </Card>

      {/* File Issues */}
      <div>
        <h4 className="mb-3 text-xs font-medium text-muted-foreground">Fichier actuel</h4>
        {file.hasIssues && file.issues ? (
          <div className="space-y-3">
            {file.issues.map((issue, index) => (
              <Card key={index} className="p-3">
                <div className="mb-2 flex items-center gap-2">
                  {issue.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                  {issue.type === "todo" && <Info className="h-4 w-4 text-blue-500" />}
                  {issue.type === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                  <Badge variant="outline" className="text-xs">
                    Ligne {issue.line}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed">{issue.message}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              <span>Aucun problème détecté</span>
            </div>
          </Card>
        )}
      </div>

      {/* Recommendations */}
      <div className="mt-6">
        <h4 className="mb-3 text-xs font-medium text-muted-foreground">Recommandations</h4>
        <Card className="p-3">
          <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li>• Vérifiez tous les commentaires TODO dans le code</li>
            <li>• Testez les fonctionnalités converties partiellement</li>
            <li>• Remplacez les appels COM par des équivalents web</li>
            <li>• Validez les résultats avec des données réelles</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
