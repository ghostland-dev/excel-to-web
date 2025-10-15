"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, Github, Globe, Settings } from "lucide-react"
import { useState } from "react"

interface DeploymentOptionsProps {
  projectName: string
  onDeploy: () => void
  isDeploying: boolean
}

export function DeploymentOptions({ projectName, onDeploy, isDeploying }: DeploymentOptionsProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("vercel")

  const platforms = [
    {
      id: "vercel",
      name: "Vercel",
      icon: <Globe className="h-5 w-5" />,
      description: "Déploiement instantané avec CI/CD automatique",
      recommended: true,
    },
    {
      id: "github",
      name: "GitHub Pages",
      icon: <Github className="h-5 w-5" />,
      description: "Hébergement statique gratuit via GitHub",
      recommended: false,
    },
    {
      id: "custom",
      name: "Serveur personnalisé",
      icon: <Settings className="h-5 w-5" />,
      description: "Déploiement sur votre propre infrastructure",
      recommended: false,
    },
  ]

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Options de déploiement</h2>

      {/* Platform Selection */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {platforms.map((platform) => (
          <Card
            key={platform.id}
            className={`cursor-pointer p-4 transition-colors hover:bg-accent ${
              selectedPlatform === platform.id ? "border-primary bg-accent" : ""
            }`}
            onClick={() => setSelectedPlatform(platform.id)}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {platform.icon}
                <span className="font-semibold">{platform.name}</span>
              </div>
              {platform.recommended && (
                <Badge variant="secondary" className="text-xs">
                  Recommandé
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{platform.description}</p>
          </Card>
        ))}
      </div>

      {/* Deployment Configuration */}
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold">Configuration du déploiement</h3>

        <div className="mb-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Nom du projet</label>
            <div className="rounded-lg border border-border bg-secondary px-3 py-2">
              <span className="font-mono text-sm">{projectName}</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Environnement</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent">
                Production
              </Button>
              <Button variant="ghost" size="sm">
                Preview
              </Button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Branche Git</label>
            <div className="rounded-lg border border-border bg-secondary px-3 py-2">
              <span className="font-mono text-sm">main</span>
            </div>
          </div>
        </div>

        <Button className="w-full gap-2" size="lg" onClick={onDeploy} disabled={isDeploying}>
          <Rocket className="h-4 w-4" />
          {isDeploying ? "Déploiement en cours..." : "Déployer maintenant"}
        </Button>
      </Card>
    </section>
  )
}
