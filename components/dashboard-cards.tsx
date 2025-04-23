import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Clock, Trophy } from "lucide-react"

// Dados mockados para as turmas
const turmasData = {
  todas: { reciclado: "45.8", pontuacao: "3250", entregas: "12" },
  "turma-a": { reciclado: "12.5", pontuacao: "850", entregas: "3" },
  "turma-b": { reciclado: "8.7", pontuacao: "750", entregas: "2" },
  "turma-c": { reciclado: "14.2", pontuacao: "950", entregas: "4" },
  "turma-d": { reciclado: "5.3", pontuacao: "650", entregas: "1" },
  "turma-e": { reciclado: "5.1", pontuacao: "800", entregas: "2" },
}

export function DashboardCards({ turma = "todas" }: { turma?: string }) {
  const data = turmasData[turma as keyof typeof turmasData] || turmasData["todas"]
  const turmaNome = turma === "todas" ? "Todas as Turmas" : turma.replace("turma-", "Turma ").toUpperCase()

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
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Pontuação</CardTitle>
          <Trophy className="h-4 w-4 text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-400 dark:text-amber-400">{data.pontuacao} pts</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {turma === "todas" ? "Pontuação combinada" : turmaNome}
          </p>
        </CardContent>
      </Card>

      <Card className="border-emerald-500 bg-white dark:bg-white/5 dark:backdrop-blur-sm dark:bg-gray-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Entregas Recentes</CardTitle>
          <Clock className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400 dark:text-blue-400">{data.entregas}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Nos últimos 7 dias</p>
        </CardContent>
      </Card>
    </>
  )
}
