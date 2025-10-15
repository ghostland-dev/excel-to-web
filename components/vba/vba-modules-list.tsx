"use client"

import { Card } from "@/components/ui/card"
import { FileCode } from "lucide-react"

interface Module {
  id: string
  name: string
  type: string
  procedures: Array<{
    name: string
    type: string
    lines: number
    complexity: string
  }>
}

interface VBAModulesListProps {
  modules: Module[]
  selectedModule: Module
  onSelectModule: (module: Module) => void
}

export function VBAModulesList({ modules, selectedModule, onSelectModule }: VBAModulesListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Modules VBA</h3>
      {modules.map((module) => (
        <Card
          key={module.id}
          className={`cursor-pointer p-4 transition-colors hover:bg-accent ${
            selectedModule.id === module.id ? "border-primary bg-accent" : ""
          }`}
          onClick={() => onSelectModule(module)}
        >
          <div className="mb-2 flex items-center gap-2">
            <FileCode className="h-4 w-4 text-primary" />
            <span className="font-semibold">{module.name}</span>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">{module.type}</p>
          <div className="space-y-1">
            {module.procedures.map((proc, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {proc.type} {proc.name}
                </span>
                <span className="text-muted-foreground">{proc.lines} lignes</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
