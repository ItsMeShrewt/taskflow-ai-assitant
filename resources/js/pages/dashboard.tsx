import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { type Task } from '@/types/task';
import { Head, router, usePage } from '@inertiajs/react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Calendar,
  ListTodo,
  ArrowRight,
  BarChart3,
  Target,
  Activity,
  Copy,
  Check,
  Users,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useAutoRefresh } from '@/hooks/use-auto-refresh';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps extends PageProps {
    isPending?: boolean;
    teamName?: string;
    stats: {
        total: number;
        completed: number;
        pending: number;
        in_progress: number;
        urgent: number;
        overdue: number;
    };
    recentTasks?: Task[];
    upcomingTasks?: Task[];
    myRecentTasks?: Task[];
    myUpcomingTasks?: Task[];
    teamRecentTasks?: Task[];
    teamUpcomingTasks?: Task[];
    priorityBreakdown: {
        low: number;
        medium: number;
        high: number;
        urgent: number;
    };
    canManageTasks: boolean;
}

const priorityConfig = {
  low: { label: 'Low', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
  urgent: { label: 'Urgent', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
};

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
};

export default function Dashboard({ 
    isPending,
    teamName,
    stats, 
    recentTasks, 
    upcomingTasks, 
    myRecentTasks,
    myUpcomingTasks,
    teamRecentTasks,
    teamUpcomingTasks,
    priorityBreakdown,
    canManageTasks 
}: DashboardProps) {
    const page = usePage();
    
    // Show pending approval message
    if (isPending) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard - Pending Approval" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-6 p-4 md:p-6">
                    <div className="max-w-2xl text-center">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                            <Clock className="h-12 w-12 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                            Waiting for Approval
                        </h1>
                        <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                            Your request to join <span className="font-semibold text-gray-900 dark:text-white">{teamName}</span> has been sent to the Project Manager.
                        </p>
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-6 w-6 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        You'll be notified once approved
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Once the Project Manager approves your request, you'll gain access to the dashboard and can start working on tasks.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <Button
                                variant="outline"
                                onClick={() => router.reload()}
                            >
                                Check Status
                            </Button>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }
    
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    const flash = page.props.flash as any;
    
    const [showTeamCodeModal, setShowTeamCodeModal] = useState(false);
    const [copied, setCopied] = useState(false);
    
    useEffect(() => {
        if (flash?.teamCode) {
            setShowTeamCodeModal(true);
        }
        
        // Show success toast when member is approved
        if (flash?.memberApproved) {
            toast.success(`🎉 Welcome! You've been accepted to ${flash.teamName || 'the team'}!`, {
                duration: 5000,
                position: 'top-center',
            });
        }
    }, [flash?.teamCode, flash?.memberApproved, flash?.teamName]);
    
    const copyCode = () => {
        if (flash?.teamCode) {
            navigator.clipboard.writeText(flash.teamCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    // For PM: use separate task lists; for members: use regular task lists
    const displayMyRecentTasks = canManageTasks 
        ? (myRecentTasks?.slice(0, 3) ?? [])
        : (recentTasks?.slice(0, 3) ?? []);
    const displayMyUpcomingTasks = canManageTasks 
        ? (myUpcomingTasks?.slice(0, 3) ?? [])
        : (upcomingTasks?.slice(0, 3) ?? []);
    const displayTeamRecentTasks = canManageTasks ? (teamRecentTasks?.slice(0, 3) ?? []) : [];
    const displayTeamUpcomingTasks = canManageTasks ? (teamUpcomingTasks?.slice(0, 3) ?? []) : [];

    // Smart auto-refresh: only reload when dashboard data actually changes
    useAutoRefresh({
        endpoint: '/api/check-updates/dashboard',
        onlyProps: ['stats', 'recentTasks', 'upcomingTasks', 'priorityBreakdown'],
        checkInterval: 3000, // Check every 3 seconds
    });

    const { auth } = page.props;
    const userTeam = auth.user?.team;
    const membershipStatus = auth.user?.membership_status;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                            Overview of your tasks and productivity
                        </p>
                    </div>
                    <Button onClick={() => router.visit('/tasks')}>
                        View All Tasks
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* Membership Status Banners */}
                {!canManageTasks && membershipStatus === 'pending' && (
                    <div className="rounded-lg border-2 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-amber-900 dark:text-amber-200 mb-1">
                                    Membership Pending
                                </h3>
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                    Your request to join <span className="font-semibold">{userTeam?.name || 'the team'}</span> is pending approval. Please wait for the Project Manager to accept your request.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!canManageTasks && membershipStatus === 'approved' && userTeam && (
                    <div className="rounded-lg border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700 p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-gray-900 border-2 border-green-300 dark:border-green-700 overflow-hidden">
                                {userTeam.photo ? (
                                    <img src={`/storage/${userTeam.photo}`} alt={userTeam.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-green-900 dark:text-green-200 mb-1">
                                    Welcome to {userTeam.name}! 🎉
                                </h3>
                                <p className="text-sm text-green-800 dark:text-green-300">
                                    Your membership has been approved by the Project Manager. You're now part of the team and can view tasks assigned to you.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Tasks */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                <ListTodo className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                            </div>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                                <p className="mt-1 text-xs text-green-600 dark:text-green-400">{completionRate}% completion rate</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
                            </div>
                        </div>
                    </div>

                    {/* In Progress */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.in_progress}</p>
                                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Currently working on</p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                            </div>
                        </div>
                    </div>

                    {/* Overdue */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.overdue}</p>
                                {stats.urgent > 0 && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{stats.urgent} urgent</p>
                                )}
                            </div>
                            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-300" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Analytics */}
                    <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
                        <div className="p-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                                    <BarChart3 className="h-4 w-4 text-white" />
                                </div>
                                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Analytics Overview</h2>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Completion Rate */}
                            <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 border border-green-100 dark:border-green-800/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-green-500">
                                        <Target className="h-3 w-3 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-900 dark:text-white">Completion Rate</span>
                                </div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{completionRate}%</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">of all tasks</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-green-100 dark:bg-green-900/30">
                                    <div 
                                        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
                                        style={{ width: `${completionRate}%` }}
                                    />
                                </div>
                            </div>

                            {/* Task Status Distribution */}
                            <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500">
                                        <Activity className="h-3 w-3 text-white" />
                                    </div>
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white">Task Status</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-white dark:hover:bg-gray-900/50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500 ring-2 ring-green-100 dark:ring-green-900/30"></div>
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Completed</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white">{stats.completed}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-white dark:hover:bg-gray-900/50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30"></div>
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">In Progress</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white">{stats.in_progress}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-white dark:hover:bg-gray-900/50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-gray-500 ring-2 ring-gray-100 dark:ring-gray-700"></div>
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Pending</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-900 dark:text-white">{stats.pending}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Priority Distribution */}
                            <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500">
                                        <TrendingUp className="h-3 w-3 text-white" />
                                    </div>
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white">Priority Levels</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Urgent</span>
                                                <span className="text-xs font-bold text-gray-900 dark:text-white">{priorityBreakdown.urgent}</span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-red-100 dark:bg-red-900/20">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out"
                                                    style={{ width: `${stats.total > 0 ? (priorityBreakdown.urgent / stats.total) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">High</span>
                                                <span className="text-xs font-bold text-gray-900 dark:text-white">{priorityBreakdown.high}</span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-orange-100 dark:bg-orange-900/20">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out"
                                                    style={{ width: `${stats.total > 0 ? (priorityBreakdown.high / stats.total) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Medium</span>
                                                <span className="text-xs font-bold text-gray-900 dark:text-white">{priorityBreakdown.medium}</span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/20">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                                                    style={{ width: `${stats.total > 0 ? (priorityBreakdown.medium / stats.total) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Low</span>
                                                <span className="text-xs font-bold text-gray-900 dark:text-white">{priorityBreakdown.low}</span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/30">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-gray-500 to-gray-600 transition-all duration-500 ease-out"
                                                    style={{ width: `${stats.total > 0 ? (priorityBreakdown.low / stats.total) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Urgent & Overdue */}
                            {(stats.urgent > 0 || stats.overdue > 0) && (
                                <div className="rounded-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-3 border border-red-200 dark:border-red-800/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500">
                                                <AlertCircle className="h-3 w-3 text-white" />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-900 dark:text-white">Needs Attention</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xl font-bold text-red-600 dark:text-red-400">{stats.urgent + stats.overdue}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">tasks</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Recent & Upcoming Tasks Combined */}
                    <div className="space-y-6">
                        {/* For PM: Show My Tasks and Team Tasks separately */}
                        {canManageTasks ? (
                            <>
                                {/* My Tasks Section */}
                                <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
                                    <div className="p-6 pb-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Tasks</h2>
                                        </div>
                                    </div>
                                    {displayMyRecentTasks.length > 0 ? (
                                        <div className="px-6 pb-6 space-y-3">
                                        {displayMyRecentTasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="cursor-pointer transition-all hover:scale-[1.02]"
                                                onClick={() => router.visit(`/tasks/${task.id}`)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                                                        task.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/30' :
                                                        task.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                        task.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                        'bg-gray-100 dark:bg-gray-800'
                                                    }`}>
                                                        <ListTodo className={`h-6 w-6 ${
                                                            task.priority === 'urgent' ? 'text-red-600 dark:text-red-400' :
                                                            task.priority === 'high' ? 'text-orange-600 dark:text-orange-400' :
                                                            task.priority === 'medium' ? 'text-blue-600 dark:text-blue-400' :
                                                            'text-gray-600 dark:text-gray-400'
                                                        }`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {statusConfig[task.status].label}
                                                        </p>
                                                    </div>
                                                    <Badge variant="secondary" className={priorityConfig[task.priority].className}>
                                                        {priorityConfig[task.priority].label}
                                                    </Badge>
                                                </div>
                                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                                    <div 
                                                        className={`h-full ${
                                                            task.status === 'completed' ? 'bg-green-500' :
                                                            task.status === 'in_progress' ? 'bg-blue-500' :
                                                            'bg-gray-300 dark:bg-gray-600'
                                                        }`}
                                                        style={{ 
                                                            width: task.status === 'completed' ? '100%' : 
                                                                   task.status === 'in_progress' ? '60%' : '20%' 
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 pb-6">No tasks assigned to you</p>
                                )}
                            </div>
                            
                            {/* Team Tasks Section */}
                            <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
                                <div className="p-6 pb-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Team Tasks</h2>
                                    </div>
                                </div>
                                {displayTeamRecentTasks.length > 0 ? (
                                    <div className="px-6 pb-6 space-y-3">
                                    {displayTeamRecentTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="cursor-pointer transition-all hover:scale-[1.02]"
                                            onClick={() => router.visit(`/tasks/${task.id}`)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                                                    task.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/30' :
                                                    task.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                    task.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                    'bg-gray-100 dark:bg-gray-800'
                                                }`}>
                                                    <ListTodo className={`h-6 w-6 ${
                                                        task.priority === 'urgent' ? 'text-red-600 dark:text-red-400' :
                                                        task.priority === 'high' ? 'text-orange-600 dark:text-orange-400' :
                                                        task.priority === 'medium' ? 'text-blue-600 dark:text-blue-400' :
                                                        'text-gray-600 dark:text-gray-400'
                                                    }`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {statusConfig[task.status].label}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary" className={priorityConfig[task.priority].className}>
                                                    {priorityConfig[task.priority].label}
                                                </Badge>
                                            </div>
                                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                                <div 
                                                    className={`h-full ${
                                                        task.status === 'completed' ? 'bg-green-500' :
                                                        task.status === 'in_progress' ? 'bg-blue-500' :
                                                        'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                                    style={{ 
                                                        width: task.status === 'completed' ? '100%' : 
                                                               task.status === 'in_progress' ? '60%' : '20%' 
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 pb-6">No tasks assigned to team members</p>
                            )}
                        </div>
                        </>
                        ) : (
                            /* For Members: Show Recent Tasks */
                            <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
                                <div className="p-6 pb-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
                                    </div>
                                </div>
                                {displayMyRecentTasks.length > 0 ? (
                                    <div className="px-6 pb-6 space-y-3">
                                    {displayMyRecentTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="cursor-pointer transition-all hover:scale-[1.02]"
                                            onClick={() => router.visit(`/tasks/${task.id}`)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                                                    task.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/30' :
                                                    task.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                    task.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                    'bg-gray-100 dark:bg-gray-800'
                                                }`}>
                                                    <ListTodo className={`h-6 w-6 ${
                                                        task.priority === 'urgent' ? 'text-red-600 dark:text-red-400' :
                                                        task.priority === 'high' ? 'text-orange-600 dark:text-orange-400' :
                                                        task.priority === 'medium' ? 'text-blue-600 dark:text-blue-400' :
                                                        'text-gray-600 dark:text-gray-400'
                                                    }`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {statusConfig[task.status].label}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary" className={priorityConfig[task.priority].className}>
                                                    {priorityConfig[task.priority].label}
                                                </Badge>
                                            </div>
                                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                                <div 
                                                    className={`h-full ${
                                                        task.status === 'completed' ? 'bg-green-500' :
                                                        task.status === 'in_progress' ? 'bg-blue-500' :
                                                        'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                                    style={{ 
                                                        width: task.status === 'completed' ? '100%' : 
                                                               task.status === 'in_progress' ? '60%' : '20%' 
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 pb-6">No tasks yet</p>
                            )}
                        </div>
                        )}

                    {/* Upcoming Deadlines */}
                    <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
                        <div className="p-6 pb-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
                            </div>
                        </div>
                        {displayMyUpcomingTasks.length > 0 ? (
                            <div className="px-6 pb-6 space-y-3">
                                {displayMyUpcomingTasks.map((task) => {
                                    const daysUntilDue = task.due_date 
                                        ? Math.ceil((new Date(task.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                        : null;
                                    const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
                                    const isDueSoon = daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 3;
                                    
                                    return (
                                        <div
                                            key={task.id}
                                            className="cursor-pointer transition-all hover:scale-[1.02]"
                                            onClick={() => router.visit(`/tasks/${task.id}`)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                                                    isOverdue ? 'bg-red-100 dark:bg-red-900/30' :
                                                    isDueSoon ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                    'bg-blue-100 dark:bg-blue-900/30'
                                                }`}>
                                                    <Calendar className={`h-6 w-6 ${
                                                        isOverdue ? 'text-red-600 dark:text-red-400' :
                                                        isDueSoon ? 'text-orange-600 dark:text-orange-400' :
                                                        'text-blue-600 dark:text-blue-400'
                                                    }`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {task.due_date ? (
                                                            isOverdue ? 
                                                                `${Math.abs(daysUntilDue!)} days overdue` :
                                                                daysUntilDue === 0 ? 'Due today' :
                                                                daysUntilDue === 1 ? 'Due tomorrow' :
                                                                `${daysUntilDue} days left`
                                                        ) : 'No due date'}
                                                    </p>
                                                </div>
                                                {task.due_date && (
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {format(new Date(task.due_date), 'MMM dd')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                                <div 
                                                    className={`h-full ${
                                                        isOverdue ? 'bg-red-500' :
                                                        isDueSoon ? 'bg-orange-500' :
                                                        'bg-blue-500'
                                                    }`}
                                                    style={{ 
                                                        width: isOverdue ? '100%' : 
                                                               isDueSoon ? '70%' : 
                                                               daysUntilDue !== null ? `${Math.max(20, Math.min(100, 100 - (daysUntilDue * 10)))}%` : '50%'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 pb-6">No upcoming deadlines</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Priority Breakdown */}
                <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Active Tasks by Priority</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border p-4 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Low</span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{priorityBreakdown.low}</p>
                        </div>
                        <div className="rounded-lg border p-4 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Medium</span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{priorityBreakdown.medium}</p>
                        </div>
                        <div className="rounded-lg border p-4 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">High</span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{priorityBreakdown.high}</p>
                        </div>
                        <div className="rounded-lg border p-4 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Urgent</span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{priorityBreakdown.urgent}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Team Code Modal */}
            <Dialog open={showTeamCodeModal} onOpenChange={setShowTeamCodeModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl">Team Created Successfully! 🎉</DialogTitle>
                        <DialogDescription className="text-center">
                            {flash?.teamName && <p className="mt-2">Your team "{flash.teamName}" is ready!</p>}
                            <p className="mt-1">Share this code with your team members:</p>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                Your Team Code
                            </label>
                            <div className="flex items-center justify-center gap-3">
                                <div className="bg-white px-6 py-3 rounded-lg border-2 border-blue-300">
                                    <code className="text-2xl font-mono font-bold text-blue-600 tracking-widest">
                                        {flash?.teamCode}
                                    </code>
                                </div>
                                <Button
                                    onClick={copyCode}
                                    variant="outline"
                                    size="lg"
                                    className="border-blue-300 hover:bg-blue-50"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-5 h-5 mr-2 text-green-600" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5 mr-2" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                            <p className="text-gray-700">
                                <strong>Important:</strong> Team members will need this code to join your team. 
                                You can also find pending member requests in the "Pending Members" section.
                            </p>
                        </div>
                        <Button 
                            onClick={() => setShowTeamCodeModal(false)}
                            className="w-full"
                        >
                            Got it!
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
