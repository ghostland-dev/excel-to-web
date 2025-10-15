"use client"

import { FileCode, AlertCircle } from "lucide-react"

interface File {
  id: string
  path: string
  type: string
  hasIssues: boolean
}

interface FileTreeProps {
  files: File[]
  selectedFile: File
  onSelectFile: (file: File) => void
}

export function FileTree({ files, selectedFile, onSelectFile }: FileTreeProps) {
  const groupedFiles = files.reduce(
    (acc, file) => {
      if (!acc[file.type]) {
        acc[file.type] = []
      }
      acc[file.type].push(file)
      return acc
    },
    {} as Record<string, File[]>,
  )

  const typeLabels: Record<string, string> = {
    frontend: "Frontend",
    backend: "Backend",
    library: "Bibliothèques",
  }

  return (
    <div className="p-4">
      <h3 className="mb-4 text-sm font-semibold">Fichiers générés</h3>
      <div className="space-y-4">
        {Object.entries(groupedFiles).map(([type, typeFiles]) => (
          <div key={type}>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{typeLabels[type] || type}</p>
            <div className="space-y-1">
              {typeFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => onSelectFile(file)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                    selectedFile.id === file.id ? "bg-accent" : ""
                  }`}
                >
                  <FileCode className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="flex-1 truncate font-mono text-xs">{file.path}</span>
                  {file.hasIssues && <AlertCircle className="h-3 w-3 flex-shrink-0 text-yellow-500" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
