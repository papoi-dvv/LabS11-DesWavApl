'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useStore } from '@/lib/store'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function SettingsSection() {
  const { settings, updateSettings } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState(settings)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulando carga
      await new Promise((resolve) => setTimeout(resolve, 2000))
      updateSettings(formData)
      setSuccessMessage('¡Configuración guardada exitosamente!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Configuración</h2>
        <p className="text-slate-600 text-sm mt-1">Administra las preferencias del sistema</p>
      </div>

      {successMessage && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-900 ml-2">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Settings */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Organización</CardTitle>
            <CardDescription>
              Información general de la organización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizationName" className="text-slate-900">
                Nombre de la Organización
              </Label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({ ...formData, organizationName: e.target.value })
                }
                placeholder="Ej: Expedición Everest 2026"
                className="border-slate-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Localization Settings */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Localización</CardTitle>
            <CardDescription>
              Configura idioma y zona horaria
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-slate-900">
                Idioma
              </Label>
              <Select
                value={formData.language}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, language: value })
                }
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-slate-900">
                Zona Horaria
              </Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) =>
                  setFormData({ ...formData, timezone: value })
                }
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="UTC+5:45">UTC+5:45 (Nepal)</SelectItem>
                  <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                  <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Notificaciones</CardTitle>
            <CardDescription>
              Gestiona tus preferencias de notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-slate-900">
                  Notificaciones por Correo
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Recibe alertas y actualizaciones por correo electrónico
                </p>
              </div>
              <Switch
                checked={formData.emailNotifications}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, emailNotifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Tema</CardTitle>
            <CardDescription>
              Selecciona el tema de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, theme: 'light' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.theme === 'light'
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-left">
                  <p className="font-medium text-slate-900">Claro</p>
                  <p className="text-sm text-slate-600">Fondo blanco y texto oscuro</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="h-8 w-8 rounded bg-white border border-slate-300" />
                  <div className="h-8 w-8 rounded bg-slate-100" />
                  <div className="h-8 w-8 rounded bg-slate-900" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, theme: 'dark' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.theme === 'dark'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={formData.theme === 'dark' ? 'text-white' : ''}>
                  <p className={`font-medium ${formData.theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Oscuro
                  </p>
                  <p className={`text-sm ${formData.theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    Fondo oscuro y texto claro
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="h-8 w-8 rounded bg-slate-900 border border-slate-700" />
                  <div className="h-8 w-8 rounded bg-slate-800" />
                  <div className="h-8 w-8 rounded bg-white" />
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-slate-200"
            onClick={() => setFormData(settings)}
            disabled={isLoading}
          >
            Descartar Cambios
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-slate-900 hover:bg-slate-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Configuración'
            )}
          </Button>
        </div>
      </form>

      {/* Settings Summary */}
      <Card className="border-slate-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-slate-900 text-sm">Configuración Actual</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-slate-600 space-y-1">
          <p>
            <span className="font-medium">Organización:</span> {formData.organizationName}
          </p>
          <p>
            <span className="font-medium">Idioma:</span>{' '}
            {formData.language === 'es' ? 'Español' : 'English'}
          </p>
          <p>
            <span className="font-medium">Zona Horaria:</span> {formData.timezone}
          </p>
          <p>
            <span className="font-medium">Notificaciones:</span>{' '}
            {formData.emailNotifications ? 'Habilitadas' : 'Deshabilitadas'}
          </p>
          <p>
            <span className="font-medium">Tema:</span>{' '}
            {formData.theme === 'light' ? 'Claro' : 'Oscuro'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
