"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAppData } from "@/hooks/use-app-data"

interface MapaEstaticoProps {
  instituicao: string
}

// URLs das imagens dos mapas para cada instituição (fallback)
const mapasInstituicoes = {
  "Unama Alcindo Cacela":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nGLC3wMZUUsTWxxohjglw1j294nMKX.png",
  "Unama BR": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nGLC3wMZUUsTWxxohjglw1j294nMKX.png",
  "Unama Gentil": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nGLC3wMZUUsTWxxohjglw1j294nMKX.png",
}

export function MapaEstatico({ instituicao }: MapaEstaticoProps) {
  const [mounted, setMounted] = useState(false)
  const { unidades, isLoadingUnidades } = useAppData()

  // Encontrar a unidade correspondente
  const unidade = unidades.find((u) => u.nome === instituicao)

  // Evitar erros de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoadingUnidades) {
    return (
      <div className="h-[400px] rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <p className="text-gray-500">Carregando mapa...</p>
      </div>
    )
  }

  // Obter a URL da imagem para a instituição selecionada
  const imagemUrl =
    mapasInstituicoes[instituicao as keyof typeof mapasInstituicoes] || mapasInstituicoes["Unama Alcindo Cacela"]

  // Obter coordenadas GPS se disponíveis
  const coordenadas = unidade?.coordenadas_gps || null

  return (
    <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={imagemUrl || "/placeholder.svg"}
            alt={`Mapa da ${instituicao}`}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />

          {/* Overlay com o nome da instituição */}
          <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-md z-10">
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{instituicao}</p>
            {unidade?.endereco && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{unidade.endereco}</p>}
          </div>

          {/* Coordenadas GPS se disponíveis */}
          {coordenadas && (
            <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-400">
              GPS: {coordenadas}
            </div>
          )}

          {/* Nota de ilustração */}
          <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-400">
            Imagem ilustrativa
          </div>
        </div>
      </div>
    </div>
  )
}
