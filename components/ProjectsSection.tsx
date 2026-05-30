'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStore, Project } from '@/lib/store'
import { AlertCircle, Loader2, Trash2, Eye } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

export function ProjectsSection() {
  const { projects, teamMembers, addProject, updateProject, deleteProject } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState<{
    title: string
    description: string
    status: Project['status']
    progress: number
    teamMemberIds: string[]
  }>({
    title: '',
    description: '',
    status: 'Planificado',
    progress: 0,
    teamMemberIds: [],
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setFormData({
        title: '',
        description: '',
        status: 'Planificado',
        progress: 0,
        teamMemberIds: [],
      })
      setEditingProjectId(null)
      setError('')
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProjectId(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      status: project.status,
      progress: project.progress,
      teamMemberIds: project.teamMemberIds,
    })
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('El título del proyecto es obligatorio')
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (editingProjectId) {
        updateProject(editingProjectId, {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          progress: formData.progress,
          teamMemberIds: formData.teamMemberIds,
        })
        setSuccessMessage('¡Proyecto actualizado exitosamente!')
      } else {
        addProject({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          progress: formData.progress,
          teamMemberIds: formData.teamMemberIds,
        })
        setSuccessMessage('¡Proyecto creado exitosamente!')
      }

      setTimeout(() => {
        setSuccessMessage('')
        handleOpenChange(false)
      }, 2000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      deleteProject(id)
      setSuccessMessage('Proyecto eliminado exitosamente')
      setIsDeleteOpen(false)
      setTimeout(() => setSuccessMessage(''), 2000)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTeamMember = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMemberIds: prev.teamMemberIds.includes(userId)
        ? prev.teamMemberIds.filter((id) => id !== userId)
        : [...prev.teamMemberIds, userId],
    }))
  }

  const getTeamMembersNames = (ids: string[]) => {
    return ids
      .map((id) => teamMembers.find((m) => m.userId === id)?.name)
      .filter(Boolean)
      .join(', ')
  }

  const statusColors: Record<string, string> = {
    Planificado: 'bg-slate-100 text-slate-900 border-slate-200',
    'En progreso': 'bg-blue-100 text-blue-900 border-blue-200',
    'En revisión': 'bg-amber-100 text-amber-900 border-amber-200',
    Completado: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Proyectos</h2>
          <p className="text-slate-600 text-sm mt-1">Gestiona tus expediciones y proyectos</p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800">
              + Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-slate-900">
                {editingProjectId ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
              </DialogTitle>
              <DialogDescription>
                {editingProjectId ? 'Actualiza los detalles de tu proyecto' : 'Añade los detalles de tu nuevo proyecto'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-900">{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="border-emerald-200 bg-emerald-50">
                  <AlertDescription className="text-emerald-900">{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-900">
                  Título del Proyecto
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Expedición Khumbu"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-900">
                  Descripción
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles del proyecto"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-900">
                  Estado
                </Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planificado">Planificado</SelectItem>
                    <SelectItem value="En progreso">En progreso</SelectItem>
                    <SelectItem value="En revisión">En revisión</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress" className="text-slate-900">
                  Progreso: {formData.progress}%
                </Label>
                <Input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-slate-900">Asignar Miembros</Label>
                <div className="border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-slate-50">
                  {teamMembers.map((member) => (
                    <div key={member.userId} className="flex items-center space-x-2">
                      <Checkbox
                        id={member.userId}
                        checked={formData.teamMemberIds.includes(member.userId)}
                        onCheckedChange={() => toggleTeamMember(member.userId)}
                        className="border-slate-300"
                      />
                      <label
                        htmlFor={member.userId}
                        className="text-sm text-slate-700 cursor-pointer flex-1"
                      >
                        {member.name} ({member.position})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingProjectId ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  editingProjectId ? 'Actualizar Proyecto' : 'Crear Proyecto'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg text-slate-900">{project.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {project.description}
                  </CardDescription>
                </div>
              </div>
              <Badge
                className={`w-fit mt-2 border ${statusColors[project.status]}`}
                variant="outline"
              >
                {project.status}
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Progreso</span>
                    <span className="font-medium text-slate-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-2">Equipo</p>
                  <p className="text-xs text-slate-700">
                    {getTeamMembersNames(project.teamMemberIds) || 'Sin asignar'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-slate-200">
                      <DialogHeader>
                        <DialogTitle className="text-slate-900">{selectedProject?.title}</DialogTitle>
                      </DialogHeader>
                      {selectedProject && (
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Descripción</p>
                            <p className="text-slate-700 mt-1">{selectedProject.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-slate-600">Estado</p>
                              <p className="text-slate-700 mt-1">{selectedProject.status}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-600">Progreso</p>
                              <p className="text-slate-700 mt-1">{selectedProject.progress}%</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600 mb-2">Miembros</p>
                            <div className="space-y-1">
                              {selectedProject.teamMemberIds.map((id) => {
                                const member = teamMembers.find((m) => m.userId === id)
                                return (
                                  <p key={id} className="text-sm text-slate-700">
                                    • {member?.name} - {member?.position}
                                  </p>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                    onClick={() => handleEditProject(project)}
                  >
                    Editar
                  </Button>

                  <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteProjectId(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-slate-200">
                      <DialogHeader>
                        <DialogTitle className="text-slate-900">Eliminar Proyecto</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsDeleteOpen(false)
                            setDeleteProjectId(null)
                          }}
                          className="border-slate-200"
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          disabled={isLoading}
                          onClick={() => {
                            if (deleteProjectId) {
                              handleDeleteProject(deleteProjectId)
                            }
                          }}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Eliminando...
                            </>
                          ) : (
                            'Eliminar'
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="pt-6">
            <p className="text-center text-slate-600">
              No hay proyectos. ¡Crea uno nuevo para empezar!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
