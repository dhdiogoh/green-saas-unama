"use client"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { PontosColetaMap } from "@/components/pontos-coleta-map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Recycle, Info, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Informações específicas por instituição
const infoInstituicao = {
  "Unama Alcindo Cacela": {
    horarios: "Segunda a Sexta: 8h às 22h | Sábado: 8h às 12h",
    responsavel: "Núcleo de Sustentabilidade",
    contato: "sustentabilidade.alcindo@unama.br",
  },
  "Unama BR": {
    horarios: "Segunda a Sexta: 7h às 21h | Sábado: 8h às 14h",
    responsavel: "Comitê Ambiental",
    contato: "ambiental.br@unama.br",
  },
  "Unama Gentil": {
    horarios: "Segunda a Sexta: 8h às 20h | Sábado: 8h às 12h",
    responsavel: "Coordenação de Meio Ambiente",
    contato: "meioambiente.gentil@unama.br",
  },
}

export default function PontosColetaPage() {
  const [instituicao, setInstituicao] = useState<string>("Unama Alcindo Cacela")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUserData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Erro ao obter usuário:", error)
          setError("Não foi possível carregar os dados do usuário. Por favor, tente novamente mais tarde.")
          return
        }

        if (data.user) {
          const metadata = data.user.user_metadata || {}
          setInstituicao(metadata.instituicao || "Unama Alcindo Cacela")
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
        <Skeleton className="h-[500px] w-full" />
      </DashboardShell>
    )
  }

  // Obter informações específicas da instituição
  const info = infoInstituicao[instituicao as keyof typeof infoInstituicao] || {
    horarios: "Consulte a administração",
    responsavel: "Equipe de Sustentabilidade",
    contato: "sustentabilidade@unama.br",
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Pontos de Coleta"
        text={`Localize os pontos de coleta disponíveis na ${instituicao} para depositar materiais recicláveis.`}
      />

      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 mb-6">
          <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <AlertTitle className="text-emerald-800 dark:text-emerald-400">Informações da {instituicao}</AlertTitle>
          <AlertDescription className="text-emerald-700 dark:text-emerald-400">
            <div className="mt-2 space-y-1">
              <p>
                <strong>Horários de coleta:</strong> {info.horarios}
              </p>
              <p>
                <strong>Responsável:</strong> {info.responsavel}
              </p>
              <p>
                <strong>Contato:</strong> {info.contato}
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-emerald-500">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-emerald-500" />
            Pontos de Coleta - {instituicao}
          </CardTitle>
          <CardDescription>
            Encontre os pontos de coleta mais próximos para depositar seus materiais recicláveis e contribuir com o meio
            ambiente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PontosColetaMap instituicao={instituicao} />
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card className="border-emerald-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Recycle className="mr-2 h-5 w-5 text-emerald-500" />
              Como utilizar os pontos de coleta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800">
                <p className="text-emerald-700 dark:text-emerald-400">
                  Os pontos de coleta estão distribuídos estrategicamente pela instituição para facilitar o descarte
                  correto de materiais recicláveis. Cada ponto aceita tipos específicos de materiais, identificados
                  pelas cores e etiquetas.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-emerald-700 dark:text-emerald-400">
                  <li>Separe os materiais por tipo antes de depositá-los</li>
                  <li>Certifique-se de que os materiais estão limpos e secos</li>
                  <li>Respeite os horários de coleta indicados em cada ponto</li>
                  <li>Em caso de dúvidas, consulte os monitores ambientais da instituição</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
