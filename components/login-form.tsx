"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Leaf, Recycle, AlertCircle, School, Building2, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"instituicao" | "aluno" | null>(null)
  const [instituicao, setInstituicao] = useState<string>("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Verificar credenciais de demonstração
      if (
        email === "cienciaalcindob@gmail.com" &&
        password === "12345678" &&
        userType === "aluno" &&
        instituicao === "Unama Alcindo Cacela"
      ) {
        // Criar usuário demo aluno
        const metadata = {
          user_type: "aluno",
          tipo_usuario: "aluno",
          instituicao: "Unama Alcindo Cacela",
          curso: "Ciência da Computação",
          turma: "Turma B",
        }

        const demoUser = {
          id: "demo-user-aluno",
          email,
          user_metadata: metadata,
        }

        // Salvar no localStorage
        localStorage.setItem("demo-user", JSON.stringify(demoUser))

        // Definir cookie para o middleware
        document.cookie = "demo-user=true; path=/; max-age=86400"

        // Redirecionar para o dashboard do aluno
        window.location.href = "/dashboard/aluno"
        return
      } else if (
        email === "adminalcindo@gmail.com" &&
        password === "12345678" &&
        userType === "instituicao" &&
        instituicao === "Unama Alcindo Cacela"
      ) {
        // Criar usuário demo admin
        const metadata = {
          user_type: "instituicao",
          tipo_usuario: "instituicao",
          instituicao: "Unama Alcindo Cacela",
        }

        const demoUser = {
          id: "demo-user-admin",
          email,
          user_metadata: metadata,
        }

        // Salvar no localStorage
        localStorage.setItem("demo-user", JSON.stringify(demoUser))

        // Definir cookie para o middleware
        document.cookie = "demo-user=true; path=/; max-age=86400"

        // Redirecionar para o dashboard admin
        window.location.href = "/dashboard"
        return
      } else {
        throw new Error("Credenciais inválidas. Use as credenciais de demonstração.")
      }
    } catch (error: any) {
      console.error("Erro no login:", error)
      setError(error.message || "Falha ao fazer login. Verifique suas credenciais.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border-green-200 shadow-lg">
      <CardHeader className="space-y-1 bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-t-lg">
        <div className="flex items-center justify-center mb-2">
          <Recycle className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl text-center">Green SaaS</CardTitle>
        <CardDescription className="text-green-100 text-center">Transformando resíduos em recursos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex gap-4 justify-center">
            <Button
              type="button"
              variant={userType === "instituicao" ? "default" : "outline"}
              className={`flex-1 ${userType === "instituicao" ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
              onClick={() => setUserType("instituicao")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Instituição
            </Button>
            <Button
              type="button"
              variant={userType === "aluno" ? "default" : "outline"}
              className={`flex-1 ${userType === "aluno" ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
              onClick={() => setUserType("aluno")}
            >
              <School className="mr-2 h-4 w-4" />
              Aluno
            </Button>
          </div>
        </div>

        {userType && (
          <div className="space-y-2">
            <Label htmlFor="instituicao">Instituição</Label>
            <Select value={instituicao} onValueChange={(value) => setInstituicao(value)} required>
              <SelectTrigger id="instituicao" className="w-full">
                <SelectValue placeholder="Selecione a instituição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unama Alcindo Cacela">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-emerald-500" />
                    Unama Alcindo Cacela
                  </div>
                </SelectItem>
                <SelectItem value="Unama BR">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-emerald-500" />
                    Unama BR
                  </div>
                </SelectItem>
                <SelectItem value="Unama Gentil">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-emerald-500" />
                    Unama Gentil
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link href="#" className="text-xs text-emerald-600 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            id="login-button"
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600"
            disabled={isLoading || !userType || !instituicao}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </CardContent>
      <div className="p-4 pt-0 text-center text-xs text-muted-foreground">
        <div className="flex justify-center space-x-1 items-center">
          <Leaf className="h-3 w-3 text-emerald-500" />
          <span>Plataforma de gestão de materiais recicláveis</span>
        </div>
      </div>
    </Card>
  )
}
