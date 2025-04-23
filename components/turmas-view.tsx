"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Dados mockados para o ranking por curso
const rankingPorCurso = {
  "Ciência da Computação": [
    { name: "Turma A", valor: 850, posicao: 1, unidade: "Unama Alcindo Cacela" },
    { name: "Turma B", valor: 650, posicao: 2, unidade: "Unama BR" },
    { name: "Turma C", valor: 450, posicao: 3, unidade: "Unama Gentil" },
    { name: "Turma D", valor: 350, posicao: 4, unidade: "Unama Alcindo Cacela" },
  ],
  Odontologia: [
    { name: "Turma A", valor: 780, posicao: 1, unidade: "Unama BR" },
    { name: "Turma B", valor: 720, posicao: 2, unidade: "Unama Alcindo Cacela" },
    { name: "Turma C", valor: 520, posicao: 3, unidade: "Unama Gentil" },
    { name: "Turma D", valor: 320, posicao: 4, unidade: "Unama BR" },
  ],
  Direito: [
    { name: "Turma A", valor: 920, posicao: 1, unidade: "Unama Gentil" },
    { name: "Turma B", valor: 680, posicao: 2, unidade: "Unama BR" },
    { name: "Turma C", valor: 580, posicao: 3, unidade: "Unama Alcindo Cacela" },
    { name: "Turma D", valor: 480, posicao: 4, unidade: "Unama BR" },
  ],
  Engenharia: [
    { name: "Turma A", valor: 800, posicao: 1, unidade: "Unama Alcindo Cacela" },
    { name: "Turma B", valor: 750, posicao: 2, unidade: "Unama BR" },
    { name: "Turma C", valor: 600, posicao: 3, unidade: "Unama Gentil" },
    { name: "Turma D", valor: 400, posicao: 4, unidade: "Unama Alcindo Cacela" },
  ],
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

export function TurmasView() {
  const [cursoFiltro, setCursoFiltro] = useState<string>("todos")
  const [unidadeFiltro, setUnidadeFiltro] = useState<string>("todas")

  // Obter dados de ranking com base na seleção
  const getRankingData = () => {
    let result = []

    if (cursoFiltro === "todos") {
      // Combinar todos os cursos
      Object.values(rankingPorCurso).forEach((turmas) => {
        result = [...result, ...turmas]
      })
    } else {
      result = rankingPorCurso[cursoFiltro as keyof typeof rankingPorCurso] || []
    }

    // Filtrar por unidade se necessário
    if (unidadeFiltro !== "todas") {
      result = result.filter((item) => item.unidade === unidadeFiltro)
    }

    // Ordenar por pontuação
    return result.sort((a, b) => b.valor - a.valor)
  }

  const rankingData = getRankingData()

  return (
    <Card className="border-emerald-500">
      <CardHeader>
        <CardTitle>Ranking de Turmas</CardTitle>
        <CardDescription>Visualize o desempenho das turmas por curso e unidade.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <Select value={cursoFiltro} onValueChange={setCursoFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cursos</SelectItem>
                <SelectItem value="Ciência da Computação">Ciência da Computação</SelectItem>
                <SelectItem value="Odontologia">Odontologia</SelectItem>
                <SelectItem value="Direito">Direito</SelectItem>
                <SelectItem value="Engenharia">Engenharia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/2">
            <Select value={unidadeFiltro} onValueChange={setUnidadeFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as unidades</SelectItem>
                <SelectItem value="Unama Alcindo Cacela">Unama Alcindo Cacela</SelectItem>
                <SelectItem value="Unama BR">Unama BR</SelectItem>
                <SelectItem value="Unama Gentil">Unama Gentil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {rankingData.length > 0 ? (
          <div className="space-y-3">
            {rankingData.map((item, index) => {
              const medal = getMedalByPosition(index < 3 ? index + 1 : 4)
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
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {cursoFiltro === "todos"
                            ? `${item.name} (${cursoFiltro === "todos" ? item.unidade.replace("Unama ", "") : ""})`
                            : item.name}
                        </span>
                        {cursoFiltro !== "todos" && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">{item.unidade}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-3">{item.valor} pontos</span>
                    {index < 3 && (
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
        ) : (
          <div className="rounded-md border p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma turma encontrada com os filtros selecionados.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
