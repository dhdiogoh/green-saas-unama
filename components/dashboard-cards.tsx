import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Clock, Trophy } from "lucide-react"

export function DashboardCards() {
  return (
    <>
      <Card className="border-emerald-500 bg-white dark:bg-gray-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">Total Reciclado</CardTitle>
          <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">12.5 kg</div>
          <p className="text-xs text-gray-600 dark:text-gray-400">+2.1 kg desde a semana passada</p>
        </CardContent>
      </Card>
      <Card className="border-emerald-500 bg-white dark:bg-gray-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">Pontuação da Turma</CardTitle>
          <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">850 pts</div>
          <p className="text-xs text-gray-600 dark:text-gray-400">2º lugar no ranking geral</p>
        </CardContent>
      </Card>

      <Card className="border-emerald-500 bg-white dark:bg-gray-800/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">Últimas Entregas</CardTitle>
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Nos últimos 7 dias</p>
        </CardContent>
      </Card>
    </>
  )
}
