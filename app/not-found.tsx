import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md text-center">
        <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
        <p className="text-muted-foreground mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline">Mes projets</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
