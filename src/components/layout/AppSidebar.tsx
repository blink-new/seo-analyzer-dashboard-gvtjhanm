import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { 
  BarChart3, 
  Search, 
  History, 
  Settings,
  Zap,
  Link
} from 'lucide-react'

interface AppSidebarProps {
  currentPage: string
  onPageChange: (page: 'dashboard' | 'analysis' | 'history' | 'settings' | 'integrations') => void
}

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: BarChart3,
  },
  {
    id: 'analysis',
    title: 'Analysis',
    icon: Search,
  },
  {
    id: 'history',
    title: 'History',
    icon: History,
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: Link,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
  },
]

export function AppSidebar({ currentPage, onPageChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">SEOSE Analyzer</h1>
            <p className="text-xs text-sidebar-foreground/60">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => onPageChange(item.id as any)}
                isActive={currentPage === item.id}
                className="w-full justify-start"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}