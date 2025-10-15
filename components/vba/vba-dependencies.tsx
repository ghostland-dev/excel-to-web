import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle } from "lucide-react"

interface VBADependenciesProps {
  dependencies: {
    internal: string[]
    external: string[]
    comReferences: string[]
  }
}

export function VBADependencies({ dependencies }: VBADependenciesProps) {
  return (
    <Card className="p-4">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <Package className="h-4 w-4" />
        Dépendances
      </h3>

      <div className="space-y-4">
        {/* Internal Dependencies */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Internes</p>
          <div className="space-y-1">
            {dependencies.internal.map((dep, idx) => (
              <div key={idx} className="text-xs">
                {dep}
              </div>
            ))}
          </div>
        </div>

        {/* External Dependencies */}
        {dependencies.external.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Externes</p>
            <div className="space-y-1">
              {dependencies.external.map((dep, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  {dep}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COM References */}
        {dependencies.comReferences.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Références COM</p>
            <div className="space-y-1">
              {dependencies.comReferences.map((ref, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {ref}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
