"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileArchive, Package, Code2 } from "lucide-react"

interface ExportOptionsProps {
  projectName: string
}

export function ExportOptions({ projectName }: ExportOptionsProps) {
  const exportFormats = [
    {
      id: "zip",
      name: "Archive ZIP",
      icon: <FileArchive className="h-5 w-5" />,
      description: "Télécharger tout le projet dans une archive ZIP",
      size: "2.4 MB",
    },
    {
      id: "docker",
      name: "Image Docker",
      icon: <Package className="h-5 w-5" />,
      description: "Générer un Dockerfile et docker-compose.yml",
      size: "Configuration",
    },
    {
      id: "source",
      name: "Code source",
      icon: <Code2 className="h-5 w-5" />,
      description: "Exporter uniquement les fichiers source",
      size: "1.8 MB",
    },
  ]

  const handleExport = (format: string) => {
    console.log("[v0] Exporting project as:", format)
    // In real app, this would trigger download
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Options d'export</h2>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {exportFormats.map((format) => (
          <Card key={format.id} className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
              {format.icon}
            </div>
            <h3 className="mb-2 font-semibold">{format.name}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{format.description}</p>
            <div className="mb-4 text-xs text-muted-foreground">{format.size}</div>
            <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => handleExport(format.id)}>
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          </Card>
        ))}
      </div>

      {/* Additional Export Options */}
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold">Options avancées</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Inclure les dépendances</p>
              <p className="text-xs text-muted-foreground">Ajouter node_modules dans l'export</p>
            </div>
            <input type="checkbox" className="h-4 w-4" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Fichiers de configuration</p>
              <p className="text-xs text-muted-foreground">Inclure .env.example et autres configs</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Documentation</p>
              <p className="text-xs text-muted-foreground">Générer README.md avec instructions</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
        </div>
      </Card>

      {/* Export History */}
      <Card className="mt-6 p-6">
        <h3 className="mb-4 text-sm font-semibold">Historique des exports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              <FileArchive className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{projectName}.zip</p>
                <p className="text-xs text-muted-foreground">15 janvier 2024, 14:30</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </section>
  )
}
