import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, CheckCircle2, AlertTriangle } from "lucide-react"

interface TestRunnerProps {
  test: {
    id: string
    name: string
    description: string
    inputs: Array<{ cell: string; value: any }>
    status: "passed" | "failed" | "warning"
  }
  isRunning: boolean
}

export function TestRunner({ test, isRunning }: TestRunnerProps) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="mb-2 text-xl font-bold">{test.name}</h2>
          <p className="text-sm text-muted-foreground">{test.description}</p>
        </div>
        <StatusBadge status={test.status} />
      </div>

      {/* Test Inputs */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">Données d'entrée</h3>
        <div className="space-y-2">
          {test.inputs.map((input, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="font-mono text-sm">{input.cell}</span>
              <Badge variant="secondary">{String(input.value)}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Run Button */}
      <Button className="w-full gap-2" disabled={isRunning}>
        <Play className="h-4 w-4" />
        {isRunning ? "Exécution en cours..." : "Exécuter ce test"}
      </Button>
    </Card>
  )
}

function StatusBadge({ status }: { status: "passed" | "failed" | "warning" }) {
  const config = {
    passed: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: "Réussi",
      className: "bg-green-500/10 text-green-500",
    },
    warning: {
      icon: <AlertTriangle className="h-4 w-4" />,
      label: "Avertissement",
      className: "bg-yellow-500/10 text-yellow-500",
    },
    failed: {
      icon: <AlertTriangle className="h-4 w-4" />,
      label: "Échoué",
      className: "bg-red-500/10 text-red-500",
    },
  }

  const { icon, label, className } = config[status]

  return (
    <Badge className={`flex items-center gap-1.5 ${className}`} variant="secondary">
      {icon}
      {label}
    </Badge>
  )
}
