"use client"

import { useState, useEffect } from "react"

export interface Unidade {
  id: number
  nome: string
  endereco: string
  cidade: string
  estado: string
  telefone: string
  email: string
  coordenadas_gps: string
}

export interface Curso {
  id: number
  nome: string
  area_conhecimento: string
  duracao_semestres: number
  grau: string
  ativo: boolean
}

export interface Turma {
  turma_id: number
  turma_codigo: string
  curso_id: number
  curso_nome: string
  curso_grau: string
  unidade_id: number
  unidade_nome: string
  turno: string
  semestre: string
  data_inicio: string
  vagas_totais: number
  vagas_ocupadas: number
  ativa: boolean
}

export function useAppData() {
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [isLoadingUnidades, setIsLoadingUnidades] = useState(true)
  const [isLoadingCursos, setIsLoadingCursos] = useState(true)
  const [isLoadingTurmas, setIsLoadingTurmas] = useState(true)
  const [errorUnidades, setErrorUnidades] = useState<string | null>(null)
  const [errorCursos, setErrorCursos] = useState<string | null>(null)
  const [errorTurmas, setErrorTurmas] = useState<string | null>(null)

  // Buscar unidades
  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        setIsLoadingUnidades(true)
        setErrorUnidades(null)

        const response = await fetch("/api/unidades")

        // Verificar status HTTP antes de tentar processar JSON
        if (response.status === 429) {
          throw new Error("Muitas requisições. Por favor, tente novamente em alguns instantes.")
        }

        if (!response.ok) {
          throw new Error(`Falha ao carregar unidades: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        setUnidades(result.data || [])
      } catch (err) {
        console.error("Erro ao carregar unidades:", err)
        setErrorUnidades(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setIsLoadingUnidades(false)
      }
    }

    fetchUnidades()
  }, [])

  // Buscar cursos
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setIsLoadingCursos(true)
        setErrorCursos(null)

        const response = await fetch("/api/cursos")

        // Verificar status HTTP antes de tentar processar JSON
        if (response.status === 429) {
          throw new Error("Muitas requisições. Por favor, tente novamente em alguns instantes.")
        }

        if (!response.ok) {
          throw new Error(`Falha ao carregar cursos: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        setCursos(result.data || [])
      } catch (err) {
        console.error("Erro ao carregar cursos:", err)
        setErrorCursos(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setIsLoadingCursos(false)
      }
    }

    fetchCursos()
  }, [])

  // Buscar turmas
  const fetchTurmas = async (cursoId?: number, unidadeId?: number) => {
    try {
      setIsLoadingTurmas(true)
      setErrorTurmas(null)

      // Construir parâmetros de consulta
      const params = new URLSearchParams()
      if (cursoId) params.append("curso_id", cursoId.toString())
      if (unidadeId) params.append("unidade_id", unidadeId.toString())

      const response = await fetch(`/api/turmas?${params.toString()}`)

      // Verificar status HTTP antes de tentar processar JSON
      if (response.status === 429) {
        throw new Error("Muitas requisições. Por favor, tente novamente em alguns instantes.")
      }

      if (!response.ok) {
        throw new Error(`Falha ao carregar turmas: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      // Verificar se há um erro na resposta JSON
      if (result.error) {
        throw new Error(result.error)
      }

      setTurmas(result.data || [])
      return result.data || []
    } catch (err) {
      console.error("Erro ao carregar turmas:", err)
      setErrorTurmas(err instanceof Error ? err.message : "Erro desconhecido")
      return []
    } finally {
      setIsLoadingTurmas(false)
    }
  }

  // Buscar todas as turmas ao inicializar
  useEffect(() => {
    fetchTurmas()
  }, [])

  return {
    unidades,
    cursos,
    turmas,
    isLoadingUnidades,
    isLoadingCursos,
    isLoadingTurmas,
    errorUnidades,
    errorCursos,
    errorTurmas,
    fetchTurmas,
  }
}
