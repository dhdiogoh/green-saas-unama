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
} from "recharts"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Dados mockados para os gráficos
const materialData = [
  { name: "PET", valor: 45, meta: 100, cor: "#3b82f6" },
  { name: "Alumínio", valor: 30, meta: 100, cor: "#6b7280" },
  { name: "Vidro", valor: 15, meta: 100, cor: "#f59e0b" },
  { name: "Papel", valor: 25, meta: 100, cor: "#10b981" },
]

// Dados para os gráficos de rosca individuais
const petData = [
  { name: "Coletado", valor: 45, cor: "#3b82f6" },
  { name: "Meta", valor: 55, cor: "#e5e7eb" },
]

const aluminioData = [
  { name: "Coletado", valor: 30, cor: "#6b7280" },
  { name: "Meta", valor: 70, cor: "#e5e7eb" },
]

const vidroData = [
  { name: "Coletado", valor: 15, cor: "#f59e0b" },
  { name: "Meta", valor: 85, cor: "#e5e7eb" },
]

const papelData = [
  { name: "Coletado", valor: 25, cor: "#10b981" },
  { name: "Meta", valor: 75, cor: "#e5e7eb" },
]

// Dados para o gráfico de pizza com todos os materiais
const allMaterialsData = [
  { name: "PET", valor: 45, cor: "#3b82f6" },
  { name: "Alumínio", valor: 30, cor: "#6b7280" },
  { name: "Vidro", valor: 15, cor: "#f59e0b" },
  { name: "Papel", valor: 25, cor: "#10b981" },
]

// Dados para o ranking por curso
const rankingPorCurso = {
  "Ciência da Computação": [
    { name: "Turma A", valor: 850, posicao: 1 },
    { name: "Turma B", valor: 650, posicao: 2 },
    { name: "Turma C", valor: 450, posicao: 3 },
    { name: "Turma D", valor: 350, posicao: 4 },
  ],
  Odontologia: [
    { name: "Turma A", valor: 780, posicao: 1 },
    { name: "Turma B", valor: 720, posicao: 2 },
    { name: "Turma C", valor: 520, posicao: 3 },
    { name: "Turma D", valor: 320, posicao: 4 },
  ],
  Direito: [
    { name: "Turma A", valor: 920, posicao: 1 },
    { name: "Turma B", valor: 680, posicao: 2 },
    { name: "Turma C", valor: 580, posicao: 3 },
    { name: "Turma D", valor: 480, posicao: 4 },
  ],
  Engenharia: [
    { name: "Turma A", valor: 800, posicao: 1 },
    { name: "Turma B", valor: 750, posicao: 2 },
    { name: "Turma C", valor: 600, posicao: 3 },
    { name: "Turma D", valor: 400, posicao: 4 },
  ],
}

// Ranking geral (top 3 de todos os cursos)
const rankingGeral = [
  { curso: "Direito", turma: "Turma A", valor: 920, posicao: 1 },
  { curso: "Ciência da Computação", turma: "Turma A", valor: 850, posicao: 2 },
  { curso: "Engenharia", turma: "Turma A", valor: 800, posicao: 3 },
]

const progressoData = [
  { name: "Jan", valor: 10 },
  { name: "Fev", valor: 25 },
  { name: "Mar", valor: 40 },
  { name: "Abr", valor: 65 },
  { name: "Mai", valor: 80 },
  { name: "Jun", valor: 95 },
]

// Tipos de materiais para o carrossel
const tiposMateriais = ["PET", "Alumínio", "Vidro", "Papel"]

// Mapeamento de dados para cada material
const materialDataMap = {
  PET: petData,
  Alumínio: aluminioData,
  Vidro: vidroData,
  Papel: papelData,
}

// Mapeamento de cores para cada material
const materialColors = {
  PET: "#3b82f6",
  Alumínio: "#6b7280",
  Vidro: "#f59e0b",
  Papel: "#10b981",
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

export function DashboardCharts({ turma = "todas" }: { turma?: string }) {
  const [mounted, setMounted] = useState(false)
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0)
  const [chartType, setChartType] = useState("donut")
  const [selectedCurso, setSelectedCurso] = useState("geral")

  const currentMaterial = tiposMateriais[currentMaterialIndex]
  const currentData = materialDataMap[currentMaterial as keyof typeof materialDataMap]
  const currentColor = materialColors[currentMaterial as keyof typeof materialColors]

  // Calcular a porcentagem para o material atual
  const percentage = Math.round((currentData[0].valor / (currentData[0].valor + currentData[1].valor)) * 100)

  const nextMaterial = () => {
    setCurrentMaterialIndex((prev) => (prev === tiposMateriais.length - 1 ? 0 : prev + 1))
  }

  const prevMaterial = () => {
    setCurrentMaterialIndex((prev) => (prev === 0 ? tiposMateriais.length - 1 : prev - 1))
  }

  // Obter dados de ranking com base na seleção
  const getRankingData = () => {
    if (selectedCurso === "geral") {
      return rankingGeral
    }
    return rankingPorCurso[selectedCurso as keyof typeof rankingPorCurso] || []
  }

  const rankingData = getRankingData()

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

  return (
    <Card className="border-emerald-500 bg-white dark:bg-white/5 dark:backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-700 dark:text-white">
          Dashboard Analítico {turma !== "todas" && `- ${turma.replace("turma-", "Turma ").toUpperCase()}`}
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
                  </SelectContent>
                </Select>
              </div>

              {chartType === "donut" ? (
                <div className="flex-1 flex flex-col">
                  <div className="text-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{currentMaterial}</h3>
                  </div>

                  <div className="h-64 w-64 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="valor"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {currentData.map((entry, index) => (
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
                          {currentData[0].valor}kg
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

                  <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" size="sm" onClick={prevMaterial}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                    </Button>
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
                    <Button variant="outline" size="sm" onClick={nextMaterial}>
                      Próximo <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-64 w-full mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allMaterialsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="valor"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {allMaterialsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} kg`, "Quantidade"]}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", color: "#333" }}
                        className="dark:bg-[#333] dark:border-[#555] dark:text-white"
                      />
                      <Legend />
                    </PieChart>
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
                    <SelectItem value="Ciência da Computação">Ciência da Computação</SelectItem>
                    <SelectItem value="Odontologia">Odontologia</SelectItem>
                    <SelectItem value="Direito">Direito</SelectItem>
                    <SelectItem value="Engenharia">Engenharia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="space-y-3">
                  {rankingData.map((item, index) => {
                    const medal = getMedalByPosition(item.posicao)
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          item.posicao === 1
                            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                            : item.posicao === 2
                              ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                              : item.posicao === 3
                                ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/50"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-bold ${
                              item.posicao === 1
                                ? "bg-amber-400 text-black"
                                : item.posicao === 2
                                  ? "bg-gray-300 text-black"
                                  : item.posicao === 3
                                    ? "bg-amber-700 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {item.posicao}
                          </div>
                          <div>
                            {selectedCurso === "geral" ? (
                              <div className="flex flex-col">
                                <span className="font-medium">{item.curso}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{item.turma}</span>
                              </div>
                            ) : (
                              <span className="font-medium">{item.name}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold mr-3">{item.valor} pontos</span>
                          {medal.type !== "none" && (
                            <div className="flex items-center">
                              <span className="text-xl mr-1">{medal.icon}</span>
                              <Badge className={`${medal.color} text-black`}>{medal.label}</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="progresso" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={progressoData}
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
                  formatter={(value) => [`${value} kg`, "Quantidade"]}
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
