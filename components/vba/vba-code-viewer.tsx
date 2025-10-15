"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Code2, List } from "lucide-react"

interface VBACodeViewerProps {
  module: {
    name: string
    type: string
    procedures: Array<{
      name: string
      type: string
      lines: number
      complexity: string
      dependencies: string[]
    }>
    code: string
    parsed: {
      variables: Array<{
        name: string
        type: string
        scope: string
      }>
      externalCalls: string[]
      controlStructures: string[]
    }
  }
}

export function VBACodeViewer({ module }: VBACodeViewerProps) {
  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div>
        <h2 className="mb-2 text-2xl font-bold">{module.name}</h2>
        <p className="text-sm text-muted-foreground">{module.type}</p>
      </div>

      {/* Procedures Overview */}
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold">Procédures détectées</h3>
        <div className="space-y-3">
          {module.procedures.map((proc, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Code2 className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">
                    {proc.type} {proc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{proc.lines} lignes de code</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ComplexityBadge complexity={proc.complexity} />
                <Badge variant="outline" className="text-xs">
                  {proc.dependencies.length} dépendances
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Code and Analysis Tabs */}
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="code">Code source</TabsTrigger>
          <TabsTrigger value="parsed">Analyse</TabsTrigger>
          <TabsTrigger value="dependencies">Dépendances</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="mt-4">
          <Card className="overflow-hidden">
            <div className="bg-secondary px-4 py-2">
              <p className="text-xs font-medium text-muted-foreground">VBA Original</p>
            </div>
            <pre className="overflow-x-auto p-4 text-sm">
              <code className="font-mono">{module.code}</code>
            </pre>
          </Card>
        </TabsContent>

        <TabsContent value="parsed" className="mt-4">
          <div className="space-y-4">
            {/* Variables */}
            <Card className="p-6">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <List className="h-4 w-4" />
                Variables déclarées
              </h4>
              <div className="space-y-2">
                {module.parsed.variables.map((variable, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded border border-border p-2 text-sm">
                    <span className="font-mono">{variable.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {variable.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {variable.scope}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Control Structures */}
            <Card className="p-6">
              <h4 className="mb-4 text-sm font-semibold">Structures de contrôle</h4>
              <div className="flex flex-wrap gap-2">
                {module.parsed.controlStructures.map((structure, idx) => (
                  <Badge key={idx} variant="secondary">
                    {structure}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* External Calls */}
            <Card className="p-6">
              <h4 className="mb-4 text-sm font-semibold">Appels externes</h4>
              <div className="flex flex-wrap gap-2">
                {module.parsed.externalCalls.map((call, idx) => (
                  <Badge key={idx} variant="outline">
                    {call}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dependencies" className="mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              {module.procedures.map((proc, idx) => (
                <div key={idx}>
                  <h4 className="mb-2 font-medium">{proc.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {proc.dependencies.map((dep, depIdx) => (
                      <Badge key={depIdx} variant="secondary">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                  {idx < module.procedures.length - 1 && <div className="my-4 border-t border-border" />}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ComplexityBadge({ complexity }: { complexity: string }) {
  const styles = {
    low: "bg-green-500/10 text-green-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    high: "bg-red-500/10 text-red-500",
  }

  return (
    <Badge className={styles[complexity as keyof typeof styles] || styles.medium} variant="secondary">
      {complexity}
    </Badge>
  )
}
