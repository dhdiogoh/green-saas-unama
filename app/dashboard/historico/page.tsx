import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { HistoricoEntregas } from "@/components/historico-entregas"

export default function HistoricoPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Histórico de Entregas"
        text="Acompanhe todas as suas contribuições para um mundo mais sustentável."
      />
      <div className="grid gap-8">
        <HistoricoEntregas />
      </div>
    </DashboardShell>
  )
}
