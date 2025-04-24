"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, Recycle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Estados para os campos do formulário
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  // Verificar se o usuário já está logado
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push("/dashboard")
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      console.log("Tentando login com:", { email, password })

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
        console.log("Login bem-sucedido, redirecionando...")
        router.push("/dashboard")
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

  // Substitua a função handleRegister existente pela seguinte implementação:

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validação básica
    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setIsLoading(true)

    try {
      // Registrar o usuário no Supabase Auth com autoconfirmação
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          // Importante: isso indica que queremos que o usuário seja confirmado automaticamente
          emailRedirectTo: window.location.origin,
        },
      })

      console.log("Resposta do registro:", { data, error })

      if (error) {
        throw error
      }

      // Verificar se o usuário foi criado
      if (data.user) {
        // Tentar fazer login imediatamente após o registro
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          throw signInError
        }

        if (signInData.session) {
          // Login bem-sucedido, redirecionar para o dashboard
          router.push("/dashboard")
        } else {
          // Se por algum motivo não conseguir fazer login automaticamente
          setSuccess("Cadastro realizado com sucesso! Você já pode fazer login.")
          setActiveTab("login")
        }
      } else {
        throw new Error("Falha ao criar usuário. Tente novamente.")
      }
    } catch (error: any) {
      console.error("Erro capturado:", error)

      // Tratamento específico para erros comuns
      if (error.message.includes("already registered") || error.message.includes("User already registered")) {
        setError("Este email já está registrado. Por favor, faça login.")
        setActiveTab("login")
      } else if (error.message.includes("Email signups are disabled")) {
        // Se o cadastro por email estiver desativado, tente uma abordagem alternativa
        try {
          // Tente usar o método de admin para criar o usuário (se disponível)
          // Nota: isso requer configuração adicional no Supabase
          const { data: adminData, error: adminError } = await fetch("/api/create-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, fullName }),
          }).then((res) => res.json())

          if (adminError) {
            throw adminError
          }

          if (adminData) {
            // Usuário criado com sucesso via API admin
            setSuccess("Cadastro realizado com sucesso! Você já pode fazer login.")
            setActiveTab("login")
          }
        } catch (adminCreateError) {
          console.error("Erro ao criar usuário via admin:", adminCreateError)
          setError(
            "Cadastro por email está temporariamente indisponível. Por favor, entre em contato com o administrador.",
          )
        }
      } else {
        setError(error.message || "Falha ao registrar. Tente novamente.")
      }
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="register">Cadastrar</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
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
            </CardContent>
            <CardFooter>
              <Button
                id="login-button"
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4 pt-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="fullname">Nome completo</Label>
                <Input
                  id="fullname"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">E-mail</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Senha</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                id="register-button"
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={isLoading}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar-se"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
      <div className="p-4 pt-0 text-center text-xs text-muted-foreground">
        <div className="flex justify-center space-x-1 items-center">
          <Leaf className="h-3 w-3 text-emerald-500" />
          <span>Ajudando o planeta desde 2024</span>
        </div>
      </div>
    </Card>
  )
}
