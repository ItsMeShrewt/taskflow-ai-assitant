import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    badge?: number;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    unreadTaskCount: number;
    [key: string]: unknown;
}

export interface Team {
    id: number;
    name: string;
    code: string;
    photo: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'superadmin' | 'project_manager' | 'frontend_developer' | 'backend_developer' | 'technical_writer' | 'system_analyst' | null;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    team?: Team | null;
    team_id?: number | null;
    membership_status?: string | null;
}
