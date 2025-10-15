import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

interface Formula {
  original: string
  location: string
  converted: string
  language: string
  status: "success" | "partial" | "failed"
}

interface FormulaMappingProps {
  formulas: Formula[]
}

export function FormulaMapping({ formulas }: FormulaMappingProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Mapping des formules</h2>
      <div className="space-y-4">
        {formulas.map((formula, index) => (
          <Card key={index} className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {formula.location}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {formula.language}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {formula.status === "success" && (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">Converti</span>
                  </>
                )}
                {formula.status === "partial" && (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-500">Partiel</span>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
              {/* Original Formula */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Formule Excel</p>
                <div className="rounded-lg bg-secondary p-3">
                  <code className="text-sm font-mono">{formula.original}</code>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Converted Code */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Code généré</p>
                <div className="rounded-lg bg-secondary p-3">
                  <code className="text-sm font-mono">{formula.converted}</code>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
