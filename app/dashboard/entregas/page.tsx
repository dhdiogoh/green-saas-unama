import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EntregasList } from "@/components/entregas-list"

export default function EntregasPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Histórico de Entregas"
        text="Visualize todas as entregas de materiais recicláveis registradas."
      />
      <div className="grid gap-8">
        <EntregasList />
      </div>
    </DashboardShell>
  )
}
