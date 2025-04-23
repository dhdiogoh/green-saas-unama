import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Recycle, BarChart3, Trophy, Leaf, HelpCircle } from "lucide-react"

export function HelpContent() {
  return (
    <Card className="border-emerald-500">
      <CardHeader>
        <CardTitle className="text-2xl text-emerald-600">Bem-vindo ao Green SaaS! 🌱</CardTitle>
        <CardDescription className="text-base">
          Sua plataforma para transformar resíduos em recursos e impactar positivamente o meio ambiente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800">
          <InfoIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <AlertTitle className="text-emerald-800 dark:text-emerald-400">Versão MVP</AlertTitle>
          <AlertDescription className="text-emerald-700 dark:text-emerald-400">
            Esta é uma versão inicial do Green SaaS, desenvolvida para demonstrar o conceito e funcionalidades
            principais. Estamos constantemente melhorando a plataforma com base no feedback dos usuários.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-emerald-600 flex items-center">
            <Leaf className="mr-2 h-5 w-5" /> Sobre o Projeto
          </h3>
          <p>
            O Green SaaS é uma plataforma inovadora que incentiva a reciclagem entre turmas universitárias da Unama,
            transformando a sustentabilidade em uma competição saudável! 🏆 Através de um sistema de pontuação baseado
            na quantidade e tipo de material reciclado, as turmas competem entre si para alcançar o topo do ranking e
            contribuir para um planeta mais sustentável.
          </p>
          <p>
            Cada entrega é registrada, pontuada e exibida em tempo real nos dashboards, criando um ambiente de
            engajamento contínuo e competição saudável entre as turmas. 📊
          </p>
        </div>

        <Tabs defaultValue="areas">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="areas">Áreas do Aplicativo</TabsTrigger>
            <TabsTrigger value="pontuacao">Sistema de Pontuação</TabsTrigger>
          </TabsList>

          <TabsContent value="areas" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800">
                <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" /> Dashboard
                </h4>
                <p className="mt-2 text-emerald-700 dark:text-emerald-400">
                  O coração do Green SaaS! 💚 Aqui você encontra:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-emerald-700 dark:text-emerald-400">
                  <li>Visão geral do total reciclado, pontuação e entregas recentes</li>
                  <li>Gráficos detalhados por tipo de material (PET, Alumínio, Vidro, Papel)</li>
                  <li>Ranking das turmas com maior pontuação</li>
                  <li>Gráfico de progresso ao longo do tempo</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800">
                <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 flex items-center">
                  <Recycle className="mr-2 h-5 w-5" /> Nova Entrega
                </h4>
                <p className="mt-2 text-emerald-700 dark:text-emerald-400">
                  Registre suas contribuições para um mundo mais sustentável! ♻️
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-emerald-700 dark:text-emerald-400">
                  <li>Selecione o tipo de material, quantidade, curso e unidade</li>
                  <li>Receba feedback imediato sobre a condição dos materiais</li>
                  <li>Visualize o impacto ambiental estimado da sua contribuição</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800">
                <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" /> Ajuda
                </h4>
                <p className="mt-2 text-emerald-700 dark:text-emerald-400">
                  Você está aqui! 📍 Central de informações para:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-emerald-700 dark:text-emerald-400">
                  <li>Entender o funcionamento da plataforma</li>
                  <li>Conhecer o sistema de pontuação</li>
                  <li>Tirar dúvidas sobre as funcionalidades</li>
                  <li>Aprender como maximizar sua contribuição ambiental</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pontuacao" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <Trophy className="h-6 w-6 text-amber-500 mr-2" />
                <h4 className="text-lg font-semibold">Como funciona a pontuação?</h4>
              </div>
              <p>
                Cada tipo de material reciclável tem um valor de pontos diferente, baseado em seu impacto ambiental e
                dificuldade de reciclagem. Quanto mais você recicla, mais pontos sua turma acumula! 🚀
              </p>

              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-emerald-50 dark:bg-emerald-900/20">
                    <TableRow>
                      <TableHead className="font-semibold">Material</TableHead>
                      <TableHead className="font-semibold">Pontos por kg</TableHead>
                      <TableHead className="font-semibold">Impacto Ambiental</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">PET</TableCell>
                      <TableCell>50 pontos</TableCell>
                      <TableCell>Redução de 3.0 kg de CO₂</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Alumínio</TableCell>
                      <TableCell>80 pontos</TableCell>
                      <TableCell>Economia de 5.0 kWh de energia</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Vidro</TableCell>
                      <TableCell>30 pontos</TableCell>
                      <TableCell>Redução de 0.3 kg de CO₂</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Papel</TableCell>
                      <TableCell>20 pontos</TableCell>
                      <TableCell>Preservação de 1 árvore a cada 50kg</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h5 className="font-semibold flex items-center">
                  <InfoIcon className="h-4 w-4 mr-2 text-amber-600" /> Dica para maximizar pontos
                </h5>
                <p className="mt-2 text-sm">
                  Materiais limpos e corretamente separados recebem bônus de pontuação! 🌟 Remova rótulos, tampas e
                  resíduos antes de entregar para reciclagem.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
