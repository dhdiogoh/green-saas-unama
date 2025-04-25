"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronRight, Copy, ExternalLink, Eye, Lock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface EndpointProps {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  description: string
  requiresAuth?: boolean
  parameters?: {
    name: string
    in: "query" | "path" | "header" | "cookie"
    required?: boolean
    description: string
    schema: {
      type: string
      example?: string
    }
  }[]
  requestBody?: {
    description: string
    required?: boolean
    content: {
      "application/json": {
        schema: {
          type: string
          properties: Record<
            string,
            {
              type: string
              description: string
              example?: any
            }
          >
          required?: string[]
        }
      }
    }
  }
  responses: Record<
    string,
    {
      description: string
      content?: {
        "application/json": {
          schema: {
            type: string
            properties?: Record<
              string,
              {
                type: string
                description?: string
                example?: any
              }
            >
            example?: any
          }
        }
      }
    }
  >
}

const ApiEndpoint = ({ endpoint }: { endpoint: EndpointProps }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<"parameters" | "responses" | "schema">("parameters")
  const { toast } = useToast()

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-500 hover:bg-blue-600"
      case "POST":
        return "bg-green-500 hover:bg-green-600"
      case "PUT":
        return "bg-amber-500 hover:bg-amber-600"
      case "DELETE":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado para a área de transferência",
      description: "O conteúdo foi copiado para a área de transferência.",
    })
  }

  const renderRequestExample = () => {
    if (!endpoint.requestBody) return null

    const properties = endpoint.requestBody.content["application/json"].schema.properties
    const example: Record<string, any> = {}

    Object.keys(properties).forEach((key) => {
      example[key] = properties[key].example
    })

    return JSON.stringify(example, null, 2)
  }

  const renderResponseExample = (statusCode: string) => {
    const response = endpoint.responses[statusCode]
    if (!response.content) return null

    const example = response.content["application/json"].schema.example
    if (example) return JSON.stringify(example, null, 2)

    const properties = response.content["application/json"].schema.properties
    if (!properties) return null

    const exampleObj: Record<string, any> = {}
    Object.keys(properties).forEach((key) => {
      exampleObj[key] = properties[key].example
    })

    return JSON.stringify(exampleObj, null, 2)
  }

  return (
    <div className="border rounded-md mb-4 overflow-hidden">
      <div
        className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mr-2">{isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</div>
        <div
          className={`${getMethodColor(
            endpoint.method,
          )} text-white font-mono px-2 py-1 rounded-md text-sm font-bold w-20 text-center mr-3`}
        >
          {endpoint.method}
        </div>
        <div className="font-mono text-sm flex-1">{endpoint.path}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">{endpoint.description}</div>
        {endpoint.requiresAuth && (
          <div className="ml-2">
            <Lock size={16} className="text-amber-500" />
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="p-4 border-t">
          <div className="mb-4">
            <h3 className="font-bold mb-2">Descrição</h3>
            <p className="text-gray-700 dark:text-gray-300">{endpoint.description}</p>
            {endpoint.requiresAuth && (
              <div className="mt-2 flex items-center text-amber-600 dark:text-amber-400">
                <Lock size={16} className="mr-2" />
                <span className="text-sm">Requer autenticação</span>
              </div>
            )}
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">URL da Requisição</h3>
            <div className="flex items-center">
              <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm flex-1 overflow-x-auto">
                {`https://green-saas-mvp.vercel.app${endpoint.path}`}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(`https://green-saas-mvp.vercel.app${endpoint.path}`)}
                className="ml-2"
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="parameters" className="w-full" onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="parameters">Parâmetros</TabsTrigger>
              <TabsTrigger value="responses">Respostas</TabsTrigger>
              <TabsTrigger value="schema">Esquema</TabsTrigger>
            </TabsList>

            <TabsContent value="parameters">
              {endpoint.parameters && endpoint.parameters.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Localização
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Obrigatório
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Descrição
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {endpoint.parameters.map((param, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm font-mono">{param.name}</td>
                          <td className="px-4 py-2 text-sm">
                            <Badge
                              variant="outline"
                              className={
                                param.in === "path"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : param.in === "query"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                              }
                            >
                              {param.in}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 text-sm font-mono">{param.schema.type}</td>
                          <td className="px-4 py-2 text-sm">
                            {param.required ? (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Sim</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                Não
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : endpoint.requestBody ? (
                <div>
                  <h3 className="font-bold mb-2">Corpo da Requisição</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {endpoint.requestBody.description}{" "}
                    {endpoint.requestBody.required && (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 ml-2">
                        Obrigatório
                      </Badge>
                    )}
                  </p>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Exemplo</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => copyToClipboard(renderRequestExample() || "")}
                      >
                        <Copy size={14} className="mr-1" /> Copiar
                      </Button>
                    </div>
                    <Textarea
                      readOnly
                      value={renderRequestExample() || ""}
                      className="font-mono text-sm h-48 bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Nenhum parâmetro necessário</p>
              )}
            </TabsContent>

            <TabsContent value="responses">
              <div className="space-y-4">
                {Object.keys(endpoint.responses).map((statusCode) => (
                  <div key={statusCode} className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <Badge
                        className={
                          statusCode.startsWith("2")
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : statusCode.startsWith("4") || statusCode.startsWith("5")
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }
                      >
                        {statusCode}
                      </Badge>
                      <span className="ml-2 text-sm">{endpoint.responses[statusCode].description}</span>
                    </div>

                    {endpoint.responses[statusCode].content && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-sm">Exemplo de Resposta</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => copyToClipboard(renderResponseExample(statusCode) || "")}
                          >
                            <Copy size={14} className="mr-1" /> Copiar
                          </Button>
                        </div>
                        <Textarea
                          readOnly
                          value={renderResponseExample(statusCode) || ""}
                          className="font-mono text-sm h-32 bg-gray-50 dark:bg-gray-800"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="schema">
              {endpoint.requestBody ? (
                <div>
                  <h3 className="font-bold mb-2">Esquema de Requisição</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Propriedade
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Obrigatório
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {Object.entries(endpoint.requestBody.content["application/json"].schema.properties).map(
                          ([key, value]) => (
                            <tr key={key}>
                              <td className="px-4 py-2 text-sm font-mono">{key}</td>
                              <td className="px-4 py-2 text-sm font-mono">{value.type}</td>
                              <td className="px-4 py-2 text-sm">
                                {endpoint.requestBody.content["application/json"].schema.required?.includes(key) ? (
                                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                    Sim
                                  </Badge>
                                ) : (
                                  <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                    Não
                                  </Badge>
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm">{value.description}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Nenhum esquema de requisição definido</p>
              )}

              {Object.entries(endpoint.responses).some(
                ([_, response]) => response.content && response.content["application/json"].schema.properties,
              ) && (
                <div className="mt-6">
                  <h3 className="font-bold mb-2">Esquema de Resposta</h3>
                  {Object.entries(endpoint.responses)
                    .filter(
                      ([_, response]) => response.content && response.content["application/json"].schema.properties,
                    )
                    .map(([statusCode, response]) => (
                      <div key={statusCode} className="mb-4">
                        <h4 className="font-semibold mb-2">
                          Status {statusCode} - {response.description}
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Propriedade
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Tipo
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Descrição
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                              {Object.entries(response.content!["application/json"].schema.properties || {}).map(
                                ([key, value]) => (
                                  <tr key={key}>
                                    <td className="px-4 py-2 text-sm font-mono">{key}</td>
                                    <td className="px-4 py-2 text-sm font-mono">{value.type}</td>
                                    <td className="px-4 py-2 text-sm">{value.description || "-"}</td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-4 pt-4 border-t">
            <h3 className="font-bold mb-2">Testar Endpoint</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <Button className={`${getMethodColor(endpoint.method)} text-white`}>
                <Eye size={16} className="mr-2" /> Testar
              </Button>
              <Button variant="outline">
                <ExternalLink size={16} className="mr-2" /> Abrir no Postman
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ApiDocumentation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Definir os endpoints da API
  const endpoints: EndpointProps[] = [
    {
      method: "POST",
      path: "/api/create-user",
      description: "Cria um novo usuário no sistema",
      requiresAuth: true,
      requestBody: {
        description: "Informações do usuário a ser criado",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  description: "Email do usuário",
                  example: "usuario@exemplo.com",
                },
                password: {
                  type: "string",
                  description: "Senha do usuário",
                  example: "senha123",
                },
                fullName: {
                  type: "string",
                  description: "Nome completo do usuário",
                  example: "João Silva",
                },
              },
              required: ["email", "password", "fullName"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Usuário criado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    description: "Dados do usuário criado",
                    example: {
                      id: "123e4567-e89b-12d3-a456-426614174000",
                      email: "usuario@exemplo.com",
                      user_metadata: {
                        full_name: "João Silva",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Erro na requisição",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Email já está em uso",
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Erro interno do servidor",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      method: "GET",
      path: "/api/unidades",
      description: "Retorna todas as unidades cadastradas",
      responses: {
        "200": {
          description: "Lista de unidades retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    description: "Lista de unidades",
                    example: [
                      {
                        id: 1,
                        nome: "Unama Alcindo Cacela",
                        endereco: "Av. Alcindo Cacela, 287",
                        cidade: "Belém",
                        estado: "PA",
                        telefone: "(91) 3214-5000",
                        email: "contato@unama.br",
                        coordenadas_gps: "-1.4557, -48.4902",
                      },
                      {
                        id: 2,
                        nome: "Unama BR",
                        endereco: "Rod. BR-316, km 3",
                        cidade: "Ananindeua",
                        estado: "PA",
                        telefone: "(91) 3214-5100",
                        email: "contato.br@unama.br",
                        coordenadas_gps: "-1.3641, -48.3913",
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Erro ao buscar unidades: conexão com o banco de dados falhou",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      method: "GET",
      path: "/api/cursos",
      description: "Retorna todos os cursos ativos",
      responses: {
        "200": {
          description: "Lista de cursos retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    description: "Lista de cursos",
                    example: [
                      {
                        id: 1,
                        nome: "Ciência da Computação",
                        area_conhecimento: "Exatas",
                        duracao_semestres: 8,
                        grau: "Bacharelado",
                        ativo: true,
                      },
                      {
                        id: 2,
                        nome: "Engenharia Ambiental",
                        area_conhecimento: "Engenharias",
                        duracao_semestres: 10,
                        grau: "Bacharelado",
                        ativo: true,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Erro ao buscar cursos: conexão com o banco de dados falhou",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      method: "GET",
      path: "/api/ranking",
      description: "Retorna o ranking de turmas por pontuação",
      parameters: [
        {
          name: "curso",
          in: "query",
          required: false,
          description: "Filtrar por curso específico",
          schema: {
            type: "string",
            example: "Ciência da Computação",
          },
        },
        {
          name: "unidade",
          in: "query",
          required: false,
          description: "Filtrar por unidade específica",
          schema: {
            type: "string",
            example: "Unama Alcindo Cacela",
          },
        },
      ],
      responses: {
        "200": {
          description: "Ranking retornado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    description: "Lista de turmas ordenadas por pontuação",
                    example: [
                      {
                        turma: "Turma B",
                        curso: "Ciência da Computação",
                        unidade: "Unama Alcindo Cacela",
                        total_entregas: 12,
                        total_reciclado_kg: 45.5,
                        total_pontos: 2250,
                      },
                      {
                        turma: "Turma A",
                        curso: "Engenharia Ambiental",
                        unidade: "Unama BR",
                        total_entregas: 8,
                        total_reciclado_kg: 30.2,
                        total_pontos: 1800,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Erro ao buscar ranking: conexão com o banco de dados falhou",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      method: "POST",
      path: "/api/auth/verificar-usuario",
      description: "Verifica se um usuário está autorizado",
      requestBody: {
        description: "Dados para verificação do usuário",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  description: "Email do usuário",
                  example: "usuario@exemplo.com",
                },
                tipo_usuario: {
                  type: "string",
                  description: "Tipo de usuário (aluno ou instituicao)",
                  example: "aluno",
                },
                instituicao: {
                  type: "string",
                  description: "Nome da instituição",
                  example: "Unama Alcindo Cacela",
                },
              },
              required: ["email", "tipo_usuario", "instituicao"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Verificação concluída",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  autorizado: {
                    type: "boolean",
                    description: "Indica se o usuário está autorizado",
                    example: true,
                  },
                  dados: {
                    type: "object",
                    description: "Dados do usuário se autorizado",
                    example: {
                      tipo_usuario: "aluno",
                      instituicao: "Unama Alcindo Cacela",
                      curso: "Ciência da Computação",
                      turma: "Turma B",
                    },
                  },
                  mensagem: {
                    type: "string",
                    description: "Mensagem informativa",
                    example: "Usuário autorizado com sucesso",
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Erro na requisição",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Email, tipo de usuário e instituição são obrigatórios",
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Erro interno do servidor",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      method: "GET",
      path: "/api/entregas",
      description: "Retorna as entregas de materiais recicláveis",
      parameters: [
        {
          name: "turma",
          in: "query",
          required: false,
          description: "Filtrar por turma específica",
          schema: {
            type: "string",
            example: "Turma B",
          },
        },
        {
          name: "curso",
          in: "query",
          required: false,
          description: "Filtrar por curso específico",
          schema: {
            type: "string",
            example: "Ciência da Computação",
          },
        },
        {
          name: "unidade",
          in: "query",
          required: false,
          description: "Filtrar por unidade específica",
          schema: {
            type: "string",
            example: "Unama Alcindo Cacela",
          },
        },
      ],
      responses: {
        "200": {
          description: "Lista de entregas retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    description: "Lista de entregas",
                    example: [
                      {
                        id: 1,
                        imagem_url: "/circular-economy-flow.png",
                        quantidade: 2.5,
                        tipo_residuo: "PET",
                        curso: "Ciência da Computação",
                        turma: "Turma B",
                        unidade: "Unama Alcindo Cacela",
                        pontos_obtidos: 125,
                        status: "aprovada",
                        data_entrega: "2023-06-15T14:30:00Z",
                      },
                      {
                        id: 2,
                        imagem_url: "/recycled-aluminum.png",
                        quantidade: 1.8,
                        tipo_residuo: "Alumínio",
                        curso: "Engenharia Ambiental",
                        turma: "Turma A",
                        unidade: "Unama BR",
                        pontos_obtidos: 144,
                        status: "pendente",
                        data_entrega: "2023-06-14T10:15:00Z",
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Erro ao buscar entregas: conexão com o banco de dados falhou",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      method: "POST",
      path: "/api/entregas",
      description: "Registra uma nova entrega de material reciclável",
      requestBody: {
        description: "Dados da entrega",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                imagem_url: {
                  type: "string",
                  description: "URL da imagem do material",
                  example: "https://exemplo.com/imagem.jpg",
                },
                quantidade: {
                  type: "number",
                  description: "Quantidade em kg",
                  example: 2.5,
                },
                tipo_residuo: {
                  type: "string",
                  description: "Tipo de resíduo",
                  example: "PET",
                },
                curso: {
                  type: "string",
                  description: "Nome do curso",
                  example: "Ciência da Computação",
                },
                turma: {
                  type: "string",
                  description: "Nome da turma",
                  example: "Turma B",
                },
                unidade: {
                  type: "string",
                  description: "Nome da unidade",
                  example: "Unama Alcindo Cacela",
                },
              },
              required: ["imagem_url", "quantidade", "tipo_residuo", "curso", "turma", "unidade"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Entrega registrada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    description: "Indica se a operação foi bem-sucedida",
                    example: true,
                  },
                  data: {
                    type: "array",
                    description: "Dados da entrega registrada",
                    example: [
                      {
                        id: 1,
                        imagem_url: "https://exemplo.com/imagem.jpg",
                        quantidade: 2.5,
                        tipo_residuo: "PET",
                        curso: "Ciência da Computação",
                        turma: "Turma B",
                        unidade: "Unama Alcindo Cacela",
                        pontos_obtidos: 125,
                        status: "pendente",
                        data_entrega: "2023-06-15T14:30:00Z",
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Erro na requisição",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Quantidade deve ser um número positivo",
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Erro interno do servidor",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      method: "POST",
      path: "/api/upload",
      description: "Faz upload de uma imagem para o servidor",
      requestBody: {
        description: "Arquivo a ser enviado (multipart/form-data)",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                file: {
                  type: "string",
                  format: "binary",
                  description: "Arquivo a ser enviado",
                },
              },
              required: ["file"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Upload realizado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    description: "Indica se a operação foi bem-sucedida",
                    example: true,
                  },
                  url: {
                    type: "string",
                    description: "URL pública do arquivo enviado",
                    example: "https://exemplo.com/arquivos/imagem.jpg",
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Erro na requisição",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Nenhum arquivo fornecido",
                  },
                },
              },
            },
          },
        },
        "403": {
          description: "Permissão negada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Permissão negada para upload. Verifique as políticas de segurança do bucket.",
                  },
                  code: {
                    type: "string",
                    description: "Código de erro",
                    example: "RLS_VIOLATION",
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Erro interno do servidor",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      method: "GET",
      path: "/api/turmas",
      description: "Retorna as turmas disponíveis",
      parameters: [
        {
          name: "curso_id",
          in: "query",
          required: false,
          description: "Filtrar por ID do curso",
          schema: {
            type: "string",
            example: "1",
          },
        },
        {
          name: "unidade_id",
          in: "query",
          required: false,
          description: "Filtrar por ID da unidade",
          schema: {
            type: "string",
            example: "1",
          },
        },
        {
          name: "semestre",
          in: "query",
          required: false,
          description: "Filtrar por semestre",
          schema: {
            type: "string",
            example: "2023.1",
          },
        },
      ],
      responses: {
        "200": {
          description: "Lista de turmas retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    description: "Lista de turmas",
                    example: [
                      {
                        turma_id: 1,
                        turma_codigo: "CC2023-1A",
                        curso_id: 1,
                        curso_nome: "Ciência da Computação",
                        curso_grau: "Bacharelado",
                        unidade_id: 1,
                        unidade_nome: "Unama Alcindo Cacela",
                        turno: "Noturno",
                        semestre: "2023.1",
                        data_inicio: "2023-02-01",
                        vagas_totais: 50,
                        vagas_ocupadas: 45,
                        ativa: true,
                      },
                      {
                        turma_id: 2,
                        turma_codigo: "CC2023-1B",
                        curso_id: 1,
                        curso_nome: "Ciência da Computação",
                        curso_grau: "Bacharelado",
                        unidade_id: 1,
                        unidade_nome: "Unama Alcindo Cacela",
                        turno: "Matutino",
                        semestre: "2023.1",
                        data_inicio: "2023-02-01",
                        vagas_totais: 50,
                        vagas_ocupadas: 38,
                        ativa: true,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        "429": {
          description: "Muitas requisições",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Muitas requisições. Por favor, tente novamente em alguns instantes.",
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Erro ao buscar turmas: conexão com o banco de dados falhou",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      method: "GET",
      path: "/api/estatisticas",
      description: "Retorna estatísticas de reciclagem",
      parameters: [
        {
          name: "turma",
          in: "query",
          required: false,
          description: "Filtrar por turma específica",
          schema: {
            type: "string",
            example: "Turma B",
          },
        },
        {
          name: "curso",
          in: "query",
          required: false,
          description: "Filtrar por curso específico",
          schema: {
            type: "string",
            example: "Ciência da Computação",
          },
        },
        {
          name: "unidade",
          in: "query",
          required: false,
          description: "Filtrar por unidade específica",
          schema: {
            type: "string",
            example: "Unama Alcindo Cacela",
          },
        },
      ],
      responses: {
        "200": {
          description: "Estatísticas retornadas com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  estatisticasMateriais: {
                    type: "array",
                    description: "Estatísticas por tipo de material",
                    example: [
                      {
                        tipo_residuo: "PET",
                        total_entregas: 5,
                        total_kg: 20.5,
                        total_pontos: 1025,
                        percentual: 45.1,
                      },
                      {
                        tipo_residuo: "Alumínio",
                        total_entregas: 3,
                        total_kg: 15.0,
                        total_pontos: 1200,
                        percentual: 33.0,
                      },
                    ],
                  },
                  totalEntregas: {
                    type: "number",
                    description: "Total de entregas",
                    example: 12,
                  },
                  totalKg: {
                    type: "number",
                    description: "Total de kg reciclados",
                    example: 45.5,
                  },
                  totalPontos: {
                    type: "number",
                    description: "Total de pontos",
                    example: 2250,
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Mensagem de erro",
                    example: "Erro ao buscar estatísticas: conexão com o banco de dados falhou",
                  },
                },
              },
            },
          },
        },
      },
    },
  ]

  // Agrupar endpoints por tags
  const tags = [
    { id: "auth", name: "Autenticação", color: "bg-blue-500" },
    { id: "users", name: "Usuários", color: "bg-green-500" },
    { id: "entregas", name: "Entregas", color: "bg-amber-500" },
    { id: "estatisticas", name: "Estatísticas", color: "bg-purple-500" },
    { id: "instituicao", name: "Instituição", color: "bg-red-500" },
  ]

  // Mapear endpoints para tags
  const endpointTags = {
    "/api/create-user": ["users", "auth"],
    "/api/auth/verificar-usuario": ["auth"],
    "/api/unidades": ["instituicao"],
    "/api/cursos": ["instituicao"],
    "/api/turmas": ["instituicao"],
    "/api/entregas": ["entregas"],
    "/api/upload": ["entregas"],
    "/api/ranking": ["estatisticas"],
    "/api/estatisticas": ["estatisticas"],
  }

  // Filtrar endpoints com base na pesquisa e tag selecionada
  const filteredEndpoints = endpoints.filter((endpoint) => {
    const matchesSearch =
      searchTerm === "" ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag = selectedTag === null || (endpointTags as any)[endpoint.path]?.includes(selectedTag)

    return matchesSearch && matchesTag
  })

  return (
    <div className="container mx-auto py-8">
      <Card className="border-emerald-500">
        <CardHeader>
          <CardTitle className="text-2xl">Documentação da API Green SaaS</CardTitle>
          <CardDescription>
            Explore e teste os endpoints da API do Green SaaS. Base URL:{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-sm">
              https://green-saas-mvp.vercel.app
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-2/3">
              <Input
                placeholder="Pesquisar endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/3 flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                className="text-xs h-9"
                onClick={() => setSelectedTag(null)}
              >
                Todos
              </Button>
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  variant={selectedTag === tag.id ? "default" : "outline"}
                  className={`text-xs h-9 ${selectedTag === tag.id ? tag.color : ""}`}
                  onClick={() => setSelectedTag(tag.id)}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredEndpoints.map((endpoint, index) => (
              <ApiEndpoint key={index} endpoint={endpoint} />
            ))}

            {filteredEndpoints.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Nenhum endpoint encontrado com os filtros atuais.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
