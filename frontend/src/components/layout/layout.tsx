import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    LayoutDashboard,
    Car,
    FileText,
    Map,
    LogOut,
    Truck,
    Settings,
    User
} from 'lucide-react';
import { useAuthStore } from '@/stores';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/fleet', icon: Car, label: 'Flota' },
    { to: '/reports', icon: FileText, label: 'Reportes' },
    { to: '/map', icon: Map, label: 'Mapa' },
];

export const Layout = observer(function Layout() {
    const authStore = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        authStore.logout();
        navigate('/login');
    };

    return (
        <SidebarProvider>
            <Sidebar variant="inset" className="border-r">
                <SidebarHeader className="border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                FlotaManager
                            </h1>
                            <p className="text-xs text-muted-foreground">Gestión de Flotas</p>
                        </div>
                    </div>
                </SidebarHeader>

                <SidebarContent className="px-2 py-4">
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.to}>
                                <SidebarMenuButton asChild>
                                    <NavLink
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive
                                                ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 font-medium'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                            }`
                                        }
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter className="border-t p-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="w-full justify-start text-muted-foreground hover:text-foreground">
                                <Settings className="h-4 w-4 mr-2" />
                                Configuración
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Cerrar Sesión
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 sticky top-0 z-50">
                    <SidebarTrigger className="-ml-2" />
                    <Separator orientation="vertical" className="h-6" />
                    <div className="flex-1" />
                    {/* User info */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                            {authStore.displayName}
                        </span>
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
});
