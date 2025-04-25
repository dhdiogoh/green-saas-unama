"use client"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Recycle, Info, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MapaEstatico } from "@/components/mapa-estatico"

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

// Dados mockados dos pontos de coleta por instituição
const pontosColetaPorInstituicao = {
  "Unama Alcindo Cacela": [
    {
      id: 1,
      nome: "Ponto de Coleta - Bloco A",
      descricao: "Próximo à entrada principal",
      materiais: ["Papel", "Plástico", "Metal"],
    },
    {
      id: 2,
      nome: "Ponto de Coleta - Biblioteca",
      descricao: "Ao lado da biblioteca central",
      materiais: ["Papel", "Eletrônicos"],
    },
    {
      id: 3,
      nome: "Ponto de Coleta - Cantina",
      descricao: "Área da cantina",
      materiais: ["Plástico", "Metal", "Vidro"],
    },
  ],
  "Unama BR": [
    {
      id: 4,
      nome: "Ponto de Coleta - Entrada Principal",
      descricao: "Hall de entrada",
      materiais: ["Papel", "Plástico", "Metal", "Vidro"],
    },
    {
      id: 5,
      nome: "Ponto de Coleta - Laboratórios",
      descricao: "Corredor dos laboratórios",
      materiais: ["Eletrônicos", "Pilhas"],
    },
  ],
  "Unama Gentil": [
    {
      id: 6,
      nome: "Ponto de Coleta - Bloco B",
      descricao: "Próximo às salas de aula",
      materiais: ["Papel", "Plástico"],
    },
    {
      id: 7,
      nome: "Ponto de Coleta - Estacionamento",
      descricao: "Entrada do estacionamento",
      materiais: ["Metal", "Vidro", "Plástico"],
    },
  ],
}

// Cores para os tipos de materiais
const coresMateriais = {
  Papel: "bg-blue-500",
  Plástico: "bg-red-500",
  Metal: "bg-gray-500",
  Vidro: "bg-amber-500",
  Eletrônicos: "bg-purple-500",
  Pilhas: "bg-green-500",
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

        // Tentar obter do localStorage primeiro (para modo de demonstração)
        const demoUserStr = localStorage.getItem("demo-user")
        if (demoUserStr) {
          try {
            const demoUser = JSON.parse(demoUserStr)
            const metadata = demoUser.user_metadata || {}
            if (metadata.instituicao) {
              setInstituicao(metadata.instituicao)
              setIsLoading(false)
              return
            }
          } catch (err) {
            console.error("Erro ao processar usuário demo:", err)
          }
        }

        // Se não encontrou no localStorage, tentar do Supabase
        try {
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
          console.error("Erro ao carregar dados do Supabase:", err)
          setError("Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    getUserData()
  }, [])

  // Obter os pontos de coleta para a instituição selecionada
  const pontosColeta = pontosColetaPorInstituicao[instituicao as keyof typeof pontosColetaPorInstituicao] || []

  if (isLoading) {
    return (
      <DashboardShell>
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-[400px] w-full" />
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
          <MapaEstatico instituicao={instituicao} />
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card className="border-emerald-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Recycle className="mr-2 h-5 w-5 text-emerald-500" />
              Pontos de Coleta Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pontosColeta.length > 0 ? (
                pontosColeta.map((ponto) => (
                  <div
                    key={ponto.id}
                    className="p-4 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800"
                  >
                    <h3 className="font-bold text-emerald-700 dark:text-emerald-400">{ponto.nome}</h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-500 mb-2">{ponto.descricao}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ponto.materiais.map((material, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs text-white ${
                            coresMateriais[material as keyof typeof coresMateriais] || "bg-gray-500"
                          }`}
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum ponto de coleta encontrado para esta instituição.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
