"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
        <h2 className="text-2xl font-bold mb-4">Une erreur s'est produite</h2>
        <p className="text-muted-foreground mb-2">{error.message || "Une erreur inattendue s'est produite"}</p>
        {error.digest && <p className="text-xs text-muted-foreground mb-8">ID d'erreur: {error.digest}</p>}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Réessayer</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  )
}
