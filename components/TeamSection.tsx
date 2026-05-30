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
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { useStore, TeamMember } from '@/lib/store'
import { AlertCircle, Loader2, Trash2, Pencil, Plus } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'

export function TeamSection() {
  const { teamMembers, projects, addTeamMember, updateTeamMember, deleteTeamMember } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedBirthdate, setSelectedBirthdate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState<{
    name: string
    email: string
    position: string
    role: TeamMember['role']
    birthdate: string
    phone: string
    projectIds: string[]
    isActive: boolean
  }>({
    name: '',
    email: '',
    position: '',
    role: 'Developer',
    birthdate: '',
    phone: '',
    projectIds: [],
    isActive: true,
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setFormData({
        name: '',
        email: '',
        position: '',
        role: 'Developer',
        birthdate: '',
        phone: '',
        projectIds: [],
        isActive: true,
      })
      setSelectedBirthdate(undefined)
      setEditingId(null)
      setError('')
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.userId)
    setFormData({
      name: member.name,
      email: member.email,
      position: member.position,
      role: member.role,
      birthdate: member.birthdate,
      phone: member.phone,
      projectIds: member.projectIds,
      isActive: member.isActive,
    })
    if (member.birthdate) {
      setSelectedBirthdate(new Date(member.birthdate))
    }
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Nombre y correo son obligatorios')
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (editingId) {
        updateTeamMember(editingId, {
          ...formData,
          birthdate: selectedBirthdate
            ? format(selectedBirthdate, 'yyyy-MM-dd')
            : formData.birthdate,
        })
        setSuccessMessage('¡Miembro actualizado exitosamente!')
      } else {
        addTeamMember({
          ...formData,
          birthdate: selectedBirthdate
            ? format(selectedBirthdate, 'yyyy-MM-dd')
            : formData.birthdate,
        })
        setSuccessMessage('¡Miembro agregado exitosamente!')
      }

      setTimeout(() => {
        setSuccessMessage('')
        handleOpenChange(false)
      }, 2000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      deleteTeamMember(userId)
      setSuccessMessage('Miembro eliminado exitosamente')
      setTimeout(() => setSuccessMessage(''), 2000)
    } finally {
      setIsLoading(false)
    }
  }

  const getProjectNames = (ids: string[]) => {
    return ids
      .map((id) => projects.find((p) => p.id === id)?.title)
      .filter(Boolean)
      .join(', ')
  }

  const roleColors: Record<string, string> = {
    Developer: 'bg-blue-100 text-blue-900',
    Designer: 'bg-purple-100 text-purple-900',
    Manager: 'bg-green-100 text-green-900',
    DevOps: 'bg-orange-100 text-orange-900',
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Equipo</h2>
          <p className="text-slate-600 text-sm mt-1">Gestiona los miembros del equipo</p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Miembro
            </Button>
          </DialogTrigger>
          <DialogContent className="border-slate-200 max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-slate-900">
                {editingId ? 'Editar Miembro' : 'Agregar Nuevo Miembro'}
              </DialogTitle>
              <DialogDescription>
                Completa los datos del miembro del equipo
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-900">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Sherpa Pemba"
                    className="border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-900">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-slate-900">
                    Posición
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Ej: Senior Guide"
                    className="border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-900">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1-555-0101"
                    className="border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-900">
                  Rol
                </Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-900">Fecha de Nacimiento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-slate-200"
                    >
                      {selectedBirthdate
                        ? format(selectedBirthdate, 'dd/MM/yyyy')
                        : 'Selecciona una fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-slate-200" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedBirthdate}
                      onSelect={setSelectedBirthdate}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      className="rounded-md border border-slate-200"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <Label htmlFor="isActive" className="text-slate-900">
                  Miembro Activo
                </Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? 'Actualizando...' : 'Agregando...'}
                  </>
                ) : (
                  editingId ? 'Actualizar Miembro' : 'Agregar Miembro'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card
            key={member.userId}
            className={`border-slate-200 shadow-sm hover:shadow-md transition-shadow ${
              !member.isActive ? 'opacity-60' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-10 w-10 bg-slate-900">
                    <AvatarFallback className="text-white">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-slate-900 text-base truncate">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {member.position}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  className={`${roleColors[member.role]} border-0`}
                  variant="secondary"
                >
                  {member.role}
                </Badge>
              </div>
              {!member.isActive && (
                <Badge variant="secondary" className="w-fit mt-2 bg-slate-200 text-slate-700">
                  Inactivo
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="text-xs space-y-1 text-slate-600 border-t border-slate-100 pt-3">
                <p>
                  <span className="font-medium">Email:</span> {member.email}
                </p>
                <p>
                  <span className="font-medium">Teléfono:</span> {member.phone}
                </p>
                <p>
                  <span className="font-medium">Nacimiento:</span> {member.birthdate}
                </p>
                <p>
                  <span className="font-medium">Proyectos:</span>{' '}
                  {getProjectNames(member.projectIds) || 'Ninguno'}
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => handleEdit(member)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(member.userId)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="pt-6">
            <p className="text-center text-slate-600">
              No hay miembros en el equipo. ¡Agrega uno para empezar!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
