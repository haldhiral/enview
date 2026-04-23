import { Link } from '@inertiajs/react';
import { Activity, Bell, LayoutDashboard, MonitorCheck } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Devices',
        href: '/devices',
        icon: MonitorCheck,
    },
    {
        title: 'Alerts',
        href: '/alerts',
        icon: Bell,
    },
    {
        title: 'Check-ins',
        href: '/check-ins',
        icon: Activity,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <div className="px-3 py-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                    Internal MVP
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
