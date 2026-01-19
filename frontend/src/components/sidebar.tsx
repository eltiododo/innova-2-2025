import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from '@/stores';
import {
  LayoutDashboard,
  Truck,
  FileText,
  Map,
  LogOut,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    title: 'Flota',
    icon: Truck,
    path: '/fleet',
  },
  {
    title: 'Reportes',
    icon: FileText,
    path: '/reports',
  },
  {
    title: 'Mapa',
    icon: Map,
    path: '/map',
  },
];

export const Sidebar = observer(function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Truck className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">Innova Fleet</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </button>
            );
          })}
        </nav>

        <div className="border-t p-4">
          {authStore.user && (
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-accent px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{authStore.user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{authStore.user.email}</p>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </aside>
  );
});