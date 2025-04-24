import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TurmasView } from "@/components/turmas-view"

export default function AlunoRankingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Ranking de Turmas" text="Visualize o desempenho de todas as turmas no ranking." />
      <div className="grid gap-8">
        <TurmasView />
      </div>
    </DashboardShell>
  )
}
