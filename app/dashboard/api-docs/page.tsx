import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ApiDocumentation } from "@/components/api-documentation"

export default function ApiDocsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Documentação da API" text="Explore e teste os endpoints da API do Green SaaS." />
      <div className="grid gap-8">
        <ApiDocumentation />
      </div>
    </DashboardShell>
  )
}
