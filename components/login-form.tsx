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

  // Verificar se o Supabase está configurado
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setConfigError(true)
      setError("O Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
    }
  }, [])

  // Verificar se o usuário já está logado
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Erro ao verificar sessão:", error)
          return
        }

        if (data.session) {
          // Verificar o tipo de usuário nos metadados
          const userMetadata = data.session.user.user_metadata
          if (userMetadata?.user_type === "aluno") {
            router.push("/dashboard/aluno")
          } else {
            router.push("/dashboard")
          }
        }
      } catch (err) {
        console.error("Erro ao verificar sessão:", err)
      }
    }

    if (!configError) {
      checkSession()
    }
  }, [router, configError])

  // Verificar se o email está autorizado para o tipo de usuário e instituição selecionados
  const verificarEmail = async () => {
    if (!email || !userType || !instituicao) return

    try {
      setIsVerifying(true)
      // Não limpar o erro aqui para evitar que mensagens de erro desapareçam durante a digitação
      setIsEmailVerified(null)

      // Em modo de demonstração, simular verificação
      if (configError) {
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
          // Não mostrar erro aqui, apenas armazenar o status
        }

        setIsVerifying(false)
        return
      }

      // Verificar no backend
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

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao verificar usuário")
      }

      if (!result.autorizado) {
        setIsEmailVerified(false)
        // Armazenar a mensagem para uso posterior, mas não mostrar ainda
      } else {
        setIsEmailVerified(true)
      }
    } catch (err) {
      console.error("Erro ao verificar email:", err)
      setIsEmailVerified(false)
      // Não mostrar erro aqui
    } finally {
      setIsVerifying(false)
    }
  }

  // Verificar email quando mudar
  useEffect(() => {
    if (email && userType && instituicao) {
      const timer = setTimeout(() => {
        verificarEmail()
      }, 1000) // Aumentar para 1000ms para reduzir verificações durante digitação

      return () => clearTimeout(timer)
    }
  }, [email, userType, instituicao])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (configError) {
      setError("O Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      return
    }

    if (!userType) {
      setError("Por favor, selecione se você é uma Instituição ou Aluno.")
      return
    }

    if (!instituicao) {
      setError("Por favor, selecione sua instituição.")
      return
    }

    // Verificar se o email foi validado
    if (isEmailVerified === false) {
      setError(`Este email não está autorizado como ${userType} para a instituição ${instituicao}`)
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      console.log("Tentando login com:", { email, password, userType, instituicao })

      // Usar modo de demonstração se o Supabase não estiver configurado
      if (configError) {
        // Simular login para demonstração
        setTimeout(() => {
          // Verificações simuladas para o modo de demonstração
          if (email === "cienciaalcindob@gmail.com" && userType === "aluno" && instituicao === "Unama Alcindo Cacela") {
            const metadata = {
              user_type: "aluno",
              instituicao: "Unama Alcindo Cacela",
              curso: "Ciência da Computação",
              turma: "Turma B",
            }

            const demoUser = {
              id: "demo-user",
              email,
              user_metadata: metadata,
            }

            console.log("Demo user criado com metadados:", metadata)
            localStorage.setItem("demo-user", JSON.stringify(demoUser))
            router.push("/dashboard/aluno")
          } else if (
            email === "adminalcindo@gmail.com" &&
            userType === "instituicao" &&
            instituicao === "Unama Alcindo Cacela"
          ) {
            const metadata = {
              user_type: "instituicao",
              instituicao: "Unama Alcindo Cacela",
            }

            const demoUser = {
              id: "demo-user",
              email,
              user_metadata: metadata,
            }

            console.log("Demo user criado com metadados:", metadata)
            localStorage.setItem("demo-user", JSON.stringify(demoUser))
            router.push("/dashboard")
          } else {
            setError(`Este email não está autorizado como ${userType} para a instituição ${instituicao}`)
          }
        }, 1000)
        return
      }

      // Verificar novamente se o email está autorizado
      const verificacaoResponse = await fetch("/api/auth/verificar-usuario", {
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

      const verificacaoResult = await verificacaoResponse.json()

      if (!verificacaoResponse.ok || !verificacaoResult.autorizado) {
        throw new Error(
          verificacaoResult.mensagem ||
            `Este email não está autorizado como ${userType} para a instituição ${instituicao}`,
        )
      }

      // Fazer login no Supabase
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
        // Atualizar os metadados do usuário com os dados verificados
        const metadata = verificacaoResult.dados

        await supabase.auth.updateUser({
          data: metadata,
        })

        console.log("Login bem-sucedido, redirecionando...")

        // Redirecionar com base no tipo de usuário
        if (metadata.tipo_usuario === "aluno") {
          router.push("/dashboard/aluno")
        } else {
          router.push("/dashboard")
        }
      } else {
        throw new Error("Falha ao fazer login. Nenhuma sessão criada.")
      }
    } catch (error: any) {
      console.error("Erro capturado:", error)

      // Mensagens de erro mais amigáveis
      if (error.message.includes("Invalid login credentials")) {
        setError("Credenciais inválidas. Verifique seu email e senha.")
      } else if (error.message.includes("Email not confirmed")) {
        setError("Email não confirmado. Por favor, verifique sua caixa de entrada.")
      } else if (error.message.includes("network")) {
        setError("Erro de conexão. Verifique sua internet e tente novamente.")
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
        {configError && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Modo de demonstração</AlertTitle>
            <AlertDescription className="text-amber-700">
              O Supabase não está configurado. O aplicativo está funcionando em modo de demonstração.
              <br />
              <strong>Emails permitidos:</strong>
              <ul className="mt-1 list-disc list-inside">
                <li>cienciaalcindob@gmail.com (Aluno - Unama Alcindo Cacela)</li>
                <li>adminalcindo@gmail.com (Instituição - Unama Alcindo Cacela)</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {error && !configError && (
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
                  // Não limpar o erro aqui para evitar que mensagens desapareçam durante a digitação
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
            disabled={isLoading || !userType || !instituicao || isEmailVerified === false}
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
