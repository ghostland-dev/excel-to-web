import { Card } from "@/components/ui/card"
import { Folder, FileCode } from "lucide-react"

interface ProjectStructureProps {
  structure: {
    frontend: string[]
    backend: string[]
    data: string[]
  }
}

export function ProjectStructure({ structure }: ProjectStructureProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Structure du projet généré</h2>
      <Card className="p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Frontend */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Frontend</h3>
            </div>
            <div className="space-y-2">
              {structure.frontend.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-xs">{file}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Backend</h3>
            </div>
            <div className="space-y-2">
              {structure.backend.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-xs">{file}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Models */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Modèles de données</h3>
            </div>
            <div className="space-y-2">
              {structure.data.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-xs">{file}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
