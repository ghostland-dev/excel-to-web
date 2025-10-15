import { Card } from "@/components/ui/card"
import { Table2 } from "lucide-react"

interface Sheet {
  name: string
  rows: number
  columns: number
  formulas: number
  namedRanges: number
  tables: number
}

interface SheetsAnalysisProps {
  sheets: Sheet[]
}

export function SheetsAnalysis({ sheets }: SheetsAnalysisProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Structure des feuilles</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sheets.map((sheet, index) => (
          <Card key={index} className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Table2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{sheet.name}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lignes</span>
                <span className="font-medium">{sheet.rows.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Colonnes</span>
                <span className="font-medium">{sheet.columns}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Formules</span>
                <span className="font-medium">{sheet.formulas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plages nommées</span>
                <span className="font-medium">{sheet.namedRanges}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tableaux</span>
                <span className="font-medium">{sheet.tables}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
