import { create } from 'zustand'

// Types
export interface TeamMember {
  userId: string
  name: string
  email: string
  position: string
  role: 'Developer' | 'Designer' | 'Manager' | 'DevOps'
  birthdate: string
  phone: string
  projectIds: string[]
  isActive: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  status: 'Planificado' | 'En progreso' | 'En revisión' | 'Completado'
  progress: number
  teamMemberIds: string[]
  createdDate: string
}

export interface Task {
  id: string
  description: string
  projectId: string
  userId: string
  status: 'To Do' | 'In Progress' | 'Done'
  priority: 'Low' | 'Medium' | 'High'
  dateline: string
  createdDate: string
}

export interface Settings {
  organizationName: string
  language: 'es' | 'en'
  timezone: string
  emailNotifications: boolean
  theme: 'light' | 'dark'
}

interface Store {
  // Team Members
  teamMembers: TeamMember[]
  addTeamMember: (member: Omit<TeamMember, 'userId'>) => void
  updateTeamMember: (userId: string, member: Partial<TeamMember>) => void
  deleteTeamMember: (userId: string) => void
  getTeamMember: (userId: string) => TeamMember | undefined

  // Projects
  projects: Project[]
  addProject: (project: Omit<Project, 'id' | 'createdDate'>) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProject: (id: string) => Project | undefined

  // Tasks
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdDate'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTask: (id: string) => Task | undefined
  getTasksByProject: (projectId: string) => Task[]
  getTasksByUser: (userId: string) => Task[]

  // Settings
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void

  // Analytics
  getActiveProjectsCount: () => number
  getTeamMembersCount: () => number
  getCompletedTasksPercentage: () => number
  getCriticalTasks: () => Task[]
}

// Dummy Data
const dummyTeamMembers: TeamMember[] = [
  {
    userId: 'tm1',
    name: 'Tenzing Norgay',
    email: 'tenzing@everest.com',
    position: 'Lead Alpinist',
    role: 'Manager',
    birthdate: '1920-05-15',
    phone: '+1-555-0101',
    projectIds: ['proj1', 'proj2'],
    isActive: true,
  },
  {
    userId: 'tm2',
    name: 'Sherpa Pemba',
    email: 'pemba@everest.com',
    position: 'Senior Guide',
    role: 'Developer',
    birthdate: '1985-03-22',
    phone: '+1-555-0102',
    projectIds: ['proj1'],
    isActive: true,
  },
  {
    userId: 'tm3',
    name: 'Nima Tenji',
    email: 'nima@everest.com',
    position: 'Route Specialist',
    role: 'Developer',
    birthdate: '1990-07-10',
    phone: '+1-555-0103',
    projectIds: ['proj2'],
    isActive: true,
  },
  {
    userId: 'tm4',
    name: 'Karma Sherpa',
    email: 'karma@everest.com',
    position: 'Equipment Officer',
    role: 'DevOps',
    birthdate: '1988-11-05',
    phone: '+1-555-0104',
    projectIds: ['proj1', 'proj3'],
    isActive: true,
  },
  {
    userId: 'tm5',
    name: 'Ang Rita',
    email: 'angrita@everest.com',
    position: 'Medical Officer',
    role: 'Designer',
    birthdate: '1992-09-18',
    phone: '+1-555-0105',
    projectIds: ['proj2', 'proj3'],
    isActive: false,
  },
]

const dummyProjects: Project[] = [
  {
    id: 'proj1',
    title: 'Expedición Khumbu',
    description: 'Ruta principal de acceso al Everest base camp',
    status: 'En progreso',
    progress: 65,
    teamMemberIds: ['tm1', 'tm2', 'tm4'],
    createdDate: '2026-01-15',
  },
  {
    id: 'proj2',
    title: 'Operación Cumbre',
    description: 'Push final a la cumbre del Everest',
    status: 'En progreso',
    progress: 45,
    teamMemberIds: ['tm1', 'tm3', 'tm5'],
    createdDate: '2026-02-01',
  },
  {
    id: 'proj3',
    title: 'Sistema de Campamentos',
    description: 'Infraestructura y logística de campamentos',
    status: 'Planificado',
    progress: 20,
    teamMemberIds: ['tm4', 'tm5'],
    createdDate: '2026-03-10',
  },
]

const dummyTasks: Task[] = [
  {
    id: 'task1',
    description: 'Establecer Campamento Base 1',
    projectId: 'proj1',
    userId: 'tm2',
    status: 'Done',
    priority: 'High',
    dateline: '2026-05-05',
    createdDate: '2026-04-20',
  },
  {
    id: 'task2',
    description: 'Verificar equipos de oxígeno',
    projectId: 'proj1',
    userId: 'tm4',
    status: 'In Progress',
    priority: 'High',
    dateline: '2026-06-01',
    createdDate: '2026-05-15',
  },
  {
    id: 'task3',
    description: 'Aclimatación en Campamento 2',
    projectId: 'proj2',
    userId: 'tm1',
    status: 'To Do',
    priority: 'High',
    dateline: '2026-06-10',
    createdDate: '2026-05-20',
  },
  {
    id: 'task4',
    description: 'Mapeo de rutas alternativas',
    projectId: 'proj2',
    userId: 'tm3',
    status: 'In Progress',
    priority: 'Medium',
    dateline: '2026-06-15',
    createdDate: '2026-05-18',
  },
  {
    id: 'task5',
    description: 'Pruebas de comunicación radio',
    projectId: 'proj1',
    userId: 'tm4',
    status: 'Done',
    priority: 'Medium',
    dateline: '2026-05-28',
    createdDate: '2026-05-10',
  },
  {
    id: 'task6',
    description: 'Preparación de suministros médicos',
    projectId: 'proj3',
    userId: 'tm5',
    status: 'To Do',
    priority: 'High',
    dateline: '2026-07-01',
    createdDate: '2026-05-22',
  },
  {
    id: 'task7',
    description: 'Coordinación logística final',
    projectId: 'proj1',
    userId: 'tm1',
    status: 'In Progress',
    priority: 'Medium',
    dateline: '2026-06-05',
    createdDate: '2026-05-25',
  },
  {
    id: 'task8',
    description: 'Entrenamiento de nuevos guías',
    projectId: 'proj3',
    userId: 'tm2',
    status: 'To Do',
    priority: 'Low',
    dateline: '2026-07-15',
    createdDate: '2026-05-23',
  },
]

const dummySettings: Settings = {
  organizationName: 'Expedición Everest 2026',
  language: 'es',
  timezone: 'UTC+5:45',
  emailNotifications: true,
  theme: 'light',
}

// Store Creation
export const useStore = create<Store>((set, get) => ({
  // Initial State
  teamMembers: dummyTeamMembers,
  projects: dummyProjects,
  tasks: dummyTasks,
  settings: dummySettings,

  // Team Members Actions
  addTeamMember: (member) =>
    set((state) => ({
      teamMembers: [
        ...state.teamMembers,
        {
          ...member,
          userId: `tm${Date.now()}`,
        },
      ],
    })),

  updateTeamMember: (userId, member) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((m) =>
        m.userId === userId ? { ...m, ...member } : m
      ),
    })),

  deleteTeamMember: (userId) =>
    set((state) => ({
      teamMembers: state.teamMembers.filter((m) => m.userId !== userId),
    })),

  getTeamMember: (userId) => {
    const state = get()
    return state.teamMembers.find((m) => m.userId === userId)
  },

  // Projects Actions
  addProject: (project) =>
    set((state) => ({
      projects: [
        ...state.projects,
        {
          ...project,
          id: `proj${Date.now()}`,
          createdDate: new Date().toISOString().split('T')[0],
        },
      ],
    })),

  updateProject: (id, project) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...project } : p
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      tasks: state.tasks.filter((t) => t.projectId !== id),
    })),

  getProject: (id) => {
    const state = get()
    return state.projects.find((p) => p.id === id)
  },

  // Tasks Actions
  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          id: `task${Date.now()}`,
          createdDate: new Date().toISOString().split('T')[0],
        },
      ],
    })),

  updateTask: (id, task) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...task } : t
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  getTask: (id) => {
    const state = get()
    return state.tasks.find((t) => t.id === id)
  },

  getTasksByProject: (projectId) => {
    const state = get()
    return state.tasks.filter((t) => t.projectId === projectId)
  },

  getTasksByUser: (userId) => {
    const state = get()
    return state.tasks.filter((t) => t.userId === userId)
  },

  // Settings Actions
  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),

  // Analytics
  getActiveProjectsCount: () => {
    const state = get()
    return state.projects.filter((p) => p.status !== 'Completado').length
  },

  getTeamMembersCount: () => {
    const state = get()
    return state.teamMembers.filter((m) => m.isActive).length
  },

  getCompletedTasksPercentage: () => {
    const state = get()
    const total = state.tasks.length
    if (total === 0) return 0
    const completed = state.tasks.filter((t) => t.status === 'Done').length
    return Math.round((completed / total) * 100)
  },

  getCriticalTasks: () => {
    const state = get()
    const today = new Date().toISOString().split('T')[0]
    return state.tasks.filter(
      (t) =>
        (t.priority === 'High' || t.status !== 'Done') && t.dateline <= today
    )
  },
}))
