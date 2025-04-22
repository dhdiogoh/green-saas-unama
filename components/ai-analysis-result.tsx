import { CheckCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export function AIAnalysisResult() {
  return (
    <div className="space-y-4">
      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-400">Análise concluída</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-400">
          Detectamos os seguintes materiais na imagem:
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-2 my-3">
        <Badge className="bg-blue-500">PET</Badge>
        <Badge className="bg-amber-500">Vidro</Badge>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Condição dos materiais:</p>
        <div className="flex items-center text-sm text-green-700 dark:text-green-400">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
          Materiais limpos e adequados para reciclagem
        </div>
        <div className="flex items-center text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
          Recomendação: Remova rótulos das garrafas PET para melhor processamento
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium mb-2">Impacto estimado:</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Esta reciclagem economiza aproximadamente 0.5 kWh de energia e reduz 0.3 kg de emissões de CO₂.
        </p>
      </div>
    </div>
  )
}
