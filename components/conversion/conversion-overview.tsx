import { Card } from "@/components/ui/card"
import { CheckCircle2, Code2, Zap } from "lucide-react"

interface ConversionOverviewProps {
  totalFormulas: number
  totalMacros: number
  successRate: number
}

export function ConversionOverview({ totalFormulas, totalMacros, successRate }: ConversionOverviewProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Vue d'ensemble de la conversion</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalFormulas}</p>
              <p className="text-sm text-muted-foreground">Formules converties</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalMacros}</p>
              <p className="text-sm text-muted-foreground">Macros converties</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{successRate}%</p>
              <p className="text-sm text-muted-foreground">Taux de réussite</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
