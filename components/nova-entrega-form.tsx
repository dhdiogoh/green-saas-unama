"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Trash2, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AIAnalysisResult } from "@/components/ai-analysis-result"
import { PontuacaoTable } from "@/components/pontuacao-table"

export function NovaEntregaForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
        simulateAIAnalysis()
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setAiAnalysisComplete(true)
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulando envio
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setAiAnalysisComplete(false)
  }

  return (
    <form id="form-entrega" onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-emerald-500">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upload-imagem">Imagem do Material</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="upload-imagem"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-emerald-500 hover:border-emerald-400"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-contain p-2"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-emerald-600 dark:text-emerald-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG ou JPEG (MAX. 5MB)</p>
                      </div>
                    )}
                    <input
                      id="upload-imagem"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade (kg)</Label>
                <Input id="quantidade" type="number" step="0.1" min="0.1" placeholder="0.0" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo-residuo">Tipo de Resíduo</Label>
                <Select required>
                  <SelectTrigger id="tipo-residuo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluminio">Alumínio</SelectItem>
                    <SelectItem value="vidro">Vidro</SelectItem>
                    <SelectItem value="pet">PET</SelectItem>
                    <SelectItem value="papel">Papel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="curso">Curso</Label>
                <Select required>
                  <SelectTrigger id="curso">
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ciencia-computacao">Ciência da Computação</SelectItem>
                    <SelectItem value="odontologia">Odontologia</SelectItem>
                    <SelectItem value="direito">Direito</SelectItem>
                    <SelectItem value="engenharia">Engenharia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="turma">Turma</Label>
                <Select required>
                  <SelectTrigger id="turma">
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="turma-a">Turma A</SelectItem>
                    <SelectItem value="turma-b">Turma B</SelectItem>
                    <SelectItem value="turma-c">Turma C</SelectItem>
                    <SelectItem value="turma-d">Turma D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Select required>
                  <SelectTrigger id="unidade">
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alcindo-cacela">Unama Alcindo Cacela</SelectItem>
                    <SelectItem value="br">Unama BR</SelectItem>
                    <SelectItem value="gentil">Unama Gentil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {imagePreview && (
        <Card className="border-emerald-500">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Análise de Inteligência Artificial</h3>
              <Separator />
              <div id="resposta-ia">
                {isAnalyzing ? (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
                    <p className="ml-2 text-emerald-700 dark:text-emerald-400">
                      Analisando imagem com inteligência artificial...
                    </p>
                  </div>
                ) : aiAnalysisComplete ? (
                  <AIAnalysisResult />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">Envie uma imagem para análise automática</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <PontuacaoTable />

      <div className="flex justify-end">
        <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar entrega"
          )}
        </Button>
      </div>
    </form>
  )
}
