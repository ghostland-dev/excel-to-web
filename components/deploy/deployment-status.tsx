import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, CheckCircle2, Clock } from "lucide-react"

interface Deployment {
  id: string
  environment: string
  url: string
  status: "active" | "building" | "failed"
  deployedAt: string
  version: string
}

interface DeploymentStatusProps {
  deployments: Deployment[]
}

export function DeploymentStatus({ deployments }: DeploymentStatusProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Déploiements actifs</h2>

      <div className="space-y-4">
        {deployments.map((deployment) => (
          <Card key={deployment.id} className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  {deployment.status === "active" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {deployment.status === "building" && <Clock className="h-5 w-5 text-yellow-500" />}
                </div>
                <div>
                  <h3 className="font-semibold">{deployment.environment}</h3>
                  <p className="text-xs text-muted-foreground">
                    Déployé le {new Date(deployment.deployedAt).toLocaleDateString("fr-FR")} à{" "}
                    {new Date(deployment.deployedAt).toLocaleTimeString("fr-FR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{deployment.version}</Badge>
                <StatusBadge status={deployment.status} />
              </div>
            </div>

            <div className="mb-4 rounded-lg border border-border bg-secondary p-3">
              <a
                href={deployment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-sm text-primary hover:underline"
              >
                {deployment.url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent">
                Voir les logs
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                Rollback
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function StatusBadge({ status }: { status: "active" | "building" | "failed" }) {
  const config = {
    active: {
      label: "Actif",
      className: "bg-green-500/10 text-green-500",
    },
    building: {
      label: "En cours",
      className: "bg-yellow-500/10 text-yellow-500",
    },
    failed: {
      label: "Échoué",
      className: "bg-red-500/10 text-red-500",
    },
  }

  const { label, className } = config[status]

  return (
    <Badge className={className} variant="secondary">
      {label}
    </Badge>
  )
}
