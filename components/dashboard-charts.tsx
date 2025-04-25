"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  BarChart,
  Bar,
} from "recharts"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Mapeamento de cores para cada material
const materialColors = {
  PET: "#3b82f6",
  Alumínio: "#6b7280",
  Vidro: "#f59e0b",
  Papel: "#10b981",
  Outros: "#8b5cf6",
}

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

export function DashboardCharts({
  turma = "todas",
  curso = "",
  unidade = "",
}: {
  turma?: string
  curso?: string
  unidade?: string
}) {
  const [mounted, setMounted] = useState(false)
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0)
  const [chartType, setChartType] = useState("donut")
  const [selectedCurso, setSelectedCurso] = useState("geral")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [materialsData, setMaterialsData] = useState<any[]>([])
  const [rankingData, setRankingData] = useState<any[]>([])
  const [progressData, setProgressData] = useState<any[]>([])
  const [totalKg, setTotalKg] = useState(0)

  // Buscar dados de estatísticas e ranking
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

        // Buscar estatísticas
        const statsResponse = await fetch(url)

        if (!statsResponse.ok) {
          throw new Error("Falha ao carregar estatísticas")
        }

        const statsResult = await statsResponse.json()
        console.log("Dados de estatísticas:", statsResult)

        // Armazenar o total de kg para cálculos de percentual
        setTotalKg(statsResult.totalKg || 0)

        // Formatar dados para os gráficos
        const materialsStats = statsResult.estatisticasMateriais.map((item: any) => ({
          name: item.tipo_residuo,
          valor: Number(item.total_kg),
          pontos: Number(item.total_pontos),
          percentual: item.percentual || 0,
          cor: materialColors[item.tipo_residuo as keyof typeof materialColors] || materialColors["Outros"],
        }))

        setMaterialsData(materialsStats)

        // Buscar ranking
        const rankingResponse = await fetch("/api/ranking")

        if (!rankingResponse.ok) {
          throw new Error("Falha ao carregar ranking")
        }

        const rankingResult = await rankingResponse.json()
        setRankingData(rankingResult.data || [])

        // Simular dados de progresso (em uma aplicação real, isso viria de uma API)
        // Aqui estamos criando dados fictícios baseados nos últimos 6 meses
        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]
        const progressStats = months.map((month, index) => ({
          name: month,
          valor: Math.round(((index + 1) * statsResult.totalKg) / 6),
        }))

        setProgressData(progressStats)
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError(err instanceof Error ? err.message : "Erro desconhecido")

        // Em caso de erro, se for a turma B, fornecer dados fictícios para demonstração
        if (turma === "turma-b") {
          const demoMaterialsData = [
            { name: "PET", valor: 20.5, pontos: 1025, percentual: 45.1, cor: materialColors["PET"] },
            { name: "Alumínio", valor: 15.0, pontos: 1200, percentual: 33.0, cor: materialColors["Alumínio"] },
            { name: "Vidro", valor: 8.0, pontos: 240, percentual: 17.6, cor: materialColors["Vidro"] },
            { name: "Papel", valor: 2.0, pontos: 40, percentual: 4.4, cor: materialColors["Papel"] },
          ]

          setMaterialsData(demoMaterialsData)
          setTotalKg(45.5)

          // Dados fictícios de progresso
          const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]
          const demoProgressData = months.map((month, index) => ({
            name: month,
            valor: 5 + index * 8,
          }))

          setProgressData(demoProgressData)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (mounted) {
      fetchData()
    }
  }, [turma, curso, unidade, mounted])

  // Obter dados do material atual
  const tiposMateriais = materialsData.map((item) => item.name)
  const currentMaterial = tiposMateriais[currentMaterialIndex] || "PET"
  const currentMaterialData = materialsData.find((item) => item.name === currentMaterial)

  // Preparar dados para o gráfico de rosca
  const donutData = currentMaterialData
    ? [
        { name: currentMaterial, valor: currentMaterialData.valor, cor: currentMaterialData.cor },
        {
          name: "Outros",
          valor: totalKg - currentMaterialData.valor > 0 ? totalKg - currentMaterialData.valor : 0,
          cor: "#e5e7eb",
        },
      ]
    : []

  // Calcular a porcentagem para o material atual
  const percentage = currentMaterialData ? Math.round(currentMaterialData.percentual) : 0

  const nextMaterial = () => {
    setCurrentMaterialIndex((prev) => (prev === tiposMateriais.length - 1 ? 0 : prev + 1))
  }

  const prevMaterial = () => {
    setCurrentMaterialIndex((prev) => (prev === 0 ? tiposMateriais.length - 1 : prev - 1))
  }

  // Obter dados de ranking com base na seleção
  const getFilteredRankingData = () => {
    if (selectedCurso === "geral") {
      return rankingData.slice(0, 3)
    }
    return rankingData.filter((item) => item.curso === selectedCurso).slice(0, 4)
  }

  const filteredRankingData = getFilteredRankingData()

  // Evitar erros de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="border-emerald-500 bg-white dark:bg-white/5 dark:backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-white">Carregando gráficos...</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-pulse w-full h-full bg-white/10 rounded-md"></div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-emerald-500 bg-white dark:bg-white/5 dark:backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-white">Carregando gráficos...</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-emerald-500 bg-white dark:bg-white/5 dark:backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-white">Erro ao carregar gráficos</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const turmaNome = turma === "todas" ? "Todas as Turmas" : turma.replace("turma-", "Turma ").toUpperCase()

  return (
    <Card className="border-emerald-500 bg-white dark:bg-white/5 dark:backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-700 dark:text-white">
          Dashboard Analítico {turma !== "todas" && `- ${turmaNome}`}
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-300">
          Visualização detalhada do desempenho de reciclagem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="materiais" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="materiais">Materiais</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="progresso">Progresso</TabsTrigger>
          </TabsList>
          <TabsContent value="materiais" className="h-80">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de gráfico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donut">Gráfico Individual</SelectItem>
                    <SelectItem value="pie">Todos os Materiais</SelectItem>
                    <SelectItem value="bar">Gráfico de Barras</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {chartType === "donut" ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <Button variant="outline" size="sm" onClick={prevMaterial} disabled={tiposMateriais.length <= 1}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                    </Button>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{currentMaterial}</h3>
                    <Button variant="outline" size="sm" onClick={nextMaterial} disabled={tiposMateriais.length <= 1}>
                      Próximo <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <div className="h-64 w-64 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="valor"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} />
                          ))}
                        </Pie>
                        <text
                          x="50%"
                          y="45%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xl font-bold fill-gray-700 dark:fill-white"
                        >
                          {currentMaterialData?.valor.toFixed(1) || 0}kg
                        </text>
                        <text
                          x="50%"
                          y="60%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-sm fill-gray-500 dark:fill-gray-300"
                        >
                          {percentage}%
                        </text>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      {tiposMateriais.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 w-2 rounded-full ${
                            index === currentMaterialIndex ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : chartType === "pie" ? (
                <div className="h-64 w-full mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={materialsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="valor"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {materialsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                          const item = props.payload
                          return [`${Number(value).toFixed(1)} kg (${item.percentual.toFixed(1)}%)`, name]
                        }}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", color: "#333" }}
                        className="dark:bg-[#333] dark:border-[#555] dark:text-white"
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 w-full mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={materialsData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" className="dark:stroke-[#444]" />
                      <XAxis dataKey="name" stroke="#888" className="dark:stroke-[#aaa]" />
                      <YAxis stroke="#888" className="dark:stroke-[#aaa]" />
                      <Tooltip
                        formatter={(value, name, props) => {
                          if (name === "valor") {
                            const item = props.payload
                            return [`${Number(value).toFixed(1)} kg (${item.percentual.toFixed(1)}%)`, "Quantidade"]
                          }
                          return [value, name]
                        }}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", color: "#333" }}
                        className="dark:bg-[#333] dark:border-[#555] dark:text-white"
                      />
                      <Legend />
                      <Bar dataKey="valor" name="Quantidade (kg)" radius={[4, 4, 0, 0]}>
                        {materialsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="ranking" className="h-80">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <Select value={selectedCurso} onValueChange={setSelectedCurso}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Ranking Geral</SelectItem>
                    {rankingData
                      .map((item) => item.curso)
                      .filter((value, index, self) => self.indexOf(value) === index)
                      .map((curso) => (
                        <SelectItem key={curso} value={curso}>
                          {curso}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="space-y-3">
                  {filteredRankingData.length > 0 ? (
                    filteredRankingData.map((item, index) => {
                      const medal = getMedalByPosition(index + 1)
                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            index === 0
                              ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                              : index === 1
                                ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                                : index === 2
                                  ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/50"
                                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-center">
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
                              {selectedCurso === "geral" ? (
                                <div className="flex flex-col">
                                  <span className="font-medium">{item.curso}</span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.turma}</span>
                                </div>
                              ) : (
                                <span className="font-medium">{item.turma}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="text-right mr-3">
                              <div className="font-semibold">{item.total_pontos} pontos</div>
                              <div className="text-xs text-gray-500">
                                {Number(item.total_reciclado_kg).toFixed(1)} kg
                              </div>
                            </div>
                            {index < 3 && (
                              <div className="flex items-center">
                                <span className="text-xl mr-1">{medal.icon}</span>
                                <Badge className={`${medal.color} text-black`}>{medal.label}</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Nenhum dado de ranking disponível</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="progresso" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={progressData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" className="dark:stroke-[#444]" />
                <XAxis dataKey="name" stroke="#888" className="dark:stroke-[#aaa]" />
                <YAxis stroke="#888" className="dark:stroke-[#aaa]" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", color: "#333" }}
                  className="dark:bg-[#333] dark:border-[#555] dark:text-white"
                  formatter={(value) => [`${Number(value).toFixed(1)} kg`, "Quantidade"]}
                />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
