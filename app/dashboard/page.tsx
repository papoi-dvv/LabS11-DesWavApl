"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewSection } from "@/components/OverviewSection"
import { ProjectsSection } from "@/components/ProjectsSection"
import { TeamSection } from "@/components/TeamSection"
import { TasksSection } from "@/components/TasksSection"
import { SettingsSection } from "@/components/SettingsSection"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Dashboard Everest Blanc
          </h1>
          <p className="text-slate-600">
            Sistema de Gestión de Proyectos y Expediciones
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">Resumen</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">Proyectos</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">Equipo</TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">Tareas</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab: Overview */}
          <TabsContent value="overview">
            <OverviewSection />
          </TabsContent>

          {/* Tab: Projects */}
          <TabsContent value="projects">
            <ProjectsSection />
          </TabsContent>

          {/* Tab: Team */}
          <TabsContent value="team">
            <TeamSection />
          </TabsContent>

          {/* Tab: Tasks */}
          <TabsContent value="tasks">
            <TasksSection />
          </TabsContent>

          {/* Tab: Settings */}
          <TabsContent value="settings">
            <SettingsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

