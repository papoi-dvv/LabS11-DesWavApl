'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useStore } from '@/lib/store'
import { AlertCircle, Users, CheckCircle2, TrendingUp } from 'lucide-react'

export function OverviewSection() {
  const { 
    projects, 
    teamMembers, 
    tasks,
    getActiveProjectsCount,
    getTeamMembersCount,
    getCompletedTasksPercentage,
    getCriticalTasks
  } = useStore()

  const stats = [
    {
      title: 'Proyectos Activos',
      value: getActiveProjectsCount(),
      icon: TrendingUp,
      description: 'En desarrollo',
      color: 'text-blue-600',
    },
    {
      title: 'Miembros del Equipo',
      value: getTeamMembersCount(),
      icon: Users,
      description: 'Activos',
      color: 'text-emerald-600',
    },
    {
      title: 'Tareas Completadas',
      value: `${getCompletedTasksPercentage()}%`,
      icon: CheckCircle2,
      description: 'De todas las tareas',
      color: 'text-violet-600',
    },
    {
      title: 'Tareas Críticas',
      value: getCriticalTasks().length,
      icon: AlertCircle,
      description: 'Requieren atención',
      color: 'text-red-600',
    },
  ]

  const recentActivity = [
    { user: 'María García', action: 'completó la tarea', task: 'Diseño de UI', time: 'Hace 5 min' },
    { user: 'Juan Pérez', action: 'comentó en', task: 'API Backend', time: 'Hace 1 hora' },
    { user: 'Ana López', action: 'creó un nuevo', task: 'Proyecto Mobile', time: 'Hace 2 horas' },
    { user: 'Carlos Ruiz', action: 'actualizó', task: 'Documentación', time: 'Hace 3 horas' },
  ]

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-600 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas actualizaciones de tus proyectos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 pb-4 last:pb-0 border-b last:border-0 border-slate-100">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-slate-200 text-slate-700 text-sm">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 leading-none">
                    {activity.user}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {activity.action} <span className="font-medium">{activity.task}</span>
                  </p>
                </div>
                <div className="text-sm text-slate-500 whitespace-nowrap">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects Overview */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Proyectos en Progreso</CardTitle>
          <CardDescription>
            Estado actual de expediciones activas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="space-y-2 pb-4 last:pb-0 border-b last:border-0 border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{project.title}</p>
                    <p className="text-xs text-slate-600">{project.description}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-sky-50 text-sky-900 border-sky-200 whitespace-nowrap ml-2"
                  >
                    {project.progress}%
                  </Badge>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-slate-900 to-blue-600 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
