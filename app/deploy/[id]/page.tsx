"use client"

import { DeploymentOptions } from "@/components/deploy/deployment-options"
import { ExportOptions } from "@/components/deploy/export-options"
import { DeploymentStatus } from "@/components/deploy/deployment-status"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const deployData = {
  fileName: "budget-2024.xlsx",
  projectName: "budget-app-2024",
  status: "ready",
  deployments: [
    {
      id: "deploy-1",
      environment: "Production",
      url: "https://budget-app-2024.vercel.app",
      status: "active",
      deployedAt: "2024-01-15T14:30:00Z",
      version: "v1.0.0",
    },
    {
      id: "deploy-2",
      environment: "Preview",
      url: "https://budget-app-2024-preview.vercel.app",
      status: "active",
      deployedAt: "2024-01-15T12:15:00Z",
      version: "v0.9.0",
    },
  ],
}

export default function DeployPage({ params }: { params: { id: string } }) {
  const [isDeploying, setIsDeploying] = useState(false)

  const handleDeploy = () => {
    setIsDeploying(true)
    setTimeout(() => setIsDeploying(false), 3000)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/review/review-123">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Déploiement et export</h1>
                <p className="text-sm text-muted-foreground">{deployData.fileName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="deploy" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="deploy">Déploiement</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="deploy" className="space-y-6">
            <DeploymentOptions projectName={deployData.projectName} onDeploy={handleDeploy} isDeploying={isDeploying} />
            <DeploymentStatus deployments={deployData.deployments} />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <ExportOptions projectName={deployData.projectName} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
