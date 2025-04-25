"use client"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardCards } from "@/components/dashboard-cards"
import { DashboardCharts } from "@/components/dashboard-charts"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AlunoDashboardPage() {
  const [userData, setUserData] = useState<{
    instituicao: string
    curso: string
    turma: string
    nome: string
  }>({
    instituicao: "Unama Alcindo Cacela",
    curso: "Ciência da Computação",
    turma: "Turma B",
    nome: "Aluno",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUserData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Tentar obter do localStorage primeiro (para modo de demonstração)
        const demoUserStr = localStorage.getItem("demo-user")
        if (demoUserStr) {
          try {
            const demoUser = JSON.parse(demoUserStr)
            const metadata = demoUser.user_metadata || {}

            // Extrair nome do email
            let nome = "Aluno"
            if (demoUser.email) {
              const emailParts = demoUser.email.split("@")
              if (emailParts.length > 0) {
                nome = emailParts[0]
                  .split(/[._-]/)
                  .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(" ")
              }
            }

            setUserData({
              instituicao: metadata.instituicao || "Unama Alcindo Cacela",
              curso: metadata.curso || "Ciência da Computação",
              turma: metadata.turma || "Turma B",
              nome: nome,
            })
            setIsLoading(false)
            return
          } catch (err) {
            console.error("Erro ao processar usuário demo:", err)
          }
        }

        // Se não encontrou no localStorage, tentar do Supabase
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Erro ao obter usuário:", error)
          setError("Não foi possível carregar os dados do usuário. Por favor, tente novamente mais tarde.")
          return
        }

        if (data.user) {
          const metadata = data.user.user_metadata || {}

          // Extrair nome do email
          let nome = "Aluno"
          if (data.user.email) {
            const emailParts = data.user.email.split("@")
            if (emailParts.length > 0) {
              nome = emailParts[0]
                .split(/[._-]/)
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" ")
            }
          }

          setUserData({
            instituicao: metadata.instituicao || "Unama Alcindo Cacela",
            curso: metadata.curso || "Ciência da Computação",
            turma: metadata.turma || "Turma B",
            nome: nome,
          })
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError("Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    getUserData()
  }, [])

  if (isLoading) {
    return (
      <DashboardShell>
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </DashboardShell>
    )
  }

  if (error) {
    return (
      <DashboardShell>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <DashboardHeader
          heading="Dashboard do Aluno"
          text="Visualize seu desempenho e contribuições para a sustentabilidade."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCards turma="turma-b" curso="Ciência da Computação" unidade="Unama Alcindo Cacela" />
        </div>
        <div className="mt-6">
          <DashboardCharts turma="turma-b" />
        </div>
      </DashboardShell>
    )
  }

  // Converter o nome da turma para o formato usado nos componentes
  const turmaId = userData.turma ? userData.turma.toLowerCase().replace(" ", "-") : "turma-b"

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Bem-vindo(a), ${userData.nome}!`}
        text={`${userData.instituicao} | ${userData.curso} | ${userData.turma}`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCards turma={turmaId} curso={userData.curso} unidade={userData.instituicao} />
      </div>

      <div className="mt-6">
        <DashboardCharts turma={turmaId} />
      </div>
    </DashboardShell>
  )
}
