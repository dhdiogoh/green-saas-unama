"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardCards } from "@/components/dashboard-cards"
import { DashboardCharts } from "@/components/dashboard-charts"
import { ClassSelector } from "@/components/class-selector"
import { Button } from "@/components/ui/button"
import { Recycle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [selectedTurma, setSelectedTurma] = useState("todas")

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Bem-vindo(a), Administrador!"
        text="Painel de controle para monitoramento de reciclagem por turmas."
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <ClassSelector onSelect={setSelectedTurma} />
          <Link href="/dashboard/nova-entrega">
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Recycle className="mr-2 h-4 w-4" />
              Nova Entrega ♻️
            </Button>
          </Link>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCards turma={selectedTurma} />
      </div>

      <div className="mt-6">
        <DashboardCharts turma={selectedTurma} />
      </div>
    </DashboardShell>
  )
}
