import { NovaEntregaForm } from "@/components/nova-entrega-form"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function NovaEntregaPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Nova Entrega de Material"
        text="Registre sua contribuição para um mundo mais sustentável."
      />
      <div className="grid gap-8">
        <NovaEntregaForm />
      </div>
    </DashboardShell>
  )
}
