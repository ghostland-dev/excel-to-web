import type React from "react"
import { FileUpload } from "@/components/file-upload"
import { FileText, Zap, Shield, Code2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl">
          <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
            Excel vers Web
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-balance md:text-7xl">
            Transformez vos fichiers Excel en applications web.
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-muted-foreground text-pretty md:text-2xl">
            Convertissez automatiquement vos feuilles de calcul, formules et macros VBA en applications web modernes,
            sécurisées et évolutives.
          </p>
        </div>

        {/* File Upload Component */}
        <div className="mt-12">
          <FileUpload />
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/analysis/analysis-123">
            <Button variant="outline" className="bg-transparent">
              Voir un exemple d'analyse
            </Button>
          </Link>
          <Link href="/conversion/conversion-123">
            <Button variant="outline" className="bg-transparent">
              Voir une conversion
            </Button>
          </Link>
          <Link href="/deploy/deploy-123">
            <Button variant="outline" className="bg-transparent">
              Options de déploiement
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Analyse automatique"
              description="Extraction des formules, macros VBA et structure des données"
            />
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="Conversion intelligente"
              description="Transpilation automatique vers JavaScript et Python"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Tests intégrés"
              description="Environnement sandbox pour valider la conversion"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Sécurisé"
              description="Scan antivirus et isolation complète du code"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3">
            <StatCard value="95%" label="Taux de conversion des formules" />
            <StatCard value="70%" label="Macros converties automatiquement" className="border-x-0 md:border-x" />
            <StatCard value="< 5min" label="Temps d'analyse moyen" />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

function StatCard({
  value,
  label,
  className = "",
}: {
  value: string
  label: string
  className?: string
}) {
  return (
    <div className={`border-y border-border py-12 text-center ${className}`}>
      <div className="text-4xl font-bold md:text-5xl">{value}</div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
