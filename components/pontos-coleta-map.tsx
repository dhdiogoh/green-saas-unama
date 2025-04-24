"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import L from "leaflet"

// Corrigir o problema dos ícones do Leaflet
const icon = L.icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Dados mockados dos pontos de coleta por instituição
const pontosColetaPorInstituicao = {
  "Unama Alcindo Cacela": [
    {
      id: 1,
      nome: "Ponto de Coleta - Bloco A",
      descricao: "Próximo à entrada principal",
      materiais: ["Papel", "Plástico", "Metal"],
      latitude: -1.4502,
      longitude: -48.4789,
    },
    {
      id: 2,
      nome: "Ponto de Coleta - Biblioteca",
      descricao: "Ao lado da biblioteca central",
      materiais: ["Papel", "Eletrônicos"],
      latitude: -1.451,
      longitude: -48.4795,
    },
    {
      id: 3,
      nome: "Ponto de Coleta - Cantina",
      descricao: "Área da cantina",
      materiais: ["Plástico", "Metal", "Vidro"],
      latitude: -1.4515,
      longitude: -48.478,
    },
  ],
  "Unama BR": [
    {
      id: 4,
      nome: "Ponto de Coleta - Entrada Principal",
      descricao: "Hall de entrada",
      materiais: ["Papel", "Plástico", "Metal", "Vidro"],
      latitude: -1.438,
      longitude: -48.465,
    },
    {
      id: 5,
      nome: "Ponto de Coleta - Laboratórios",
      descricao: "Corredor dos laboratórios",
      materiais: ["Eletrônicos", "Pilhas"],
      latitude: -1.439,
      longitude: -48.466,
    },
  ],
  "Unama Gentil": [
    {
      id: 6,
      nome: "Ponto de Coleta - Bloco B",
      descricao: "Próximo às salas de aula",
      materiais: ["Papel", "Plástico"],
      latitude: -1.442,
      longitude: -48.47,
    },
    {
      id: 7,
      nome: "Ponto de Coleta - Estacionamento",
      descricao: "Entrada do estacionamento",
      materiais: ["Metal", "Vidro", "Plástico"],
      latitude: -1.443,
      longitude: -48.471,
    },
  ],
}

// Coordenadas centrais para cada instituição
const coordenadasCentrais = {
  "Unama Alcindo Cacela": { latitude: -1.4508, longitude: -48.4788, zoom: 18 },
  "Unama BR": { latitude: -1.4385, longitude: -48.4655, zoom: 18 },
  "Unama Gentil": { latitude: -1.4425, longitude: -48.4705, zoom: 18 },
}

// Cores para os tipos de materiais
const coresMateriais = {
  Papel: "bg-blue-500",
  Plástico: "bg-red-500",
  Metal: "bg-gray-500",
  Vidro: "bg-amber-500",
  Eletrônicos: "bg-purple-500",
  Pilhas: "bg-green-500",
}

// Componente para centralizar o mapa na instituição
function MapCenterSetter({ instituicao }: { instituicao: string }) {
  const map = useMap()

  useEffect(() => {
    const coordenadas = coordenadasCentrais[instituicao as keyof typeof coordenadasCentrais]
    if (coordenadas) {
      map.setView([coordenadas.latitude, coordenadas.longitude], coordenadas.zoom)
    }
  }, [instituicao, map])

  return null
}

interface PontosColetaMapProps {
  instituicao: string
}

export function PontosColetaMap({ instituicao }: PontosColetaMapProps) {
  const [isClient, setIsClient] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      setIsClient(true)
      isMounted.current = true
    }
  }, [])

  // Obter os pontos de coleta para a instituição selecionada
  const pontosColeta = pontosColetaPorInstituicao[instituicao as keyof typeof pontosColetaPorInstituicao] || []

  // Obter as coordenadas centrais para a instituição
  const coordenadas = coordenadasCentrais[instituicao as keyof typeof coordenadasCentrais] || {
    latitude: -1.4508,
    longitude: -48.4788,
    zoom: 15,
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-500" />
          <p className="text-gray-500 dark:text-gray-400">Carregando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
      <MapContainer
        center={[coordenadas.latitude, coordenadas.longitude]}
        zoom={coordenadas.zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        className="z-0" // Garantir que o mapa tenha um z-index baixo
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Componente para centralizar o mapa na instituição */}
        <MapCenterSetter instituicao={instituicao} />

        {pontosColeta.map((ponto) => (
          <Marker key={ponto.id} position={[ponto.latitude, ponto.longitude]} icon={icon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-emerald-600">{ponto.nome}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{ponto.descricao}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {ponto.materiais.map((material) => (
                    <Badge
                      key={material}
                      className={coresMateriais[material as keyof typeof coresMateriais] || "bg-gray-500"}
                    >
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
