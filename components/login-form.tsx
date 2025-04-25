"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, Recycle, AlertCircle, School, Building2, MapPin, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [configError, setConfigError] = useState<boolean>(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"instituicao" | "aluno" | null>(null)
  const [instituicao, setInstituicao] = useState<string>("")
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null)
  const [useDemoMode, setUseDemoMode] = useState(false)

  // Verificar se o Supabase está configurado
  useEffect(() => {
    const checkSupabase = async () => {
      if (!isSupabaseConfigured()) {
        console.log("Supabase não está configurado, ativando modo de demonstração")
        setConfigError(true)
        setUseDemoMode(true)
      } else {
        try {
          // Testar conexão com o Supabase
          const { error } = await supabase.auth.getSession()
          if (error) {
            console.error("Erro ao conectar com Supabase:", error)
            setConfigError(true)
            setUseDemoMode(true)
          }
        } catch (err) {
          console.error("Exceção ao testar Supabase:", err)
          setConfigError(true)
          setUseDemoMode(true)
        }
      }
    }

    checkSupabase()
  }, [])

  // Verificar se o email está autorizado para o tipo de usuário e instituição selecionados
  const verificarEmail = async () => {
    if (!email || !userType || !instituicao) return

    try {
      setIsVerifying(true)
      setIsEmailVerified(null)

      // Modo de demonstração - verificar emails específicos
      if (useDemoMode || configError) {
        console.log("Verificando email em modo de demonstração")

        // Verificações simuladas para o modo de demonstração
        if (email === "cienciaalcindob@gmail.com" && userType === "aluno" && instituicao === "Unama Alcindo Cacela") {
          setIsEmailVerified(true)
        } else if (
          email === "adminalcindo@gmail.com" &&
          userType === "instituicao" &&
          instituicao === "Unama Alcindo Cacela"
        ) {
          setIsEmailVerified(true)
        } else {
          setIsEmailVerified(false)
        }

        setIsVerifying(false)
        return
      }

      // Verificar no backend com tratamento de erro de rede
      try {
        console.log("Verificando email via API:", { email, userType, instituicao })

        const response = await fetch("/api/auth/verificar-usuario", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            tipo_usuario: userType,
            instituicao,
          }),
        })

        if (!response.ok) {
          console.error("Resposta de erro da API:", response.status, response.statusText)
          throw new Error(`Erro na verificação: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        console.log("Resultado da verificação:", result)

        if (result.autorizado) {
          setIsEmailVerified(true)
        } else {
          setIsEmailVerified(false)
        }
      } catch (fetchError) {
        console.error("Erro de rede ao verificar email:", fetchError)

        // Ativar modo de demonstração em caso de erro de rede
        setUseDemoMode(true)

        // Verificar emails de demonstração
        if (email === "cienciaalcindob@gmail.com" && userType === "aluno" && instituicao === "Unama Alcindo Cacela") {
          setIsEmailVerified(true)
        } else if (
          email === "adminalcindo@gmail.com" &&
          userType === "instituicao" &&
          instituicao === "Unama Alcindo Cacela"
        ) {
          setIsEmailVerified(true)
        } else {
          setIsEmailVerified(false)
        }
      }
    } finally {
      setIsVerifying(false)
    }
  }

  // Verificar email quando mudar
  useEffect(() => {
    if (email && userType && instituicao) {
      const timer = setTimeout(() => {
        verificarEmail()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [email, userType, instituicao])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Usar modo de demonstração se ativado ou se houver erro de configuração
      if (useDemoMode || configError) {
        console.log("Login em modo de demonstração")

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

          console.log("Demo user aluno criado:", demoUser)
          localStorage.setItem("demo-user", JSON.stringify(demoUser))

          // Redirecionar diretamente
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

          console.log("Demo user admin criado:", demoUser)
          localStorage.setItem("demo-user", JSON.stringify(demoUser))

          // Redirecionar diretamente
          window.location.href = "/dashboard"
          return
        } else {
          throw new Error("Credenciais inválidas. Use as credenciais de demonstração.")
        }
      }

      // Login normal via Supabase
      console.log("Tentando login via Supabase")

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Erro de login Supabase:", error)
        throw error
      }

      if (!data.user || !data.session) {
        throw new Error("Falha ao fazer login. Nenhuma sessão criada.")
      }

      console.log("Login bem-sucedido:", data.user.id)

      // Atualizar metadados do usuário
      const metadata = {
        tipo_usuario: userType,
        user_type: userType,
        instituicao: instituicao,
        ...(userType === "aluno" ? { curso: "Ciência da Computação", turma: "Turma B" } : {}),
      }

      await supabase.auth.updateUser({
        data: metadata,
      })

      // Redirecionar com base no tipo de usuário
      const redirectPath = userType === "aluno" ? "/dashboard/aluno" : "/dashboard"
      console.log("Redirecionando para:", redirectPath)

      // Usar redirecionamento direto
      window.location.href = redirectPath
    } catch (error: any) {
      console.error("Erro no login:", error)

      // Mensagens de erro amigáveis
      if (error.message?.includes("Invalid login credentials")) {
        setError("Credenciais inválidas. Verifique seu email e senha.")
      } else if (error.message?.includes("Email not confirmed")) {
        setError("Email não confirmado. Por favor, verifique sua caixa de entrada.")
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        setError("Erro de conexão. Ativando modo de demonstração.")
        setUseDemoMode(true)
      } else {
        setError(error.message || "Falha ao fazer login. Verifique suas credenciais.")
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
      <CardContent className="space-y-4 pt-6">
        {(useDemoMode || configError) && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Modo de demonstração ativado</AlertTitle>
            <AlertDescription className="text-amber-700">
              {configError ? "O Supabase não está configurado corretamente." : "Problemas de conexão detectados."}O
              aplicativo está funcionando em modo de demonstração.
              <br />
              <strong>Credenciais de acesso:</strong>
              <ul className="mt-1 list-disc list-inside">
                <li>Email: cienciaalcindob@gmail.com | Senha: 12345678 (Aluno)</li>
                <li>Email: adminalcindo@gmail.com | Senha: 12345678 (Instituição)</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

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
              onClick={() => {
                setUserType("instituicao")
                setIsEmailVerified(null)
              }}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Instituição
            </Button>
            <Button
              type="button"
              variant={userType === "aluno" ? "default" : "outline"}
              className={`flex-1 ${userType === "aluno" ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
              onClick={() => {
                setUserType("aluno")
                setIsEmailVerified(null)
              }}
            >
              <School className="mr-2 h-4 w-4" />
              Aluno
            </Button>
          </div>
        </div>

        {userType && (
          <div className="space-y-2">
            <Label htmlFor="instituicao">Instituição</Label>
            <Select
              value={instituicao}
              onValueChange={(value) => {
                setInstituicao(value)
                setIsEmailVerified(null)
              }}
              required
            >
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
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setIsEmailVerified(null)
                }}
                className={`pr-10 ${
                  isEmailVerified === true
                    ? "border-green-500 focus-visible:ring-green-500"
                    : isEmailVerified === false
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                }`}
                required
              />
              {isVerifying && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
              {isEmailVerified === true && !isVerifying && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-4 w-4 rounded-full bg-green-500"></div>
                </div>
              )}
              {isEmailVerified === false && !isVerifying && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-4 w-4 rounded-full bg-red-500"></div>
                </div>
              )}
            </div>
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
            disabled={isLoading || !userType || !instituicao || (isEmailVerified === false && !useDemoMode)}
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
