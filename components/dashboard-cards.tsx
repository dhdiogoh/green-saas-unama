"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Clock, Trophy } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface DashboardCardsProps {
  turma?: string
  curso?: string
  unidade?: string
  hidePontuacao?: boolean
}

export function DashboardCards({
  turma = "todas",
  curso = "",
  unidade = "",
  hidePontuacao = false,
}: DashboardCardsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState({
    reciclado: "0.0",
    entregas: "0",
    pontos: "0",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Construir URL com parâmetros
        let url = "/api/estatisticas"
        const params = new URLSearchParams()

        if (turma !== "todas") {
          params.append("turma", turma)
        }

        if (curso) {
          params.append("curso", curso)
        }

        if (unidade) {
          params.append("unidade", unidade)
        }

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        console.log("Fetching data from:", url)

        // Buscar estatísticas
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Falha ao carregar dados")
        }

        const result = await response.json()
        console.log("Estatísticas recebidas:", result)

        // Se estamos em modo de demonstração e a turma é "turma-b", fornecer dados fictícios
        if (turma === "turma-b" && result.totalKg === 0 && !window.location.hostname.includes("vercel")) {
          setData({
            reciclado: "45.5",
            entregas: "12",
            pontos: "2250",
          })
        } else {
          setData({
            reciclado: Number(result.totalKg).toFixed(1),
            entregas: result.totalEntregas.toString(),
            pontos: result.totalPontos.toString(),
          })
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError(err instanceof Error ? err.message : "Erro desconhecido")

        // Em caso de erro, se for a turma B, fornecer dados fictícios para demonstração
        if (turma === "turma-b") {
          setData({
            reciclado: "45.5",
            entregas: "12",
            pontos: "2250",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [turma, curso, unidade])

  const turmaNome = turma === "todas" ? "Todas as Turmas" : turma.replace("turma-", "Turma ").toUpperCase()

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        {!hidePontuacao && <Skeleton className="h-32" />}
      </>
    )
  }

  if (error) {
    return (
      <Card className="border-red-500 col-span-2">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Erro ao carregar dados: {error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-emerald-500 bg-white dark:bg-white/5 dark:backdrop-blur-sm dark:bg-gray-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Total Reciclado</CardTitle>
          <Leaf className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-400 dark:text-emerald-400">{data.reciclado} kg</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {turma === "todas" ? "Total de todas as turmas" : turmaNome}
          </p>
        </CardContent>
      </Card>

      <Card className="border-emerald-500 bg-white dark:bg-white/5 dark:backdrop-blur-sm dark:bg-gray-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Entregas Totais</CardTitle>
          <Clock className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400 dark:text-blue-400">{data.entregas}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total de entregas</p>
        </CardContent>
      </Card>

      {!hidePontuacao && (
        <Card className="border-emerald-500 bg-white dark:bg-white/5 dark:backdrop-blur-sm dark:bg-gray-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Pontuação Total</CardTitle>
            <Trophy className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400 dark:text-amber-400">{data.pontos}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pontos acumulados</p>
          </CardContent>
        </Card>
      )}
    </>
  )
}
