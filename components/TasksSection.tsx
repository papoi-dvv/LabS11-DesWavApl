'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStore, Task } from '@/lib/store'
import { AlertCircle, Loader2, Trash2, Pencil, Plus, Calendar } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'

const ITEMS_PER_PAGE = 5

export function TasksSection() {
  const { tasks, projects, teamMembers, addTask, updateTask, deleteTask } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDateline, setSelectedDateline] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState<{
    description: string
    projectId: string
    userId: string
    status: Task['status']
    priority: Task['priority']
    dateline: string
  }>({
    description: '',
    projectId: '',
    userId: '',
    status: 'To Do',
    priority: 'Medium',
    dateline: '',
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setFormData({
        description: '',
        projectId: '',
        userId: '',
        status: 'To Do',
        priority: 'Medium',
        dateline: '',
      })
      setSelectedDateline(undefined)
      setEditingId(null)
      setError('')
    }
  }

  const handleEdit = (task: Task) => {
    setEditingId(task.id)
    setFormData({
      description: task.description,
      projectId: task.projectId,
      userId: task.userId,
      status: task.status,
      priority: task.priority,
      dateline: task.dateline,
    })
    if (task.dateline) {
      setSelectedDateline(new Date(task.dateline))
    }
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.description.trim() || !formData.projectId || !formData.userId) {
      setError('Descripción, proyecto y usuario son obligatorios')
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (editingId) {
        updateTask(editingId, {
          ...formData,
          dateline: selectedDateline
            ? format(selectedDateline, 'yyyy-MM-dd')
            : formData.dateline,
        })
        setSuccessMessage('¡Tarea actualizada exitosamente!')
      } else {
        addTask({
          ...formData,
          dateline: selectedDateline
            ? format(selectedDateline, 'yyyy-MM-dd')
            : formData.dateline,
        })
        setSuccessMessage('¡Tarea creada exitosamente!')
      }

      setTimeout(() => {
        setSuccessMessage('')
        handleOpenChange(false)
        setCurrentPage(1)
      }, 2000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      deleteTask(id)
      setSuccessMessage('Tarea eliminada exitosamente')
      setTimeout(() => setSuccessMessage(''), 2000)
    } finally {
      setIsLoading(false)
    }
  }

  // Pagination
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return tasks.slice(start, end)
  }, [tasks, currentPage])

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)

  const getProjectName = (id: string) =>
    projects.find((p) => p.id === id)?.title || 'Desconocido'

  const getUserName = (id: string) =>
    teamMembers.find((m) => m.userId === id)?.name || 'Desconocido'

  const priorityColors: Record<string, string> = {
    Low: 'bg-blue-100 text-blue-900',
    Medium: 'bg-amber-100 text-amber-900',
    High: 'bg-red-100 text-red-900',
  }

  const statusColors: Record<string, string> = {
    'To Do': 'bg-slate-100 text-slate-900',
    'In Progress': 'bg-blue-100 text-blue-900',
    Done: 'bg-emerald-100 text-emerald-900',
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tareas</h2>
          <p className="text-slate-600 text-sm mt-1">
            Gestiona las tareas de tus proyectos ({tasks.length} total)
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-slate-900">
                {editingId ? 'Editar Tarea' : 'Crear Nueva Tarea'}
              </DialogTitle>
              <DialogDescription>
                Completa los detalles de la tarea
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
                <Label htmlFor="description" className="text-slate-900">
                  Descripción
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ej: Establecer Campamento Base"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectId" className="text-slate-900">
                  Proyecto
                </Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Selecciona un proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId" className="text-slate-900">
                  Asignar a
                </Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) => setFormData({ ...formData, userId: value })}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Selecciona un miembro" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.userId} value={member.userId}>
                        {member.name} ({member.position})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-slate-900">
                    Estado
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="To Do">To Do</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-slate-900">
                    Prioridad
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-900">Fecha Límite</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-slate-200"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDateline
                        ? format(selectedDateline, 'dd/MM/yyyy')
                        : 'Selecciona una fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDateline}
                      onSelect={setSelectedDateline}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border border-slate-200"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  editingId ? 'Actualizar Tarea' : 'Crear Tarea'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {successMessage && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <AlertDescription className="text-emerald-900">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Tasks Table */}
      {tasks.length > 0 ? (
        <>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {paginatedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-slate-900 text-sm">
                          {task.description}
                        </h4>
                        <Badge
                          className={`${priorityColors[task.priority]} border-0 whitespace-nowrap`}
                          variant="secondary"
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600 mb-3">
                        <p>
                          <span className="font-medium text-slate-700">Proyecto:</span>{' '}
                          {getProjectName(task.projectId)}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Asignado:</span>{' '}
                          {getUserName(task.userId)}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Límite:</span>{' '}
                          {task.dateline}
                        </p>
                        <Badge
                          className={`${statusColors[task.status]} border-0 w-fit`}
                          variant="secondary"
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200 text-slate-700 hover:bg-slate-50"
                        onClick={() => handleEdit(task)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(task.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent className="justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="pt-6">
            <p className="text-center text-slate-600">
              No hay tareas. ¡Crea una nueva para empezar!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
