import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardCards } from "@/components/dashboard-cards"
import { Button } from "@/components/ui/button"
import { Recycle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Bem-vindo(a), Estudante!"
        text="Acompanhe suas contribuições para um mundo mais sustentável."
      >
        <Link href="/dashboard/nova-entrega">
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            <Recycle className="mr-2 h-4 w-4" />
            Nova Entrega ♻️
          </Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCards />
      </div>
    </DashboardShell>
  )
}
