import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Code2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Macro {
  original: string
  type: string
  converted: string
  language: string
  endpoint: string | null
  status: "success" | "partial" | "failed"
  code: string
}

interface MacroMappingProps {
  macros: Macro[]
}

export function MacroMapping({ macros }: MacroMappingProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Mapping des macros VBA</h2>
      <div className="space-y-4">
        {macros.map((macro, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="border-b border-border bg-secondary/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">
                      {macro.type} {macro.original}
                    </p>
                    {macro.endpoint && <p className="text-xs text-muted-foreground font-mono">{macro.endpoint}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {macro.language}
                  </Badge>
                  {macro.status === "success" && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Converti</span>
                    </>
                  )}
                  {macro.status === "partial" && (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-yellow-500">Partiel</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4">
              <Tabs defaultValue="converted">
                <TabsList>
                  <TabsTrigger value="converted">Code généré</TabsTrigger>
                  <TabsTrigger value="info">Informations</TabsTrigger>
                </TabsList>

                <TabsContent value="converted" className="mt-4">
                  <div className="rounded-lg bg-secondary p-4">
                    <pre className="overflow-x-auto text-sm">
                      <code className="font-mono">{macro.code}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="info" className="mt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fonction originale</span>
                      <span className="font-medium">{macro.original}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{macro.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Langage cible</span>
                      <span className="font-medium">{macro.language}</span>
                    </div>
                    {macro.endpoint && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Endpoint API</span>
                        <span className="font-medium font-mono">{macro.endpoint}</span>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
