import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Badge } from '@/components/ui/badge';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupContent,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { LayoutGrid, CheckSquare, Users, UserCheck, Settings } from 'lucide-react';
import { useEffect, useRef } from 'react';
import AppLogo from './app-logo';
import axios from 'axios';

export function AppSidebar() {
    const page = usePage<SharedData>();
    const { auth, unreadTaskCount } = page.props;
    
    // Don't show badge when user is on the tasks page
    const isOnTasksPage = page.url.startsWith('/tasks');
    
    const lastKnownCount = useRef<number | null>(null);
    const isCheckingRef = useRef(false);
    
    // Smart auto-refresh for notification badge (members only)
    useEffect(() => {
        if (auth.user.role !== 'member' || isOnTasksPage) return;

        const checkForUnreadUpdates = async () => {
            if (isCheckingRef.current) return;
            
            isCheckingRef.current = true;
            
            try {
                const params = lastKnownCount.current !== null
                    ? { last_count: lastKnownCount.current }
                    : {};
                    
                const response = await axios.get('/api/check-updates/unread', { params });
                
                if (lastKnownCount.current === null) {
                    // First check, just store the count
                    lastKnownCount.current = response.data.count;
                } else if (response.data.has_update) {
                    // Count has changed, reload unread count
                    lastKnownCount.current = response.data.count;
                    router.reload({ only: ['unreadTaskCount'] });
                }
            } catch (error) {
                console.error('Error checking unread count:', error);
            } finally {
                isCheckingRef.current = false;
            }
        };

        // Initial check
        checkForUnreadUpdates();

        // Check every 3 seconds
        const interval = setInterval(checkForUnreadUpdates, 3000);
        
        return () => clearInterval(interval);
    }, [auth.user.role, isOnTasksPage]);
    
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'My Tasks',
            href: '/tasks',
            icon: CheckSquare,
            badge: !isOnTasksPage && unreadTaskCount > 0 ? unreadTaskCount : undefined,
        },
    ];

    // Add Team Members link for project managers
    if (auth.user.role === 'superadmin' || auth.user.role === 'project_manager') {
        mainNavItems.push({
            title: 'Team Members',
            href: '/users',
            icon: Users,
        });
        
        // Add Pending Members link for project managers
        mainNavItems.push({
            title: 'Pending Members',
            href: '/team/pending-members',
            icon: UserCheck,
        });
    }

    const userTeam = auth.user?.team;
    const membershipStatus = auth.user?.membership_status;
    const isProjectManager = auth.user.role === 'superadmin' || auth.user.role === 'project_manager';

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
                
                {/* Team Info Section */}
                {userTeam && (
                    <SidebarGroup className="mt-auto">
                        <SidebarGroupContent>
                            <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary overflow-hidden">
                                        {userTeam.photo ? (
                                            <img src={`/storage/${userTeam.photo}`} alt={userTeam.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className="h-4 w-4 text-sidebar-primary-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-sidebar-foreground truncate">{userTeam.name}</p>
                                        {isProjectManager ? (
                                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-blue-500/50 text-blue-600 dark:text-blue-400">
                                                Manager
                                            </Badge>
                                        ) : (
                                            <>
                                                {membershipStatus === 'pending' && (
                                                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-amber-500/50 text-amber-600 dark:text-amber-400">
                                                        Pending
                                                    </Badge>
                                                )}
                                                {membershipStatus === 'approved' && (
                                                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-green-500/50 text-green-600 dark:text-green-400">
                                                        Member
                                                    </Badge>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {isProjectManager && (
                                        <Link 
                                            href={`/team/${userTeam.id}/edit`}
                                            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-sidebar-accent transition-colors"
                                            title="Team Settings"
                                        >
                                            <Settings className="h-3.5 w-3.5 text-sidebar-foreground/70" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
