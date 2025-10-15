"use client"
import { Badge } from "@/components/ui/badge"

interface CodeEditorProps {
  file: {
    path: string
    type: string
    hasIssues: boolean
    issues?: Array<{
      line: number
      type: string
      message: string
    }>
  }
  code: string
  onCodeChange: (code: string) => void
}

export function CodeEditor({ file, code, onCodeChange }: CodeEditorProps) {
  const lines = code.split("\n")

  return (
    <div className="flex h-full flex-col">
      {/* File Header */}
      <div className="border-b border-border bg-secondary/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{file.path}</span>
            <Badge variant="outline" className="text-xs">
              {file.type}
            </Badge>
          </div>
          {file.hasIssues && (
            <Badge variant="outline" className="text-xs text-yellow-500">
              {file.issues?.length || 0} problèmes
            </Badge>
          )}
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-auto bg-background p-4">
        <div className="font-mono text-sm">
          {lines.map((line, index) => {
            const lineNumber = index + 1
            const issue = file.issues?.find((i) => i.line === lineNumber)

            return (
              <div key={index} className="flex">
                {/* Line Numbers */}
                <div className="mr-4 w-12 select-none text-right text-muted-foreground">{lineNumber}</div>

                {/* Code Line */}
                <div className="flex-1">
                  <div
                    className={`${
                      issue ? (issue.type === "warning" ? "bg-yellow-500/10" : "bg-blue-500/10") : ""
                    } px-2`}
                  >
                    <pre className="whitespace-pre-wrap break-all">{line || " "}</pre>
                  </div>
                  {issue && (
                    <div className="mt-1 flex items-start gap-2 rounded bg-yellow-500/10 px-2 py-1 text-xs text-yellow-500">
                      <span className="font-semibold uppercase">{issue.type}:</span>
                      <span>{issue.message}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
