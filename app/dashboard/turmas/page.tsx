import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TurmasView } from "@/components/turmas-view"

export default function TurmasPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Gerenciamento de Turmas" text="Visualize e gerencie todas as turmas e seus alunos." />
      <div className="grid gap-8">
        <TurmasView />
      </div>
    </DashboardShell>
  )
}
