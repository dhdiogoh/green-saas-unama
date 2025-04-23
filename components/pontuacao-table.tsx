import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"

export function PontuacaoTable() {
  return (
    <Card className="border-emerald-500 mt-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Trophy className="h-5 w-5 text-amber-500 mr-2" />
          Sistema de Pontuação
        </CardTitle>
        <CardDescription>
          Cada material tem um valor diferente. Quanto mais você recicla, mais pontos sua turma acumula! 🚀
        </CardDescription>
      </CardHeader>
      <CardContent>
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
        <p className="text-sm text-muted-foreground mt-2">
          💡 <strong>Dica:</strong> Materiais limpos e corretamente separados recebem bônus de pontuação!
        </p>
      </CardContent>
    </Card>
  )
}
