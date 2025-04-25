"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Trash2, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PontuacaoTable } from "@/components/pontuacao-table"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export function NovaEntregaForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    quantidade: "",
    tipo_residuo: "",
    curso_id: "",
    unidade_id: "",
    turma_id: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Reset any previous errors
      setUploadError(null)

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("O arquivo é muito grande. O tamanho máximo permitido é 5MB.")
        return
      }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Tipo de arquivo não suportado. Use PNG, JPG ou JPEG.")
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageFile(null)
    setUploadProgress(0)
    setUploadError(null)
  }

  // Função para upload de imagem para o Supabase Storage
  const uploadImageToStorage = async (file: File): Promise<string> => {
    try {
      // Reset error state
      setUploadError(null)

      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Em modo de demonstração, retornar uma URL de placeholder
      if (!supabase || !supabase.storage) {
        console.log("Modo de demonstração: simulando upload para Storage")
        clearInterval(progressInterval)
        setUploadProgress(100)
        return `/placeholder.svg?height=400&width=600&query=recycling material ${file.name}`
      }

      // Gerar um nome único para o arquivo
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `entregas/${fileName}`

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage.from("materiais-reciclados").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (error) {
        console.error("Erro ao fazer upload da imagem:", error)
        setUploadError(error.message)
        // Fallback para URL de placeholder em caso de erro
        return `/placeholder.svg?height=400&width=600&query=recycling material error`
      }

      // Obter URL pública do arquivo
      const {
        data: { publicUrl },
      } = supabase.storage.from("materiais-reciclados").getPublicUrl(filePath)

      return publicUrl
    } catch (error: any) {
      console.error("Erro ao processar upload:", error)
      setUploadProgress(100)
      setUploadError(error.message || "Erro ao processar o upload da imagem")
      // Fallback para URL de placeholder em caso de erro
      return `/placeholder.svg?height=400&width=600&query=recycling material fallback`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setUploadError(null)
    setSuccessMessage(null)

    try {
      // Mapear IDs de turma para códigos de turma
      const turmaMap = {
        "1": "Turma A",
        "2": "Turma B",
        "3": "Turma C",
        "4": "Turma D",
      }

      // Mapear IDs de unidade para nomes de unidade
      const unidadeMap = {
        "1": "Unama Alcindo Cacela",
        "2": "Unama BR",
        "3": "Unama Gentil",
      }

      // Mapear IDs de curso para nomes de curso
      const cursoMap = {
        "1": "Ciência da Computação",
        "2": "Engenharia Ambiental",
        "3": "Administração",
        "4": "Direito",
      }

      // Verificar se há uma imagem para upload
      if (!imageFile) {
        throw new Error("Por favor, faça o upload de uma imagem do material reciclável.")
      }

      // 1. Fazer upload da imagem para o Storage e obter a URL
      const imageUrl = await uploadImageToStorage(imageFile)

      // Se temos um erro de upload e não é uma URL de fallback, interromper o processo
      if (uploadError && !imageUrl.includes("placeholder.svg")) {
        throw new Error(uploadError)
      }

      // 2. Enviar dados para a API
      const response = await fetch("/api/entregas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imagem_url: imageUrl,
          quantidade: Number.parseFloat(formData.quantidade),
          tipo_residuo: formData.tipo_residuo,
          curso: cursoMap[formData.curso_id as keyof typeof cursoMap] || "Curso não especificado",
          turma: turmaMap[formData.turma_id as keyof typeof turmaMap] || "Turma não especificada",
          unidade: unidadeMap[formData.unidade_id as keyof typeof unidadeMap] || "Unidade não especificada",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }))
        throw new Error(errorData.error || "Erro ao salvar entrega")
      }

      const result = await response.json()
      console.log("Entrega registrada com sucesso:", result)

      toast({
        title: "Entrega registrada com sucesso!",
        description: "A contribuição do aluno foi registrada com sucesso.",
        variant: "default",
      })

      // Mostrar um alerta de sucesso na tela
      setUploadError(null)
      setIsLoading(false)
      setUploadProgress(0)

      // Mostrar alerta de sucesso e depois redirecionar
      setSuccessMessage("Entrega registrada com sucesso! Redirecionando para o dashboard...")
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 3000)
    } catch (error: any) {
      console.error("Erro ao enviar entrega:", error)
      setUploadError(error.message || "Ocorreu um erro ao processar sua solicitação.")
      toast({
        title: "Erro ao registrar entrega",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <form id="form-entrega" onSubmit={handleSubmit} className="space-y-8">
      {successMessage && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20 mb-6">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-400">Sucesso!</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">{successMessage}</AlertDescription>
        </Alert>
      )}
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
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-2">
                            <div className="bg-emerald-500 h-2" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                        )}
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

                {uploadError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade (kg)</Label>
                <Input
                  id="quantidade"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="0.0"
                  value={formData.quantidade}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_residuo">Tipo de Resíduo</Label>
                <Select
                  value={formData.tipo_residuo}
                  onValueChange={(value) => handleSelectChange("tipo_residuo", value)}
                  required
                >
                  <SelectTrigger id="tipo_residuo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alumínio">Alumínio</SelectItem>
                    <SelectItem value="Vidro">Vidro</SelectItem>
                    <SelectItem value="PET">PET</SelectItem>
                    <SelectItem value="Papel">Papel</SelectItem>
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
                <Label htmlFor="unidade_id">Unidade</Label>
                <Select
                  value={formData.unidade_id}
                  onValueChange={(value) => handleSelectChange("unidade_id", value)}
                  required
                >
                  <SelectTrigger id="unidade_id">
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Unama Alcindo Cacela</SelectItem>
                    <SelectItem value="2">Unama BR</SelectItem>
                    <SelectItem value="3">Unama Gentil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="curso_id">Curso</Label>
                <Select
                  value={formData.curso_id}
                  onValueChange={(value) => handleSelectChange("curso_id", value)}
                  required
                >
                  <SelectTrigger id="curso_id">
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ciência da Computação</SelectItem>
                    <SelectItem value="2">Engenharia Ambiental</SelectItem>
                    <SelectItem value="3">Administração</SelectItem>
                    <SelectItem value="4">Direito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="turma_id">Turma</Label>
                <Select
                  value={formData.turma_id}
                  onValueChange={(value) => handleSelectChange("turma_id", value)}
                  required
                >
                  <SelectTrigger id="turma_id">
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Turma A</SelectItem>
                    <SelectItem value="2">Turma B</SelectItem>
                    <SelectItem value="3">Turma C</SelectItem>
                    <SelectItem value="4">Turma D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PontuacaoTable />

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600"
          disabled={
            isLoading ||
            !imagePreview ||
            !formData.quantidade ||
            !formData.tipo_residuo ||
            !formData.curso_id ||
            !formData.unidade_id ||
            !formData.turma_id ||
            !!uploadError
          }
        >
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
