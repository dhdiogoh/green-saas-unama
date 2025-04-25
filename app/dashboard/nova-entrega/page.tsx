import { NovaEntregaForm } from "@/components/nova-entrega-form"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function NovaEntregaPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Nova Entrega de Material"
        text="Registre a contribuição de materiais recicláveis entregues pelos alunos."
      />
      <div className="grid gap-8">
        <NovaEntregaForm />
      </div>
    </DashboardShell>
  )
}
