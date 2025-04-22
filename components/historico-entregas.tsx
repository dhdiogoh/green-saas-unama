"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Dados mockados para o histórico de entregas
const entregas = [
  {
    id: "1",
    data: "15/04/2024",
    tipo: "PET",
    quantidade: "1.2 kg",
    unidade: "Centro",
  },
  {
    id: "2",
    data: "10/04/2024",
    tipo: "Alumínio",
    quantidade: "0.8 kg",
    unidade: "Zona Sul",
  },
  {
    id: "3",
    data: "05/04/2024",
    tipo: "Vidro",
    quantidade: "2.5 kg",
    unidade: "Centro",
  },
  {
    id: "4",
    data: "01/04/2024",
    tipo: "Papel",
    quantidade: "3.0 kg",
    unidade: "Zona Norte",
  },
  {
    id: "5",
    data: "25/03/2024",
    tipo: "PET",
    quantidade: "1.5 kg",
    unidade: "Centro",
  },
]

export function HistoricoEntregas() {
  const [tipoFiltro, setTipoFiltro] = useState<string>("")
  const [unidadeFiltro, setUnidadeFiltro] = useState<string>("")

  const entregasFiltradas = entregas.filter((entrega) => {
    const matchTipo = tipoFiltro ? entrega.tipo.toLowerCase() === tipoFiltro.toLowerCase() : true
    const matchUnidade = unidadeFiltro ? entrega.unidade.toLowerCase() === unidadeFiltro.toLowerCase() : true
    return matchTipo && matchUnidade
  })

  return (
    <Card className="border-emerald-500">
      <CardHeader>
        <CardTitle>Histórico de Entregas</CardTitle>
        <CardDescription>Visualize e filtre todas as suas entregas de materiais recicláveis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo de resíduo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="pet">PET</SelectItem>
                <SelectItem value="alumínio">Alumínio</SelectItem>
                <SelectItem value="vidro">Vidro</SelectItem>
                <SelectItem value="papel">Papel</SelectItem>
                <SelectItem value="pano">Pano</SelectItem>
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
                <SelectItem value="centro">Centro</SelectItem>
                <SelectItem value="zona sul">Zona Sul</SelectItem>
                <SelectItem value="zona norte">Zona Norte</SelectItem>
                <SelectItem value="zona leste">Zona Leste</SelectItem>
                <SelectItem value="zona oeste">Zona Oeste</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo de Material</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Unidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entregasFiltradas.length > 0 ? (
                entregasFiltradas.map((entrega) => (
                  <TableRow key={entrega.id}>
                    <TableCell>{entrega.data}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          entrega.tipo === "PET"
                            ? "bg-blue-500"
                            : entrega.tipo === "Alumínio"
                              ? "bg-gray-500"
                              : entrega.tipo === "Vidro"
                                ? "bg-amber-500"
                                : entrega.tipo === "Papel"
                                  ? "bg-green-500"
                                  : "bg-purple-500"
                        }
                      >
                        {entrega.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{entrega.quantidade}</TableCell>
                    <TableCell>{entrega.unidade}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhuma entrega encontrada com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
