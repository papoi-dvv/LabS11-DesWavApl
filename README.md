# Everest Blanc Dashboard

Este proyecto es un tablero administrativo construido con Next.js App Router, Tailwind CSS, `shadcn/ui` y estado en memoria con Zustand.

## Características

- Vista de `Overview` con métricas clave.
- Gestión de `Proyectos` con creación, edición y eliminación.
- Panel de `Team` con miembros y roles.
- Lista de `Tasks` con estado, prioridad y fechas.
- Página de `Settings` con opciones de perfil y notificaciones.

## Estructura

- `app/dashboard/page.tsx` - layout principal del dashboard y navegación de pestañas.
- `components/ProjectForm.tsx`, `TasksTable.tsx` - componentes UI específicos.
- `components/ProjectsSection.tsx` - CRUD de proyectos.
- `components/TeamSection.tsx` - administración de equipo.
- `components/TasksSection.tsx` - gestión de tareas con paginación.
- `components/SettingsSection.tsx` - configuración del usuario.
- `lib/store.ts` - estado global en memoria con métodos CRUD.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000/dashboard` en tu navegador.

## Producción

Construye el proyecto para producción:

```bash
npm run build
```

Ejecuta la aplicación en modo producción:

```bash
npm start
```

## Notas

- Este proyecto está pensado como una demo interna de dashboard, por lo que los datos se almacenan en memoria y no persisten entre recargas.
- Si usas `shadcn/ui`, puedes adaptar o extender los componentes desde `components/ui`.
