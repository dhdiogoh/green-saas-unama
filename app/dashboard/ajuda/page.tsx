import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { HelpContent } from "@/components/help-content"

export default function AjudaPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Central de Ajuda" text="Tudo o que você precisa saber para utilizar o Green SaaS." />
      <div className="grid gap-8">
        <HelpContent />
      </div>
    </DashboardShell>
  )
}
