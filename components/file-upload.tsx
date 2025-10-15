"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface UploadedFile {
  file: File
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
  projectId?: string
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const router = useRouter()

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.name.endsWith(".xlsx") || file.name.endsWith(".xls") || file.name.endsWith(".xlsm"),
    )

    if (droppedFiles.length > 0) {
      uploadFiles(droppedFiles)
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(Array.from(e.target.files))
    }
  }

  const uploadFiles = async (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      file,
      status: "uploading" as const,
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...uploadedFiles])

    for (let i = 0; i < uploadedFiles.length; i++) {
      const fileIndex = files.length + i
      const file = newFiles[i]

      try {
        // Create FormData
        const formData = new FormData()
        formData.append("file", file)

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setFiles((prev) => {
            const updated = [...prev]
            if (updated[fileIndex] && updated[fileIndex].progress < 90) {
              updated[fileIndex] = {
                ...updated[fileIndex],
                progress: Math.min(updated[fileIndex].progress + 10, 90),
              }
            }
            return updated
          })
        }, 200)

        // Upload file
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Upload failed")
        }

        const data = await response.json()

        // Create project
        const projectResponse = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysis: data.analysis,
            blobUrl: data.blobUrl,
          }),
        })

        if (!projectResponse.ok) {
          throw new Error("Failed to create project")
        }

        const projectData = await projectResponse.json()

        // Mark as complete
        setFiles((prev) => {
          const updated = [...prev]
          if (updated[fileIndex]) {
            updated[fileIndex] = {
              ...updated[fileIndex],
              status: "success",
              progress: 100,
              projectId: projectData.project.id,
            }
          }
          return updated
        })
      } catch (error) {
        console.error("[v0] Upload error:", error)
        setFiles((prev) => {
          const updated = [...prev]
          if (updated[fileIndex]) {
            updated[fileIndex] = {
              ...updated[fileIndex],
              status: "error",
              progress: 0,
              error: error instanceof Error ? error.message : "Upload failed",
            }
          }
          return updated
        })
      }
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAnalyze = () => {
    const successFile = files.find((f) => f.status === "success" && f.projectId)
    if (successFile?.projectId) {
      router.push(`/analysis/${successFile.projectId}`)
    }
  }

  return (
    <div className="space-y-6">
      <Card
        className={`relative overflow-hidden border-2 border-dashed transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border bg-card hover:border-muted-foreground/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>

          <h3 className="mb-2 text-xl font-semibold">Déposez vos fichiers Excel ici</h3>
          <p className="mb-6 text-sm text-muted-foreground">Formats supportés : .xlsx, .xls, .xlsm (max 100 Mo)</p>

          <label htmlFor="file-input">
            <Button variant="default" className="cursor-pointer" asChild>
              <span>Sélectionner des fichiers</span>
            </Button>
          </label>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".xlsx,.xls,.xlsm"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      </Card>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Fichiers téléchargés</h4>
          {files.map((uploadedFile, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
                    <div className="flex items-center gap-2">
                      {uploadedFile.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      {uploadedFile.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                      <button onClick={() => removeFile(index)} className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} Mo
                    </p>
                    {uploadedFile.status === "uploading" && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">{uploadedFile.progress}%</p>
                      </>
                    )}
                    {uploadedFile.status === "error" && uploadedFile.error && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-destructive">{uploadedFile.error}</p>
                      </>
                    )}
                  </div>

                  {uploadedFile.status === "uploading" && (
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {files.some((f) => f.status === "success") && (
            <Button className="w-full" size="lg" onClick={handleAnalyze}>
              Analyser les fichiers
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
