"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, Recycle, AlertCircle, School, Building2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"instituicao" | "aluno" | null>(null)
  const [instituicao, setInstituicao] = useState<string>("")

  // Verificar se o usuário já está logado
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        // Verificar o tipo de usuário nos metadados
        const userMetadata = data.session.user.user_metadata
        if (userMetadata?.user_type === "aluno") {
          router.push("/dashboard/aluno")
        } else {
          router.push("/dashboard")
        }
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userType) {
      setError("Por favor, selecione se você é uma Instituição ou Aluno.")
      return
    }

    if (userType === "aluno" && !instituicao) {
      setError("Por favor, selecione sua instituição.")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      console.log("Tentando login com:", { email, password, userType, instituicao })

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Resposta do login:", { data, error })

      if (error) {
        console.error("Erro de login:", error)
        throw error
      }

      if (data.user && data.session) {
        // Atualizar os metadados do usuário com o tipo selecionado e instituição (se for aluno)
        const metadata: Record<string, any> = { user_type: userType }

        if (userType === "aluno") {
          metadata.instituicao = instituicao
          metadata.curso = "Ciência da Computação"
          metadata.turma = "Turma B"
        }

        await supabase.auth.updateUser({
          data: metadata,
        })

        console.log("Login bem-sucedido, redirecionando...")

        // Redirecionar com base no tipo de usuário
        if (userType === "aluno") {
          router.push("/dashboard/aluno")
        } else {
          router.push("/dashboard")
        }
      } else {
        throw new Error("Falha ao fazer login. Nenhuma sessão criada.")
      }
    } catch (error: any) {
      console.error("Erro capturado:", error)
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

        {userType === "aluno" && (
          <div className="space-y-2">
            <Label htmlFor="instituicao">Sua Instituição</Label>
            <Select value={instituicao} onValueChange={setInstituicao} required>
              <SelectTrigger id="instituicao" className="w-full">
                <SelectValue placeholder="Selecione sua instituição" />
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
            disabled={isLoading || !userType || (userType === "aluno" && !instituicao)}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
      <div className="p-4 pt-0 text-center text-xs text-muted-foreground">
        <div className="flex justify-center space-x-1 items-center">
          <Leaf className="h-3 w-3 text-emerald-500" />
          <span>Ajudando o planeta desde 2024</span>
        </div>
      </div>
    </Card>
  )
}
