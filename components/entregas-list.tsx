"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ImageIcon, FileCheck, Clock } from "lucide-react"
import Image from "next/image"

interface Entrega {
  id: number
  imagem_url: string
  quantidade: number
  tipo_residuo: string
  curso: string
  turma: string
  unidade: string
  pontos_obtidos: number
  status: string
  data_entrega: string
}

export function EntregasList({ turma = "todas" }: { turma?: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [entregas, setEntregas] = useState<Entrega[]>([])

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Construir URL com parâmetros
        let url = "/api/entregas"
        const params = new URLSearchParams()

        if (turma !== "todas") {
          params.append("turma", turma)
        }

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        // Buscar entregas
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Falha ao carregar entregas")
        }

        const result = await response.json()
        setEntregas(result.data || [])
      } catch (err) {
        console.error("Erro ao carregar entregas:", err)
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntregas()
  }, [turma])

  // Função para formatar a data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(data)
  }

  // Função para obter a cor do badge de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovada":
        return "bg-green-500"
      case "pendente":
        return "bg-amber-500"
      case "rejeitada":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Função para obter a cor do badge de tipo de resíduo
  const getTipoResiduoColor = (tipo: string) => {
    switch (tipo) {
      case "PET":
        return "bg-blue-500"
      case "Alumínio":
        return "bg-gray-500"
      case "Vidro":
        return "bg-amber-500"
      case "Papel":
        return "bg-green-500"
      default:
        return "bg-purple-500"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (entregas.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <FileCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Nenhuma entrega encontrada</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Não há registros de entregas para os filtros selecionados.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {entregas.map((entrega) => (
        <Card key={entrega.id} className="border-emerald-500 overflow-hidden">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative h-48 md:h-full bg-gray-100 dark:bg-gray-800">
              {entrega.imagem_url ? (
                <Image
                  src={entrega.imagem_url || "/placeholder.svg"}
                  alt={`Material ${entrega.tipo_residuo}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="md:col-span-2 p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getTipoResiduoColor(entrega.tipo_residuo)}>{entrega.tipo_residuo}</Badge>
                <Badge className={getStatusColor(entrega.status)}>
                  {entrega.status.charAt(0).toUpperCase() + entrega.status.slice(1)}
                </Badge>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {Number(entrega.quantidade).toFixed(1)} kg - {entrega.pontos_obtidos} pontos
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Curso:</strong> {entrega.curso}
                </p>
                <p>
                  <strong>Turma:</strong> {entrega.turma}
                </p>
                <p>
                  <strong>Unidade:</strong> {entrega.unidade}
                </p>
                <div className="flex items-center mt-4 text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatarData(entrega.data_entrega)}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
