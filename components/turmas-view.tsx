"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Leaf, Clock, Trophy } from "lucide-react"
import { useAppData } from "@/hooks/use-app-data"

// Função para obter medalha com base na posição
const getMedalByPosition = (position: number) => {
  switch (position) {
    case 1:
      return { type: "gold", color: "bg-amber-400", icon: "🥇", label: "Ouro" }
    case 2:
      return { type: "silver", color: "bg-gray-300", icon: "🥈", label: "Prata" }
    case 3:
      return { type: "bronze", color: "bg-amber-700", icon: "🥉", label: "Bronze" }
    default:
      return { type: "none", color: "", icon: "", label: "" }
  }
}

interface RankingItem {
  curso: string
  turma: string
  unidade: string
  total_reciclado_kg: number
  total_pontos: number
  total_entregas: number
}

export function TurmasView() {
  const { cursos, unidades, isLoadingCursos, isLoadingUnidades } = useAppData()
  const [cursoFiltro, setCursoFiltro] = useState<string>("todos")
  const [unidadeFiltro, setUnidadeFiltro] = useState<string>("todas")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rankingData, setRankingData] = useState<RankingItem[]>([])

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Construir parâmetros de consulta
        const params = new URLSearchParams()
        if (cursoFiltro !== "todos") {
          params.append("curso", cursoFiltro)
        }
        if (unidadeFiltro !== "todas") {
          params.append("unidade", unidadeFiltro)
        }

        // Buscar dados do ranking
        const response = await fetch(`/api/ranking?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Falha ao carregar dados do ranking")
        }

        const result = await response.json()
        setRankingData(result.data || [])
      } catch (err) {
        console.error("Erro ao carregar ranking:", err)
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRanking()
  }, [cursoFiltro, unidadeFiltro])

  return (
    <Card className="border-emerald-500">
      <CardHeader>
        <CardTitle>Ranking de Turmas</CardTitle>
        <CardDescription>Visualize o desempenho das turmas por curso e unidade.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <Select value={cursoFiltro} onValueChange={setCursoFiltro} disabled={isLoadingCursos}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingCursos ? "Carregando..." : "Filtrar por curso"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cursos</SelectItem>
                {cursos.map((curso) => (
                  <SelectItem key={curso.id} value={curso.nome}>
                    {curso.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/2">
            <Select value={unidadeFiltro} onValueChange={setUnidadeFiltro} disabled={isLoadingUnidades}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingUnidades ? "Carregando..." : "Filtrar por unidade"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as unidades</SelectItem>
                {unidades.map((unidade) => (
                  <SelectItem key={unidade.id} value={unidade.nome}>
                    {unidade.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : rankingData.length > 0 ? (
          <div className="space-y-3">
            {rankingData.map((item, index) => {
              const medal = getMedalByPosition(index < 3 ? index + 1 : 4)
              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center justify-between p-4 rounded-lg border ${
                    index === 0
                      ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                      : index === 1
                        ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                        : index === 2
                          ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/50"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center w-full md:w-auto mb-3 md:mb-0">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-bold ${
                        index === 0
                          ? "bg-amber-400 text-black"
                          : index === 1
                            ? "bg-gray-300 text-black"
                            : index === 2
                              ? "bg-amber-700 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {cursoFiltro === "todos" ? `${item.turma} (${item.curso})` : item.turma}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{item.unidade}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-4 w-full md:w-auto">
                    <div className="flex items-center">
                      <Leaf className="h-4 w-4 mr-1 text-emerald-500" />
                      <div className="text-right">
                        <div className="font-semibold">{Number(item.total_reciclado_kg).toFixed(1)} kg</div>
                        <div className="text-xs text-gray-500">Total reciclado</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-500" />
                      <div className="text-right">
                        <div className="font-semibold">{item.total_entregas}</div>
                        <div className="text-xs text-gray-500">Entregas totais</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                      <div className="text-right">
                        <div className="font-semibold">{item.total_pontos}</div>
                        <div className="text-xs text-gray-500">Pontos</div>
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="flex items-center ml-2">
                        <span className="text-xl mr-1">{medal.icon}</span>
                        <Badge className={`${medal.color} text-black`}>{medal.label}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-md border p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma turma encontrada com os filtros selecionados.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
