"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@/lib/supabase/client"
import { User, Key, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login")
      } else {
        setUser(user)
        setLoading(false)
      }
    })
  }, [supabase.auth, router])

  const handleDeleteAccount = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      return
    }

    try {
      setUpdating(true)
      // In production, this would call an API to delete user data
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("[v0] Delete account error:", error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre compte et vos préférences</p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Informations du compte</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2 mt-1.5">
                <Input id="email" type="email" value={user?.email || ""} disabled className="flex-1" />
                <Button variant="outline" disabled>
                  Modifier
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Votre adresse email est utilisée pour la connexion</p>
            </div>

            <div>
              <Label htmlFor="user-id">ID Utilisateur</Label>
              <Input id="user-id" value={user?.id || ""} disabled className="mt-1.5 font-mono text-xs" />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Sécurité</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Mot de passe</Label>
              <div className="flex gap-2 mt-1.5">
                <Input type="password" value="••••••••" disabled className="flex-1" />
                <Button variant="outline" disabled>
                  Changer
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-destructive/50">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="h-5 w-5 text-destructive" />
            <h2 className="text-xl font-semibold text-destructive">Zone dangereuse</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                La suppression de votre compte supprimera définitivement toutes vos données, y compris tous vos projets
                et conversions. Cette action est irréversible.
              </p>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={updating}>
                {updating ? "Suppression..." : "Supprimer mon compte"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
